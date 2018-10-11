(function () {
  const tranlateInputId = 'source'
  const featureName = 'selectedQuery'
  const getTkkEventName = 'getTKK'
  const storageTag = featureName;

  // 動作初始，造訪 Google 翻譯頁面時初始
  (function init() {
    chrome.storage.sync.get(storageTag, function (items) {
      const status = items[storageTag] || false
      console.log(status)
    });

    codeInjectionToPutTKKonBody()
  })()

  // content script 執行環境無法得到 page variable，需注入程式到 page 環境執行將 TKK 變數放置 body 標籤
  function codeInjectionToPutTKKonBody() {
    const script = document.createElement("script");
    script.innerHTML = `document.getElementsByTagName('body')[0].setAttribute('tkk', window.TKK)`
    document.getElementsByTagName('body')[0].appendChild(script)
  }

  /* 監聽來自小視窗的動作指令 */
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.eventName === getTkkEventName) {
      sendResponse(document.getElementsByTagName('body')[0].getAttribute('tkk'))
    }
  });
})()

