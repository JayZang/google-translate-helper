(function () {
  const featureName = 'selectedQuery'
  const translateEventName = 'query';

  // 動作初始，造訪 Google 翻譯頁面時初始
  (function init() {
    setEventListener()
  })()

  /* 
  監聽來自 background script 的動作指令 
  */
  function setEventListener() {
    // 翻譯事件
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.event !== translateEventName) {
        return
      }

      const query = message.para.query
      const tk = getTkValue(query)
      if (tk === -1) {
        return
      }

      console.log(`Query: ${query}`)

      // 取得翻譯內容
      $.ajax({
        type: "GET",
        url: `https://translate.google.com.tw/translate_a/t?client=t&sl=en&tl=zh-TW&hl=zh-TW&v=1.0&source=is&tk=${tk}&q=${encodeURIComponent(query)}`,
        success: (data) => {
          sendResponse({ data })
        }
      })

      // 返回 true 才可以異步返回資料
      return true
    });
  }

  function getTkValue(query) {
    if (!window.calcHash) {
      return -1
    }

    const TKK = document.getElementsByTagName('body')[0].getAttribute('tkk')
    return window.calcHash(query, TKK)
  }
})()

