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
    switch(keyCode) {
      // ctrl , 反白字串發音
      case 17:
        speakString()
        break

      // alt , 反白字串翻譯
      case 18:
        stringToTranslate()
        break

      // esc , 隱藏翻譯卡
      case 27:
        if (!window.Card) {
          return
        }

        window.Card.hide()
        break
    }
  }

  // 反白字串發音
  function speakString() {
    const selectedString = getselecttext()

    if (!selectedString) {
      return
    }

    const message = {
      event: 'speakString',
      content: selectedString
    }
    chrome.runtime.sendMessage(message, null)
  }

  // 反白字串翻譯
  function stringToTranslate() {
    const selectedString = getselecttext()

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

    return t.toString().trim()
  }
})()