(function() {
  const feature = 'selectedQuery';

  (function init(){
    chrome.storage.sync.get(feature, function (items) {
      const status = items[feature] || false
      status ? (document.onkeydown = ketyDownEventHandler) : (document.onkeydown = null)
    });

    eventSetter()
  })()

  // 設置事件監聽器
  function eventSetter() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.feature === feature) {
        message.status ? (document.onkeydown = ketyDownEventHandler) : (document.onkeydown = null)
      }
    });
  }

  // 按鍵事件處理器
  function ketyDownEventHandler({ keyCode }) {
    if (keyCode === 18) {
      const selectedString = getselecttext().toString()
      const message = {
        event: 'stringToTranslate',
        content: selectedString
      }
      chrome.runtime.sendMessage(message)
    }
  }

  // 取得反白字串
  function getselecttext() {
    var t = ''
    if (window.getSelection) {
      t = window.getSelection()
    } else if (document.getSelection) {
      t = document.getSelection()
    } else if (window.document.selection) {
      t = window.document.selection.createRange().text
    }

    return t
  }
})()