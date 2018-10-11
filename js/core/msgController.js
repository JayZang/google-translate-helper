function sendFeatureStatus(feature, status) {
  const content = {
    feature,
    status
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, content, null);
  })
}

export default {
  sendFeatureStatus
}