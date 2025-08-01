:: Chrome 3pcd with PS Extension

:: Download PS Extension
set "ps_analysis_tool_version=v1.1.1"
cd /d %TEMP%
if not exist %TEMP%\ps-analysis-tool-%ps_analysis_tool_version% (
    mkdir %TEMP%\ps-analysis-tool-%ps_analysis_tool_version%
    curl -L -O -s  https://github.com/GoogleChromeLabs/ps-analysis-tool/releases/download/%ps_analysis_tool_version%/extension-%ps_analysis_tool_version%.zip
    tar -xf extension-%ps_analysis_tool_version%.zip -C %TEMP%\ps-analysis-tool-%ps_analysis_tool_version%
)

set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "DATA_DIR=%TEMP%\chrome_data_dir-%RANDOM%"
"%CHROME_PATH%" --disable-sync --no-default-browser-check --no-first-run --user-data-dir="%DATA_DIR%" --install-autogenerated-theme="150,220,150" --silent-debugger-extension-api --test-third-party-cookie-phaseout --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI" --load-extension="%TEMP%\ps-analysis-tool-%ps_analysis_tool_version%\extension" "https://example.com/?psat_cdp=on%&psat_multitab=on" >nul 2>&1
rmdir /s /q "%DATA_DIR%" >nul
