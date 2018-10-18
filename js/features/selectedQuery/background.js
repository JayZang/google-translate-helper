const queryURL = ['https://translate.google.com.tw/*', 'https://translate.google.com/*']

  // 透過 background 當作橋樑使所有頁面與 google翻譯做溝通
chrome.runtime.onInstalled.addListener(function () {
  setEventHandlerFromContent('stringToTranslate', async (content, sendResponse) => {
    var tabs = await checkGooglePageExist()
      .catch((err) => {
        alert(err)
      })

    eventTrigger(tabs[0].id, 'query', { query: content }, (res) => {
      sendResponse(res)
    })
  })

  setEventHandlerFromContent('speakString', async (content) => {
    var tabs = await checkGooglePageExist()
      .catch((err) => {
        alert(err)
      })

    eventTrigger(tabs[0].id, 'speak', { query: content }, null)
  })
})

// 查詢是否有 google 翻譯頁面，並返回位於哪一個tab
function checkGooglePageExist() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ url: queryURL }, (tabs) => {
      if (!tabs.length) {
        reject('Opps, 發生了些錯誤，請重新開啟 "選取搜尋" 開關')
      }

      resolve(tabs)
    })
  })
}

function eventTrigger(tabId, event, para, cb) {
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