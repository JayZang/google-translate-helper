(function () {
  const featureName = 'selectedQuery'
  const translateEventName = 'query';

  // 動作初始，造訪 Google 翻譯頁面時初始
  (function init() {
    codeInjectionToPutTKKonBody()
    setEventListener()
  })()

  // content script 執行環境無法得到 page variable，需注入程式到 page 環境執行將 TKK 變數放置 body 標籤
  function codeInjectionToPutTKKonBody() {
    const script = document.createElement("script");
    script.innerHTML = `document.getElementsByTagName('body')[0].setAttribute('tkk', window.TKK)`
    document.getElementsByTagName('body')[0].appendChild(script)
  }

  /* 監聽來自 popup dashboard 的動作指令 */
  function setEventListener() {
    // 翻譯事件
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.event !== translateEventName) {
        return
      }

      if (!window.calcHash) {
        return
      }

      const query = message.para.query
      const TKK = document.getElementsByTagName('body')[0].getAttribute('tkk')
      const tk = window.calcHash(query, TKK)

      console.log(`Query: ${query}`)

      // 取得翻譯內容
      $.ajax({
        type: "GET",
        url: `https://translate.google.com.tw/translate_a/t?client=t&sl=en&tl=zh-TW&hl=zh-TW&v=1.0&source=is&tk=${tk}&q=${encodeURI(query)}`,
        success: (data) => {
          sendResponse({ data })
        }
      })

      // 返回 true 才可以異步返回資料
      return true
    });
  }
})()

