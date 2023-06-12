// Get the current tab that is active in the browser.
export const getCurrentTabId = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0].id;
};
