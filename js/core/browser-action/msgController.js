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
function getDataFromContent(tabId, event, para, cb) {
  const content = {
    event,
    para
  }

  chrome.tabs.sendMessage(tabId, content, cb);
}

function eventHandlerFromContent(event, cb) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (event === message.event) {
      cb(message.content)
    }
  })
}

export default {
  sendFeatureStatus,
  getDataFromContent,
  eventHandlerFromContent
}