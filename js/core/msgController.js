function sendFeatureStatus(feature, status, data) {
  const content = {
    feature,
    status,
    data
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, content, null);
  })
}

function getDataFromContent(tabId, eventName, cb) {
  const content = {
    eventName
  }

  chrome.tabs.sendMessage(tabId, content, cb);
}

export default {
  sendFeatureStatus,
  getDataFromContent
}