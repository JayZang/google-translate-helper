(function() {
  const feature = 'selectedQuery'
  let featureOn = false;

  (function init(){
    chrome.storage.sync.get(feature, function (items) {
      featureOn = items[feature] || false
    });

    eventSetter()
    initCard()
  })()

  /*
  初始化翻譯資訊卡
  */
  function initCard() {
    if (!window.Card) {
      return
    }

    window.Card.init()
    window.Card.injectCss()
  }

  /*
  設置事件監聽器
  */
  function eventSetter() {
    // 功能開關事件監聽
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.feature === feature) {
        featureOn = message.status 
      }
    });

    // 鍵盤按鍵按下事件監聽
    document.addEventListener('keydown', keyDownEventHandler)
  }

  /*
  按鍵事件處理器
  */
  function keyDownEventHandler({ keyCode }) {
    switch(keyCode) {
      // alt , 反白字串翻譯
      case 18:
        featureOn && stringToTranslate()
        break

      // esc , 隱藏翻譯卡
      case 27:
        if (!featureOn || !window.Card ) {
          return
        }

        window.Card.hide()
        break
    }
  }

  /*
  反白字串翻譯
  */
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

  /*
  取得反白字串
  */
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