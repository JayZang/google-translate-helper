(function() {
  const feature = 'selectedQuery';

  (function init(){
    chrome.storage.sync.get(feature, function (items) {
      const status = items[feature] || false
      status ? (document.onkeydown = keyDownEventHandler) : (document.onkeydown = null)
    });

    eventSetter()
    initCard()
  })()

  // 初始化翻譯資訊卡
  function initCard() {
    if (!window.Card) {
      return
    }

    window.Card.init()
    window.Card.injectCss()
  }

  // 設置事件監聽器
  function eventSetter() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.feature === feature) {
        message.status ? (document.onkeydown = keyDownEventHandler) : (document.onkeydown = null)
      }
    });
  }

  // 按鍵事件處理器
  function keyDownEventHandler({ keyCode }) {
    if (keyCode === 18) {
      const selectedString = getselecttext().toString().trim()

      if (!selectedString) {
        return
      }

      const message = {
        event: 'stringToTranslate',
        content: selectedString
      }
      chrome.runtime.sendMessage(message, (result) => {
        if (!window.Card) {
          return
        }

        window.Card.show(selectedString, result)
      })
    } else if (keyCode === 27) {
      if (!window.Card) {
        return
      }

      window.Card.hide()
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