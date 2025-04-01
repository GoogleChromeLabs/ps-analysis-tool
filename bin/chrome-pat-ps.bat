:: Chrome pat with PS Extension

:: Download PS Extension
set "ps_analysis_tool_version=v0.12.0"
cd /d %TEMP%
if not exist %TEMP%\ps-analysis-tool-%ps_analysis_tool_version% (
    mkdir %TEMP%\ps-analysis-tool-%ps_analysis_tool_version%
    curl -L -O -s  https://github.com/GoogleChromeLabs/ps-analysis-tool/releases/download/%ps_analysis_tool_version%/extension-%ps_analysis_tool_version%.zip
    tar -xf extension-%ps_analysis_tool_version%.zip -C %TEMP%\ps-analysis-tool-%ps_analysis_tool_version%
)

set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "DATA_DIR=%TEMP%\chrome_data_dir-%RANDOM%"
"%CHROME_PATH%" --disable-sync --no-default-browser-check --no-first-run --user-data-dir="%DATA_DIR%" --install-autogenerated-theme="0,53,102" --silent-debugger-extension-api --test-third-party-cookie-phaseout --enable-features="PrivacySandboxAdsAPIs,PrivacySandboxAdsAPIsOverride" --privacy-sandbox-enrollment-overrides="https://psat-pat-demos-dsp.dev,https://psat-pat-demos-dsp-a.dev,https://psat-pat-demos-dsp-b.dev,https://psat-pat-demos-dsp-c.dev,https://psat-pat-demos-dsp-d.dev,https://psat-pat-demos-ssp.dev,https://psat-pat-demos-ssp-a.dev,https://psat-pat-demos-ssp-b.dev,https://psat-pat-demos-ssp-c.dev,https://psat-pat-demos-ssp-d.dev,https://psat-pat-demos-ad-server.dev,https://domain-aaa.com,https://domain-bbb.com,https://domain-ccc.com" --load-extension="%TEMP%\ps-analysis-tool-%ps_analysis_tool_version%\extension" "https://example.com/?psat_cdp=on%&psat_multitab=on" >nul 2>&1
rmdir /s /q "%DATA_DIR%" >nul
