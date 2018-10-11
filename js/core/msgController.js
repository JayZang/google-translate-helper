/* 定義 browser action 環境之 js 與 content script 環境之 js 溝通介面 */

// 向 content script 即時指示功能啟動與否
function sendFeatureStatus(feature, status) {
  const content = {
    feature,
    status
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, content, null);
  })
}

// 向 content script 取得資料
function getDataFromContent(tabId, eventName, para, cb) {
  const content = {
    eventName,
    para
  }

  chrome.tabs.sendMessage(tabId, content, cb);
}

export default {
  sendFeatureStatus,
  getDataFromContent
}