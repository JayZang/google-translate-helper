(function () {
  const tranlateInputId = 'source'
  const featureName = 'autoClear';

  // 動作初始，造訪 Google 翻譯頁面時初始
  (function init() {
    chrome.storage.sync.get(featureName, function (items) {
      const status = items[featureName] || false
      autoClearProcess(status)
    });

    /* 監聽來自小視窗的動作指令 */
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.feature === featureName) {
        autoClearProcess(message.status)
      }
    });
  })()

  /* 指令對應動作函數 */
  // 返回翻譯頁面時( event: focus )，清除輸入內容
  function autoClearProcess(status) {
    if (status) {
      window.addEventListener("focus", clearInput)
    } else {
      window.removeEventListener("focus", clearInput)
    }
  }

  /* DOM 事件處理函數 */
  // 清除輸入內容
  function clearInput() {
    document.getElementById(tranlateInputId).value = ""
  }
})()

