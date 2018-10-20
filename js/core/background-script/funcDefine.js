/*
查詢是否有 google 翻譯頁面，並返回位於哪一個tab
*/
function checkGooglePageExist() {
  const queryURL = ['https://translate.google.com.tw/*', 'https://translate.google.com/*']

  return new Promise((resolve, reject) => {
    chrome.tabs.query({ url: queryURL }, (tabs) => {
      if (!tabs.length) {
        reject('Opps, 發生了些錯誤，請重新開啟 "選取搜尋" 開關')
      }

      resolve(tabs)
    })
  })
}

/*
事件觸發器
  tabId 指定傳送至哪個tab頁面
  event 觸發事件名稱
  para  傳送參數
  cb    callback函數 
*/
function eventTrigger(tabId, event, para, cb) {
  const content = {
    event,
    para
  }

  chrome.tabs.sendMessage(tabId, content, cb);
}

/*
設置事件監聽器
  event 監聽事件名稱
  cb    事件處理函數
*/
function setEventHandlerFromContent(event, cb) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (event === message.event) {
      cb(message.content, sendResponse)
    }

    // 返回 true 才可以異步返回資料
    return true
  })
}