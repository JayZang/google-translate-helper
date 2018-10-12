const queryURL = ['https://translate.google.com.tw/*', 'https://translate.google.com/*']

chrome.runtime.onInstalled.addListener(function () {
  setEventHandlerFromContent('stringToTranslate', (content, sendResponse) => {
    chrome.tabs.query({ url: queryURL }, (tabs) => {
      if (!tabs.length) {
        alert('Opps, 發生了些錯誤，請重新開啟 "選取搜尋" 開關')
        return
      }

      getDataFromContent(tabs[0].id, 'query', { query: content }, (data) => {

      })
    })
  })
})

function getDataFromContent(tabId, event, para, cb) {
  const content = {
    event,
    para
  }

  chrome.tabs.sendMessage(tabId, content, cb);
}

function setEventHandlerFromContent(event, cb) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (event === message.event) {
      cb(message.content, sendResponse)
    }
  })
}