const queryURL = ['https://translate.google.com.tw/*', 'https://translate.google.com/*']

chrome.runtime.onInstalled.addListener(function () {
  // 透過 background 當作橋樑使所有頁面與 google翻譯做溝通
  setEventHandlerFromContent('stringToTranslate', (content, sendResponse) => {
    // 查詢是否有 google 翻譯頁面
    chrome.tabs.query({ url: queryURL }, (tabs) => {
      if (!tabs.length) {
        alert('Opps, 發生了些錯誤，請重新開啟 "選取搜尋" 開關')
        return
      }

      getDataFromContent(tabs[0].id, 'query', { query: content }, (res) => {
        sendResponse(res)
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

    // 返回 true 才可以異步返回資料
    return true
  })
}