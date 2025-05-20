#!/bin/bash

# ==============================================================================
# Script: install.sh
# Description: Downloads a selected version of Chrome for Testing, installs it,
#              and generates a shell script with aliases/functions to launch it
#              with various configurations.
# ==============================================================================

# Strict Mode: Exit on error, exit on unset variables, pipe failure check
set -euo pipefail

# --- Configuration ---

# URLs to fetch Chrome for Testing versions and download links
LAST_KNOWN_GOOD_URL="https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json"
MILESTONE_VERSIONS_URL="https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone.json"
JSON_URL="$LAST_KNOWN_GOOD_URL"  # Default URL, may be changed based on arguments

# Base directory for installation (within $HOME)
INSTALL_DIR_BASE="$HOME/bin"

# Subdirectory name within the base directory for this specific installation
INSTALL_SUBDIR="Chrome_for_Testing"

# Full path for the installation directory
INSTALL_DIR="${INSTALL_DIR_BASE}/${INSTALL_SUBDIR}"

# Full path for the generated alias/function script file
ALIAS_SCRIPT_PATH="$HOME/bin/chrome_launcher.sh"

# --- Global Variables ---
# Avoid relying heavily on globals; prefer passing as arguments where feasible.
# These are kept for now as they track the script's state across functions.
FETCHED_JSON_DATA=""
AVAILABLE_CHANNELS=()
SELECTED_CHANNEL=""
SELECTED_VERSION=""
DETECTED_PLATFORM=""
DOWNLOAD_URL=""
CHROME_EXECUTABLE_PATH=""
DOWNLOADED_ZIP_FILENAME=""
LATEST_PSAT_VERSION="v0.14.1"  # Default PSAT version, will be updated by fetch_latest_psat_version

# Command-line argument variables
OVERRIDE_CHANNEL=""
OVERRIDE_PSAT_VERSION=""
OVERRIDE_CHROME_VERSION=""
UNINSTALL_MODE=false

# --- Helper Functions ---

# Function to clean up all files created by this script
cleanup() {
  echo "Cleaning up..."

  # Delete Chrome installation directory
  if [[ -d "$INSTALL_DIR" ]]; then
    echo "Removing Chrome installation directory: $INSTALL_DIR"
    rm -rf "$INSTALL_DIR" || echo "Warning: Failed to remove installation directory: $INSTALL_DIR"
  fi

  # Delete launcher script
  if [[ -f "$ALIAS_SCRIPT_PATH" ]]; then
    echo "Removing launcher script: $ALIAS_SCRIPT_PATH"
    rm -f "$ALIAS_SCRIPT_PATH" || echo "Warning: Failed to remove launcher script: $ALIAS_SCRIPT_PATH"
  fi

  # Delete cache directory
  local cache_dir="$HOME/.cache/chrome_for_testing"
  if [[ -d "$cache_dir" ]]; then
    echo "Removing cache directory: $cache_dir"
    rm -rf "$cache_dir" || echo "Warning: Failed to remove cache directory: $cache_dir"
  fi

  # Delete PSAT extension files
  # Note: We don't know the exact version, so we'll remove all ps-analysis-tool directories
  local base_extension_dir="/var/tmp"
  local psat_dirs=("$base_extension_dir"/ps-analysis-tool-*)
  local psat_zips=("$base_extension_dir"/extension-*.zip)

  # Check if there are any matching directories
  if [[ -d "${psat_dirs[0]}" ]]; then
    echo "Removing PSAT extension directories from: $base_extension_dir"
    for dir in "${psat_dirs[@]}"; do
      echo "  - Removing: $dir"
      rm -rf "$dir" || echo "Warning: Failed to remove extension directory: $dir"
    done
  fi

  # Check if there are any matching zip files
  if [[ -f "${psat_zips[0]}" ]]; then
    echo "Removing PSAT extension zip files from: $base_extension_dir"
    for zip in "${psat_zips[@]}"; do
      echo "  - Removing: $zip"
      rm -f "$zip" || echo "Warning: Failed to remove extension zip: $zip"
    done
  fi

  echo "Cleanup complete."
}

# Function to display error messages and exit
# Input: $1 - Error message string
error_exit() {
  echo ""
  echo "Error: Line ${BASH_LINENO[0]}: $1" >&2
  echo "Exiting." >&2
  exit 1
}

# Function to display usage information
display_usage() {
  echo "Usage: $0 [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --chrome-channel CHANNEL    Override the installation channel (Stable, Beta, Dev, Canary)"
  echo "  --chrome-version VER        Override the Chrome version to be installed (specific milestone number, e.g., 128)"
  echo "  --psat-version VER          Override the PSAT version to be installed"
  echo "  --uninstall                 Remove all files created by this script and exit"
  echo "  --help                      Display this help message and exit"
  echo ""
  echo "Examples:"
  echo "  $0 --chrome-channel Beta"
  echo "  $0 --chrome-version 128"
  echo "  $0 --psat-version v0.14.1"
  echo ""
}

# Parse command-line arguments
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --chrome-channel)
        if [[ -z "$2" || "$2" == --* ]]; then
          error_exit "The --chrome-channel option requires an argument."
        fi
        OVERRIDE_CHANNEL="$2"
        shift 2
        ;;
      --chrome-version)
        if [[ -z "$2" || "$2" == --* ]]; then
          error_exit "The --chrome-version option requires an argument."
        fi
        if ! [[ "$2" =~ ^[0-9]+$ ]]; then
          error_exit "The --chrome-version option requires a numeric milestone (e.g., 128)."
        fi
        OVERRIDE_CHROME_VERSION="$2"
        shift 2
        ;;
      --psat-version)
        if [[ -z "$2" || "$2" == --* ]]; then
          error_exit "The --psat-version option requires an argument."
        fi
        OVERRIDE_PSAT_VERSION="$2"
        shift 2
        ;;
      --help)
        display_usage
        exit 0
        ;;
      --uninstall)
        UNINSTALL_MODE=true
        shift
        ;;
      *)
        echo "Unknown option: $1"
        display_usage
        exit 1
        ;;
    esac
  done
}

# --- Core Functions ---

# Displays an introductory message to the user
display_intro() {
  echo "=============================================="
  echo " Chrome for Testing Setup Script"
  echo "=============================================="
  echo "Installing Chrome for Testing..."
  echo ""
}

# Checks if required command-line tools (curl, unzip, jq) are installed
check_prerequisites() {
  echo "Checking prerequisites..."
  local tool
  for tool in curl unzip jq; do
    if ! command -v "$tool" &> /dev/null; then
      error_exit "Tool '$tool' not found. Please install it and try again."
    fi
  done
  echo "Prerequisites met."
  echo ""
}

# Fetches the latest PSAT version from the GitHub repository
# Updates the global LATEST_PSAT_VERSION variable
fetch_latest_psat_version() {
  echo "Fetching latest PSAT version..."

  # Skip if version was overridden via command line argument
  if [[ -n "$OVERRIDE_PSAT_VERSION" ]]; then
    echo "Using specified PSAT version: $OVERRIDE_PSAT_VERSION"

    # Ensure version has 'v' prefix for download URL
    local download_version="$OVERRIDE_PSAT_VERSION"
    if [[ "$download_version" != v* ]]; then
      download_version="v$download_version"
    fi

    # Check if the extension URL is valid (only if version was overridden)
    local extension_url="https://github.com/GoogleChromeLabs/ps-analysis-tool/releases/download/$download_version/extension-$download_version.zip"
    echo "Checking if PSAT extension URL is valid: $extension_url"

    # Use curl to check if the URL exists (returns 404 if not)
    if ! curl --output /dev/null --silent --head --fail "$extension_url"; then
      error_exit "PSAT version $OVERRIDE_PSAT_VERSION is invalid. The extension URL returns 404 Not Found: $extension_url"
    fi

    echo "PSAT extension URL is valid."
    LATEST_PSAT_VERSION="$OVERRIDE_PSAT_VERSION"
    return 0
  fi

  # Fetch the package.json from GitHub repository
  local package_url="https://raw.githubusercontent.com/GoogleChromeLabs/ps-analysis-tool/main/packages/extension/package.json"
  echo "Fetching PSAT package.json from: $package_url"
  local package_json
  package_json=$(curl -s -f -L "$package_url") || {
    echo "Warning: Failed to fetch package.json from $package_url for PSAT. Using default version: $LATEST_PSAT_VERSION"
    return 0
  }

  # Extract the version from package.json
  local latest_version
  latest_version=$(echo "$package_json" | jq -r '.version')

  if [[ -z "$latest_version" || "$latest_version" == "null" ]]; then
    echo "Warning: Could not determine latest PSAT version. Using default version."
    return 0
  fi

  # Add 'v' prefix to match the format used in the current version
  LATEST_PSAT_VERSION="v$latest_version"

  echo "Latest PSAT version: $LATEST_PSAT_VERSION"
  echo ""
}

# Fetches the JSON data containing version information from the specified URL
# Stores result in global FETCHED_JSON_DATA
fetch_json_data() {
  echo "Fetching version data from: $JSON_URL"

  # Fetch JSON data using curl: Silent (-s), Fail fast (-f), Follow redirects (-L)
  # Use a temporary variable to check curl's success before assigning to global
  local fetched_data
  fetched_data=$(curl -s -f -L "$JSON_URL") || error_exit "Failed to fetch data from $JSON_URL"

  # Check if data was fetched
  if [[ -z "$fetched_data" ]]; then
    error_exit "Empty response from $JSON_URL"
  fi

  FETCHED_JSON_DATA="$fetched_data"
  echo "Data fetched successfully from: $JSON_URL"
  echo ""
}

# Parse channels from JSON data
# Input: $1 - JSON data string
# Stores result in global AVAILABLE_CHANNELS array
parse_channels() {
  local json_data="$1"

  echo "Parsing channels or milestones..."

  # Check if we're using the milestone-specific JSON format
  if [[ -n "$OVERRIDE_CHROME_VERSION" ]]; then
    echo "Using milestone-specific format."

    # Check if the milestone exists in the JSON data
    local milestone_exists
    milestone_exists=$(echo "$json_data" | jq -r --arg milestone "$OVERRIDE_CHROME_VERSION" '.milestones | has($milestone)')

    if [[ "$milestone_exists" != "true" ]]; then
      error_exit "Chrome milestone $OVERRIDE_CHROME_VERSION not found in available versions. Please check the milestone number and try again."
    fi

    # For milestone-specific JSON, we don't need to parse channels
    # Just create a dummy channel array with the milestone
    AVAILABLE_CHANNELS=("Milestone-$OVERRIDE_CHROME_VERSION")

    echo "Using Chrome milestone: $OVERRIDE_CHROME_VERSION"
    echo ""
    return
  fi

  # For channel-based JSON, extract channel keys using jq
  local parsed_channels
  # Capture jq output, check exit status, don't suppress stderr
  parsed_channels=$(echo "$json_data" | jq -r '.channels | keys[]')
  local jq_exit_code=$?

  if [[ $jq_exit_code -ne 0 ]]; then
    error_exit "jq failed to parse channels. Check JSON format or jq installation. jq stderr might contain details."
  fi
  if [[ -z "$parsed_channels" ]]; then
    error_exit "No channels found in the JSON data."
  fi

  # Read the channels into the global array
  # Check bash version and use appropriate method to populate array
  if ((BASH_VERSINFO[0] >= 4)); then
      # Bash 4.0 or newer - use readarray
      readarray -t AVAILABLE_CHANNELS < <(echo "$parsed_channels")
  else
      # Older bash - use compatible method
      AVAILABLE_CHANNELS=()
      while IFS= read -r line; do
          AVAILABLE_CHANNELS+=("$line")
      done < <(echo "$parsed_channels")
  fi

  echo "Found ${#AVAILABLE_CHANNELS[@]} channels."
  echo "Available channels: ${AVAILABLE_CHANNELS[*]}"
  echo ""
}

# Prompts the user to select a channel from the available list or uses the override
# Input: $@ - Array of available channel strings
# Stores result in global SELECTED_CHANNEL and SELECTED_VERSION
prompt_user_for_channel() {
  local channels=("$@")

  # Handle chrome-version override (milestone)
  if [[ -n "$OVERRIDE_CHROME_VERSION" ]]; then
    echo "Processing Chrome milestone version: $OVERRIDE_CHROME_VERSION"

    # Check if the milestone exists in the JSON data
    local milestone_exists
    milestone_exists=$(echo "$FETCHED_JSON_DATA" | jq -r --arg milestone "$OVERRIDE_CHROME_VERSION" '.milestones | has($milestone)')

    if [[ "$milestone_exists" == "true" ]]; then
      # Get the version for this milestone
      SELECTED_VERSION=$(echo "$FETCHED_JSON_DATA" | jq -r --arg milestone "$OVERRIDE_CHROME_VERSION" '.milestones[$milestone].version')
      SELECTED_CHANNEL="Milestone-$OVERRIDE_CHROME_VERSION"
      echo "Using Chrome milestone $OVERRIDE_CHROME_VERSION (version: $SELECTED_VERSION)"
      return
    else
      error_exit "Chrome milestone $OVERRIDE_CHROME_VERSION not found in available versions. Please check the milestone number and try again."
    fi
  fi

  # Check if a channel override is provided
  if [[ -n "$OVERRIDE_CHANNEL" ]]; then
    # Convert the override channel to title case (first letter uppercase, rest lowercase)
    local channel_title_case
    channel_title_case=$(echo "$OVERRIDE_CHANNEL" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')

    # Check if the title-cased override is a valid channel name
    local channel_found=false
    local actual_channel=""

    for channel in "${channels[@]}"; do
      if [[ "$channel" == "$channel_title_case" ]]; then
        channel_found=true
        actual_channel="$channel"
        break
      fi
    done

    if [[ "$channel_found" == "true" ]]; then
      SELECTED_CHANNEL="$actual_channel"
      SELECTED_VERSION=$(echo "$FETCHED_JSON_DATA" | jq -r --arg channel "$SELECTED_CHANNEL" '.channels[$channel].version')
      echo "Using specified channel: $SELECTED_CHANNEL (version: $SELECTED_VERSION)"
    else
      # If the channel is not valid, exit with an error
      error_exit "Invalid channel name: '$OVERRIDE_CHANNEL'. Valid channels are: ${channels[*]}"
    fi
  else
    # If no override, automatically select the Stable channel
    SELECTED_CHANNEL="Stable"
    SELECTED_VERSION=$(echo "$FETCHED_JSON_DATA" | jq -r --arg channel "$SELECTED_CHANNEL" '.channels[$channel].version')
    echo "Automatically selected channel: $SELECTED_CHANNEL (version: $SELECTED_VERSION)"
  fi

  echo ""
}

# Detects the operating system and architecture to determine the platform string
# Stores result in global DETECTED_PLATFORM
detect_platform() {
  echo "Detecting platform (OS and Architecture)..."
  local os
  local arch
  os=$(uname -s)
  arch=$(uname -m)

  case "$os" in
    Linux)
      case "$arch" in
        x86_64) DETECTED_PLATFORM="linux64";;
        # Note: Support for linux-arm64 depends on it being available in the JSON source
        arm64|aarch64) DETECTED_PLATFORM="linux-arm64"; echo "Note: linux-arm64 support depends on availability in JSON source.";;
        *) error_exit "Unsupported Linux architecture: $arch";;
      esac
      ;;
    Darwin) # macOS
      case "$arch" in
        x86_64) DETECTED_PLATFORM="mac-x64";;
        arm64) DETECTED_PLATFORM="mac-arm64";;
        *) error_exit "Unsupported macOS architecture: $arch";;
      esac
      ;;
    *)
      error_exit "Unsupported Operating System: $os";;
  esac
  echo "Detected platform: $DETECTED_PLATFORM"
  echo ""
}

# Constructs the download URL for the selected version and platform
# Input: $1 - Selected version
# Input: $2 - Detected platform string
# Stores result in global DOWNLOAD_URL
get_download_url() {
  local version="$1"
  local platform="$2"
  echo "Constructing download URL for version $version on $platform..."

  # Construct the URL based on the version and platform
  # Format: https://storage.googleapis.com/chrome-for-testing-public/[VERSION]/[PLATFORM]/chrome-[PLATFORM].zip
  local url="https://storage.googleapis.com/chrome-for-testing-public/${version}/${platform}/chrome-${platform}.zip"

  DOWNLOAD_URL="$url"
  echo "Download URL constructed."
  echo "Download URL: $DOWNLOAD_URL"
  echo ""
}

# Creates the target installation directory if it doesn't exist
prepare_install_dir() {
  echo "Preparing installation directory: $INSTALL_DIR"
  mkdir -p "$INSTALL_DIR" || error_exit "Failed to create directory: $INSTALL_DIR"
  echo "Directory ready: $INSTALL_DIR"
  echo ""
}

# Downloads the Chrome for Testing archive
# Input: $1 - Download URL
# Input: $2 - Target directory path
# Input: $3 - Platform string
# Input: $4 - Version
# Input: $5 - Channel
# Sets global DOWNLOADED_ZIP_FILENAME
download_chrome() {
  local url="$1"
  local target_dir="$2"
  local platform="$3"
  local version="$4"
  local channel="$5"
  DOWNLOADED_ZIP_FILENAME="chrome-${platform}-${channel}-${version}.zip"
  local target_zip_path="${target_dir}/${DOWNLOADED_ZIP_FILENAME}"

  echo "Downloading Chrome for Testing (version: $version, platform: $platform, channel: $channel)..."
  echo "Downloading from: $url"
  echo "Saving to: $target_zip_path"
  # Download using curl with progress bar (-#)
  curl -L -# -o "$target_zip_path" "$url" || error_exit "Download failed for: $url"
  echo "Download complete: $target_zip_path"
  echo ""
}

# Extracts the downloaded Chrome archive
# Input: $1 - Target directory path
# Input: $2 - Zip filename
extract_chrome() {
  local target_dir="$1"
  local zip_filename="$2"
  local target_zip_path="${target_dir}/${zip_filename}"

  echo "Extracting archive: $target_zip_path"
  echo "Extracting to directory: $target_dir"
  # Use unzip: overwrite (-o), quiet (-q)
  unzip -oq "$target_zip_path" -d "$target_dir" || error_exit "Extraction failed for archive: $target_zip_path. Archive might be corrupted."
  echo "Extraction complete to: $target_dir"
  echo ""
}

# Finds the path to the main Chrome executable within the extracted files
# Input: $1 - Target installation directory path
# Input: $2 - Platform string ("linux64", "mac-x64", "mac-arm64", etc.)
# Stores result in global CHROME_EXECUTABLE_PATH
find_chrome_executable() {
  local target_dir="$1"
  local platform="$2"
  echo "Locating Chrome executable..."

  local found_path=""
  local search_path_pattern="" # Store pattern for error message

  # Find executable based on platform
  if [[ "$platform" == "linux64" || "$platform" == "linux-arm64" ]]; then
    # Linux: Expect 'chrome' binary inside a directory like 'chrome-linux64'
    search_path_pattern="${target_dir}/chrome-${platform}/chrome"
    # Use find to be more robust against exact directory name variations if needed
    found_path=$(find "$target_dir" -ipath "*/chrome-${platform}/chrome" -type f -executable -print -quit)
  elif [[ "$platform" == "mac-x64" || "$platform" == "mac-arm64" ]]; then
    # macOS: Expect binary inside .app bundle
    # Path pattern: */Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
    search_path_pattern="*/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
    # Use find to locate the .app structure robustly
    found_path=$(find "$target_dir" -ipath "$search_path_pattern" -type f -perm +111 -print -quit)
  else
    # Fallback or error for unknown platforms handled by detect_platform
    error_exit "Internal error: find_chrome_executable called with unknown platform '$platform'."
  fi

  # Verify the executable was found
  if [[ -z "$found_path" ]]; then
    error_exit "Could not locate the Chrome executable. Expected pattern like '$search_path_pattern' within '$target_dir'."
  fi

  # Ensure the path is absolute using realpath
  CHROME_EXECUTABLE_PATH=$(realpath "$found_path") || error_exit "Failed to resolve absolute path for '$found_path'."

  echo "Executable found: $CHROME_EXECUTABLE_PATH"
  echo ""
}

# Removes the downloaded zip archive after extraction
# Input: $1 - Target directory path
# Input: $2 - Zip filename
cleanup_download() {
  local target_dir="$1"
  local zip_filename="$2"
  local target_zip_path="${target_dir}/${zip_filename}"

  echo "Cleaning up downloaded archive: $target_zip_path"
  rm -f "$target_zip_path" || echo "Warning: Failed to remove archive: $target_zip_path"
  echo "Cleanup of downloaded archive complete."
  echo ""
}

# Generates the alias/function script file with the correct Chrome path embedded
# Input: $1 - Absolute path to the Chrome executable
# Input: $2 - Full path for the alias script file to be created
generate_alias_script() {
  local chrome_exec_path="$1"
  local alias_file_path="$2"

  echo "Generating launcher script: $alias_file_path"
  echo "Using Chrome executable: $chrome_exec_path"

  # Check if the executable path is valid
  if [[ ! -x "$chrome_exec_path" ]]; then
      error_exit "Internal error: Chrome executable path '$chrome_exec_path' is not valid or not executable."
  fi

  # IMPORTANT: Use the comprehensive alias structure provided initially.
  # Escape the chrome path for use within the here-document if it contains special chars
  # Although unlikely for realpath output, it's safer.
  # However, direct substitution should be fine here.

  # Create or overwrite the target script file using a Heredoc
cat > "$alias_file_path" << EOF
#!/bin/bash
# This file is auto-generated by setup_chrome_testing.sh. Do not edit directly.
# Generated on $(date) for Chrome $SELECTED_CHANNEL channel, version $SELECTED_VERSION ($DETECTED_PLATFORM)

# --- Setup ---
# Store the path to the specific Chrome for Testing executable managed by this script
export CHROME_FOR_TESTING_PATH="$chrome_exec_path"
export CHROME_FOR_TESTING_CHANNEL="$SELECTED_CHANNEL"
export CHROME_FOR_TESTING_VERSION="$SELECTED_VERSION"
export CHROME_FOR_TESTING_MILESTONE="${OVERRIDE_CHROME_VERSION:-}"
export PSAT_VERSION_OVERRIDE="${OVERRIDE_PSAT_VERSION:-}"
export PSAT_VERSION="$LATEST_PSAT_VERSION"  # Latest PSAT version, can be updated by check_psat_update

# --- Cache Functions ---

# Cache directory for update checks
CHROME_UPDATE_CACHE_DIR="\$HOME/.cache/chrome_for_testing"

# Initialize cache directory
init_cache_dir() {
  if [[ ! -d "\$CHROME_UPDATE_CACHE_DIR" ]]; then
    mkdir -p "\$CHROME_UPDATE_CACHE_DIR" || {
      echo "Warning: Failed to create cache directory. Update checks will not be cached."
      return 1
    }
  fi
  return 0
}

# Check if cache is valid (less than one day old)
# Input: $1 - Cache file path
is_cache_valid() {
  local cache_file="\$1"

  # Check if cache file exists
  if [[ ! -f "\$cache_file" ]]; then
    return 1
  fi

  # Get current time and file modification time in seconds since epoch
  local current_time=\$(date +%s)
  local file_time=\$(stat -c %Y "\$cache_file" 2>/dev/null || stat -f %m "\$cache_file" 2>/dev/null)

  # Check if stat command failed
  if [[ -z "\$file_time" ]]; then
    return 1
  fi

  # Calculate age in seconds
  local age=\$(( current_time - file_time ))

  # Check if age is less than one day (86400 seconds)
  if [[ \$age -lt 86400 ]]; then
    return 0
  else
    return 1
  fi
}

# --- Update Checker Functions ---

# Check if there's a newer version of Chrome available for the installed channel
check_chrome_update() {
  local current_channel="\$CHROME_FOR_TESTING_CHANNEL"
  local current_version="\$CHROME_FOR_TESTING_VERSION"
  local current_milestone="\$CHROME_FOR_TESTING_MILESTONE"
  local json_url=""
  local cache_file=""
  local latest_version=""
  local update_args=""

  echo "Checking for Chrome updates..."
  echo "Current: \$current_channel channel, version \$current_version"

  # Initialize cache directory
  init_cache_dir

  # Determine which JSON URL to use based on how Chrome was installed
  if [[ -n "\$current_milestone" ]]; then
    # Chrome was installed using a specific milestone
    json_url="https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone.json"
    cache_file="\$CHROME_UPDATE_CACHE_DIR/chrome_milestone_\${current_milestone}_update.json"
    update_args="--chrome-version \$current_milestone"
  else
    # Chrome was installed using a channel
    json_url="https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json"
    cache_file="\$CHROME_UPDATE_CACHE_DIR/chrome_\${current_channel}_update.json"
    update_args="--chrome-channel \$current_channel"
  fi

  # Check if cache is valid
  if is_cache_valid "\$cache_file"; then
    echo "Using cached update information (less than 1 day old)"
    # Read latest version from cache
    latest_version=\$(cat "\$cache_file")
  else
    echo "Fetching update information from \$json_url..."
    # Fetch the latest version data
    local json_data
    json_data=\$(curl -s -f -L "\$json_url") || {
      echo "Warning: Failed to check for updates. Continuing with current version."
      return 0
    }

    # Extract the latest version based on how Chrome was installed
    if [[ -n "\$current_milestone" ]]; then
      # For milestone-based installation
      latest_version=\$(echo "\$json_data" | jq -r --arg milestone "\$current_milestone" '.milestones[\$milestone].version')
    else
      # For channel-based installation
      latest_version=\$(echo "\$json_data" | jq -r --arg channel "\$current_channel" '.channels[\$channel].version')
    fi

    if [[ -z "\$latest_version" || "\$latest_version" == "null" ]]; then
      echo "Warning: Could not determine latest version. Continuing with current version."
      return 0
    fi

    # Cache the latest version
    echo "\$latest_version" > "\$cache_file" || echo "Warning: Failed to cache update information."
  fi

  echo "Latest available: \$latest_version"

  # Compare versions (simple string comparison, assumes semantic versioning)
  if [[ "\$latest_version" != "\$current_version" ]]; then
    echo "A newer version of Chrome is available."
    echo "Current: \$current_version"
    echo "Latest:  \$latest_version"

    # Prompt user to update
    read -p "Would you like to update Chrome for Testing now? (y/n) " -n 1 -r
    echo
    if [[ \$REPLY =~ ^[Yy]$ ]]; then
      echo "Downloading and executing the latest setup script to update Chrome..."
      # Download the latest setup script from the repository
      local temp_script="/tmp/setup_chrome_testing_latest.sh"

      # TODO: Update this URL from `launcher-update` to `main` after testing and before merging to `main`
      echo "Downloading latest script from: https://raw.githubusercontent.com/GoogleChromeLabs/ps-analysis-tool/launcher-update/bin/install.sh"
      echo "Saving to: \$temp_script"

      # TODO: Update this URL from `launcher-update` to `main` after testing and before merging to `main`
      curl -s -f -L "https://raw.githubusercontent.com/GoogleChromeLabs/ps-analysis-tool/launcher-update/bin/install.sh" -o "\$temp_script" || {
        echo "Error: Failed to download the latest setup script. Update aborted."
        return 1
      }

      # Make the script executable
      chmod +x "\$temp_script" || {
        echo "Error: Failed to make the downloaded script executable. Update aborted."
        rm -f "\$temp_script"
        return 1
      }

      # Execute the downloaded script with the appropriate arguments
      echo "Executing: \$temp_script \$update_args"
      "\$temp_script" \$update_args

      # Clean up the temporary script
      rm -f "\$temp_script"
      echo "Please restart your terminal or source the updated launcher script."
      return 1  # Return non-zero to indicate update in progress
    else
      echo "Continuing with current version."
    fi
  else
    echo "Chrome is up to date."
  fi

  return 0
}

# Check if there's a newer version of PSAT available
check_psat_update() {
  # Skip check if version was overridden via command line argument
  if [[ -n "\$PSAT_VERSION_OVERRIDE" ]]; then
    echo "PSAT version override detected (\$PSAT_VERSION_OVERRIDE). Skipping update check."
    return 0
  fi

  # Use the global PSAT_VERSION variable
  local current_version="\$PSAT_VERSION"
  local cache_file="\$CHROME_UPDATE_CACHE_DIR/psat_update.json"
  local latest_version=""

  echo "Checking for PSAT updates..."
  echo "Current version: \$current_version"

  # Initialize cache directory
  init_cache_dir

  # Check if cache is valid
  if is_cache_valid "\$cache_file"; then
    echo "Using cached update information (less than 1 day old)"
    # Read latest version from cache
    latest_version=\$(cat "\$cache_file")
  else
    echo "Fetching update information..."
    # Fetch the package.json from GitHub repository
    local package_url="https://raw.githubusercontent.com/GoogleChromeLabs/ps-analysis-tool/main/packages/extension/package.json"
    local package_json
    package_json=\$(curl -s -f -L "\$package_url") || {
      echo "Warning: Failed to fetch package.json for PSAT updates. Continuing with current version."
      return 0
    }

    # Extract the version from package.json
    latest_version=\$(echo "\$package_json" | jq -r '.version')

    if [[ -z "\$latest_version" || "\$latest_version" == "null" ]]; then
      echo "Warning: Could not determine latest PSAT version. Continuing with current version."
      return 0
    fi

    # Add 'v' prefix to match the format used in the current version
    latest_version="v\$latest_version"

    # Cache the latest version
    echo "\$latest_version" > "\$cache_file" || echo "Warning: Failed to cache update information."
  fi

  echo "Latest available: \$latest_version"

  # Compare versions (simple string comparison)
  if [[ "\$latest_version" != "\$current_version" ]]; then
    echo "A newer version of PSAT is available."
    echo "Current: \$current_version"
    echo "Latest:  \$latest_version"

    # Prompt user to update
    read -p "Would you like to update PSAT now? (y/n) " -n 1 -r
    echo
    if [[ \$REPLY =~ ^[Yy]$ ]]; then
      echo "Updating PSAT version to \$latest_version..."
      # Update the global PSAT_VERSION variable
      export PSAT_VERSION="\$latest_version"

      # Update the PSAT_VERSION in the chrome_launcher.sh file itself
      if [[ -f "$ALIAS_SCRIPT_PATH" ]]; then
        echo "Updating PSAT_VERSION in $ALIAS_SCRIPT_PATH..."
        sed -i "s/^export PSAT_VERSION=\".*\"/export PSAT_VERSION=\"\$latest_version\"/" "$ALIAS_SCRIPT_PATH" || {
          echo "Warning: Failed to update PSAT_VERSION in $ALIAS_SCRIPT_PATH. Changes will only apply to current session."
        }
      fi

      echo "PSAT version updated. The new version will be used for all future launches."
      return 0  # Return success to continue with the updated version
    else
      echo "Continuing with current version."
    fi
  else
    echo "PSAT is up to date."
  fi

  return 0
}

# --- Helper: Download PS Analysis Tool Extension (if needed by aliases) ---
# Downloads and extracts the extension to /var/tmp if not already present.
# Exports PS_ANALYSIS_TOOL_EXTENSION_PATH for use in launch functions.
extension_setup() {
  # Use the global PSAT_VERSION variable, which can be overridden by command-line argument
  local ps_analysis_tool_version="\${PSAT_VERSION_OVERRIDE:-\$PSAT_VERSION}"

  # Ensure version has 'v' prefix for download URL
  local download_version="\$ps_analysis_tool_version"
  if [[ "\$download_version" != v* ]]; then
    download_version="v\$download_version"
  fi

  local base_extension_dir="/var/tmp" # Ensure this location is suitable and writable
  local tool_dir="\$base_extension_dir/ps-analysis-tool-\$ps_analysis_tool_version"
  local extension_subdir="\$tool_dir/extension" # Actual extension path after unzip
  local zip_file="\$base_extension_dir/extension-\$ps_analysis_tool_version.zip"

  # Check if the final extension directory exists for the current version
  if [ ! -d "\$extension_subdir" ]; then
    echo "Setting up PS Analysis Tool extension (version: \$ps_analysis_tool_version) in directory: \$base_extension_dir"
    # Ensure parent directories exist
    mkdir -p "\$tool_dir" || { echo "Error: Failed to create extension setup directory '\$tool_dir'. Check permissions." >&2; return 1; }

    # Check if zip exists, download if not
    if [ ! -f "\$zip_file" ]; then
       local extension_download_url="https://github.com/GoogleChromeLabs/ps-analysis-tool/releases/download/\$download_version/extension-\$download_version.zip"
       echo "Downloading extension from: \$extension_download_url"
       echo "Saving to: \$zip_file"
       # Use curl with error checking
       curl -fsSL -o "\$zip_file" "\$extension_download_url" || {
         echo "Error: Failed to download extension zip from '\$extension_download_url' to '\$zip_file'." >&2;
         rm -f "\$zip_file"; # Clean up partial download
         return 1;
       }
    fi

    echo "Unzipping extension from: \$zip_file"
    echo "Unzipping to directory: \$tool_dir"
    # Unzip quietly (-q), overwrite (-o)
    unzip -oq "\$zip_file" -d "\$tool_dir" || {
      echo "Error: Failed to unzip extension '\$zip_file' to '\$tool_dir'." >&2;
      # Consider removing \$tool_dir or just the zip?
      return 1;
    }

    # Check if unzip actually created the expected subdir
    if [ ! -d "\$extension_subdir" ]; then
        echo "Error: Unzip completed but expected extension directory '\$extension_subdir' not found." >&2
        return 1
    fi

    # Optional: remove zip after successful extraction
    # rm -f "\$zip_file"
    echo "Extension setup complete."
  # else
  #  echo "PS Analysis Tool extension already set up." # Uncomment for debugging
  fi

  # Export the path for aliases/functions to use
  export PS_ANALYSIS_TOOL_EXTENSION_PATH="\$extension_subdir"
}


# --- Core Launch Function ---
# Loads the specific Chrome for Testing executable with a temporary profile
# that is deleted after Chrome is closed. Accepts additional Chrome arguments.
launch_chrome_testing() {
  local chrome_binary="\$CHROME_FOR_TESTING_PATH"
  local data_dir
  local os_name

  os_name=\$(uname -s)

  # Check if executable exists and is executable
  if [ ! -x "\$chrome_binary" ]; then
    echo "Error: Chrome executable not found or not executable at: \$chrome_binary" >&2
    return 1
  fi

  # Create a temporary directory for user data
  data_dir=\$(mktemp -d "/tmp/chrome_testing_data_dir.XXXXXXXXXX") || {
    echo "Error: Failed to create temporary user data directory." >&2;
    return 1;
  }

  echo "Launching Chrome for Testing..."
  echo "  Executable: \$chrome_binary"
  echo "  Data Directory: \$data_dir"
  echo "  Chrome Version: \$CHROME_FOR_TESTING_VERSION (\$CHROME_FOR_TESTING_CHANNEL channel)"
  if [[ \$# -gt 0 ]]; then
    echo "  Arguments: \$@"
  fi

  # Common flags for isolated testing profile
  local common_flags=(
      --user-data-dir="\$data_dir"
      --disable-sync
      --no-default-browser-check
      --no-first-run
      --silent-debugger-extension-api # Needed for PS Analysis Tool
      --disable-infobars
      --force-device-scale-factor=1.5
      # --enable-features=NetworkServiceInProcess # May be needed for some extension interactions
      --start-maximized # Optional: Start maximized
  )

  # Launch command varies slightly by OS
  if [[ "\$os_name" == "Darwin" ]]; then
     # On macOS, execute the binary directly (not using 'open')
     "\$chrome_binary" "\${common_flags[@]}" "\$@" "https://example.com/?psat_cdp=on" >/dev/null 2>&1 &
  elif [[ "\$os_name" == "Linux" ]]; then
     "\$chrome_binary" "\${common_flags[@]}" "\$@" "https://example.com/?psat_cdp=on" >/dev/null 2>&1 &
  else
     echo "Error: Unsupported OS '\$os_name' for launch_chrome_testing function." >&2
     rm -rf "\$data_dir" # Clean up temp dir
     return 1
  fi

  local chrome_pid=\$!

  # Monitor the process in the background and clean up the data directory when it exits
    (
        echo "Background monitor started for PID \$chrome_pid to clean up \$data_dir" # Debugging message
        # Loop while the process with chrome_pid still exists
        while ps -p \$chrome_pid > /dev/null; do
            sleep 5 # Check every 5 seconds (adjust interval if needed)
        done
        # Once the loop finishes, the process has exited
        echo "Detected Chrome process exit (PID: \$chrome_pid)." # Debugging message
        echo "Cleaning up temporary data directory: \$data_dir"
        rm -rf "\$data_dir"
        echo "Cleanup finished for \$data_dir" # Debugging message
    ) &  # Run this monitoring loop in the background

  echo "Chrome for Testing launched in background (PID: \$chrome_pid)."
}

# --- Convenience Functions/Aliases ---
# These functions call launch_chrome_testing with specific flag combinations.

# Launch default Chrome for Testing profile
chrome-default() {
  # Check for Chrome updates
  check_chrome_update || return $?

  launch_chrome_testing \\
    --install-autogenerated-theme='255,51,51'
}

# Launch with 3rd Party Cookie Phaseout enabled
chrome-3pcd() {
  # Check for Chrome updates
  check_chrome_update || return $?

  launch_chrome_testing \\
    --install-autogenerated-theme='150,220,150' \\
    --test-third-party-cookie-phaseout \\
    --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"
}

# Launch default profile with PS Analysis Tool extension
chrome-default-ps() {
  # Check for Chrome updates
  check_chrome_update || return $?

  # Check for PSAT updates
  check_psat_update || return $?

  extension_setup || return 1 # Setup extension first
  launch_chrome_testing \\
    --install-autogenerated-theme='255,51,51' \\
    --load-extension="\$PS_ANALYSIS_TOOL_EXTENSION_PATH"
}

# Launch with 3PCD enabled and PS Analysis Tool extension
chrome-3pcd-ps() {
  # Check for Chrome updates
  check_chrome_update || return $?

  # Check for PSAT updates
  check_psat_update || return $?

  extension_setup || return 1 # Setup extension first
  launch_chrome_testing \\
    --install-autogenerated-theme='150,220,150' \\
    --test-third-party-cookie-phaseout \\
    --load-extension="\$PS_ANALYSIS_TOOL_EXTENSION_PATH" \\
    --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"
}

# Launch with Partitioned Cookies (CHIPS) enabled
chrome-chip() {
  # Check for Chrome updates
  check_chrome_update || return $?

  launch_chrome_testing \\
    --install-autogenerated-theme='100,100,255' \\
    --partitioned-cookies=true
    # Note: CHIPS might be enabled by default in recent versions or under 3PCD testing.
    # This flag ensures it if needed explicitly.
}

# Launch with 3PCD and demo Related Website Sets configuration
chrome-rws() {
  # Check for Chrome updates
  check_chrome_update || return $?

  launch_chrome_testing \\
    --install-autogenerated-theme='150,220,150' \\
    --test-third-party-cookie-phaseout \\
    --use-related-website-set="{\"primary\": \"https://domain-aaa.com\", \"associatedSites\": [\"https://domain-bbb.com\", \"https://domain-ccc.com\"]}" \\
    --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"
}

# Launch with 3PCD, RWS config, and PS Analysis Tool extension
chrome-rws-ps() {
  # Check for Chrome updates
  check_chrome_update || return $?

  # Check for PSAT updates
  check_psat_update || return $?

  extension_setup || return 1 # Setup extension first
  launch_chrome_testing \\
    --install-autogenerated-theme='150,220,150' \\
    --test-third-party-cookie-phaseout \\
    --use-related-website-set="{\"primary\": \"https://domain-aaa.com\", \"associatedSites\": [\"https://domain-bbb.com\", \"https://domain-ccc.com\"]}" \\
    --load-extension="\$PS_ANALYSIS_TOOL_EXTENSION_PATH" \\
    --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"
}

# Launch with 3PCD and Private Advertising APIs enabled + overrides
chrome-pat() {
  # Check for Chrome updates
  check_chrome_update || return $?

  launch_chrome_testing \\
    --install-autogenerated-theme='0,53,102' \\
    --test-third-party-cookie-phaseout \\
    --enable-features="PrivacySandboxAdsAPIs,PrivacySandboxAdsAPIsOverride" \\
    --privacy-sandbox-enrollment-overrides="https://psat-pat-demos-dsp.dev,https://psat-pat-demos-dsp-a.dev,https://psat-pat-demos-dsp-b.dev,https://psat-pat-demos-dsp-c.dev,https://psat-pat-demos-dsp-d.dev,https://psat-pat-demos-ssp.dev,https://psat-pat-demos-ssp-a.dev,https://psat-pat-demos-ssp-b.dev,https://psat-pat-demos-ssp-c.dev,https://psat-pat-demos-ssp-d.dev,https://psat-pat-demos-ad-server.dev,https://domain-aaa.com,https://domain-bbb.com,https://domain-ccc.com" \\
    --enable-privacy-sandbox-ads-apis
}

# Launch with 3PCD, Private Advertising APIs, and PS Analysis Tool extension
chrome-pat-ps() {
  # Check for Chrome updates
  check_chrome_update || return $?

  # Check for PSAT updates
  check_psat_update || return $?

  extension_setup || return 1 # Setup extension first
  launch_chrome_testing \\
    --install-autogenerated-theme='0,53,102' \\
    --load-extension="\$PS_ANALYSIS_TOOL_EXTENSION_PATH" \\
    --test-third-party-cookie-phaseout \\
    --enable-features="PrivacySandboxAdsAPIs,PrivacySandboxAdsAPIsOverride" \\
    --privacy-sandbox-enrollment-overrides="https://psat-pat-demos-dsp.dev,https://psat-pat-demos-dsp-a.dev,https://psat-pat-demos-dsp-b.dev,https://psat-pat-demos-dsp-c.dev,https://psat-pat-demos-dsp-d.dev,https://psat-pat-demos-ssp.dev,https://psat-pat-demos-ssp-a.dev,https://psat-pat-demos-ssp-b.dev,https://psat-pat-demos-ssp-c.dev,https://psat-pat-demos-ssp-d.dev,https://psat-pat-demos-ad-server.dev,https://domain-aaa.com,https://domain-bbb.com,https://domain-ccc.com" \\
    --enable-privacy-sandbox-ads-apis
}

EOF

  # Make the generated script executable
  chmod +x "$alias_file_path" || echo "Warning: Failed to make alias script '$alias_file_path' executable."

  echo "Alias/function script generated successfully."
  echo ""
}

# Displays final instructions to the user on how to activate the aliases/functions
display_outro() {
  echo "=============================================="
  echo " Setup Complete!"
  echo "=============================================="

  if [[ -n "$OVERRIDE_CHROME_VERSION" ]]; then
    echo "Chrome for Testing (milestone $OVERRIDE_CHROME_VERSION, version $SELECTED_VERSION) installed to: $INSTALL_DIR"
  else
    echo "Chrome for Testing ($SELECTED_CHANNEL channel, version $SELECTED_VERSION) installed to: $INSTALL_DIR"
  fi

  echo "Executable path: $CHROME_EXECUTABLE_PATH"
  echo "PSAT version: $LATEST_PSAT_VERSION"
  echo ""
  echo "Helper functions generated in: $ALIAS_SCRIPT_PATH"
  echo ""
  echo "Launch functions have been automatically added to your shell configuration."
  echo "After restarting your terminal or running 'source $ALIAS_SCRIPT_PATH',"
  echo "you'll be able to use the commands listed below."
  echo ""
  echo "To manually activate the launch functions in other environments, you can run:"
  echo "  source \"$ALIAS_SCRIPT_PATH\""
  echo ""

  echo -e "\nNew commands that will be available in new terminal session:"
  echo -e "\tchrome-default     : Opens a Chrome instance with default settings."
  echo -e "\tchrome-3pcd        : Opens a Chrome instance with Third-Party Cookie Deprecation (3PCD) enabled."
  echo -e "\tchrome-default-ps  : Opens a Chrome instance with default settings and the PSAT extension installed."
  echo -e "\tchrome-3pcd-ps     : Opens a Chrome instance with 3PCD enabled and the PSAT extension installed."
  echo -e "\tchrome-pat         : Opens a Chrome instance with Private Advertising Testing enabled."
  echo -e "\tchrome-pat-ps      : Opens a Chrome instance with Private Advertising Testing enabled and the PSAT extension installed."

  echo ""
  echo "=============================================="
  echo ""
}

# Function to automatically source the alias script or provide instructions
auto_source_alias_script() {
  local script_path="$1"

  echo "Setting up Chrome launcher aliases from script: $script_path"

  # Check if the script exists
  if [[ ! -f "$script_path" ]]; then
    error_exit "Alias script at $script_path does not exist."
  fi

  # Determine shell config file
  local shell_config=""
  if [[ -n "$BASH_VERSION" ]]; then
    if [[ -f "$HOME/.bashrc" ]]; then
      shell_config="$HOME/.bashrc"
    elif [[ -f "$HOME/.bash_profile" ]]; then
      shell_config="$HOME/.bash_profile"
    fi
  elif [[ -n "$ZSH_VERSION" ]]; then
    shell_config="$HOME/.zshrc"
  fi

  # If we found a config file, try to add source command
  if [[ -n "$shell_config" ]]; then
    # Check if the source line already exists (with or without file check)
    if ! grep -q "source \"$script_path\"" "$shell_config" && ! grep -q "if \[ -f \"$script_path\" \]; then source \"$script_path\"" "$shell_config"; then
      echo "" >> "$shell_config"
      echo "# Auto-added by Chrome for Testing setup script" >> "$shell_config"
      echo "if [ -f \"$script_path\" ]; then source \"$script_path\"; fi" >> "$shell_config"
      echo "" >> "$shell_config"
      echo "Added source command to shell config file: $shell_config"
      echo "Chrome aliases will be available in new shell sessions after restarting your terminal."
    else
      echo "Source command for $script_path already exists in shell config file: $shell_config"
    fi

    echo "To use Chrome aliases in current session without restarting terminal, run:"
    echo "  source \"$script_path\""
  else
    echo "Could not determine shell configuration file."
    echo "To use Chrome aliases, add the following to your shell config file:"
    echo "  source \"$script_path\""
    echo "Or run this command to use in current session:"
    echo "  source \"$script_path\""
  fi
}

# --- Main Execution Logic ---

main() {
  # Parse command-line arguments
  parse_arguments "$@"

  display_intro

  # If uninstall mode is enabled, clean up and exit
  if [[ "$UNINSTALL_MODE" == "true" ]]; then
    cleanup
    echo "Uninstall complete."
    exit 0
  fi

  check_prerequisites

  # Clean up before installing or downloading anything
  cleanup

  # Set the appropriate JSON URL based on the command-line arguments
  if [[ -n "$OVERRIDE_CHROME_VERSION" ]]; then
    echo "Chrome version override detected ($OVERRIDE_CHROME_VERSION). Using milestone-specific URL."
    JSON_URL="$MILESTONE_VERSIONS_URL"
  fi

  # Fetch the latest PSAT version
  fetch_latest_psat_version

  # Fetch Chrome version data
  fetch_json_data # Sets FETCHED_JSON_DATA

  parse_channels "$FETCHED_JSON_DATA" # Sets AVAILABLE_CHANNELS
  if [ ${#AVAILABLE_CHANNELS[@]} -eq 0 ]; then
      # Error message is handled inside parse_channels if needed
      exit 1 # Exit if no channels were parsed
  fi

  prompt_user_for_channel "${AVAILABLE_CHANNELS[@]}" # Sets SELECTED_CHANNEL and SELECTED_VERSION
  detect_platform # Sets DETECTED_PLATFORM
  get_download_url "$SELECTED_VERSION" "$DETECTED_PLATFORM" # Sets DOWNLOAD_URL

  prepare_install_dir

  # Store current directory and cd into install dir for download/extract steps
  local original_dir
  original_dir=$(pwd)
  cd "$INSTALL_DIR" || error_exit "Internal error: Failed to change directory to prepared install dir '$INSTALL_DIR'."

  # Perform download, extraction, finding executable, and cleanup within INSTALL_DIR
  download_chrome "$DOWNLOAD_URL" "$INSTALL_DIR" "$DETECTED_PLATFORM" "$SELECTED_VERSION" "$SELECTED_CHANNEL" # Sets DOWNLOADED_ZIP_FILENAME
  extract_chrome "$INSTALL_DIR" "$DOWNLOADED_ZIP_FILENAME"
  find_chrome_executable "$INSTALL_DIR" "$DETECTED_PLATFORM" # Sets CHROME_EXECUTABLE_PATH
  cleanup_download "$INSTALL_DIR" "$DOWNLOADED_ZIP_FILENAME"

  # Return to original directory
  cd "$original_dir" || echo "Warning: Failed to return to original directory '$original_dir'."

  # Generate the final script *after* returning, using the absolute executable path
  generate_alias_script "$CHROME_EXECUTABLE_PATH" "$ALIAS_SCRIPT_PATH"
  auto_source_alias_script "$ALIAS_SCRIPT_PATH"
  display_outro

  exit 0
}

# --- Run Script ---
# Execute the main function, passing any command-line arguments (currently unused)
main "$@"
