(function() {
  const feature = 'selectedSpeak'
  let featureOn = false;

  (function init(){
    chrome.storage.sync.get(feature, function (items) {
      featureOn = items[feature] || false
    });

    eventSetter()
  })()

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
      // ctrl , 反白字串發音
      case 17:
        featureOn && speakString()
        break
    }
  }

  /*
  反白字串發音
  */
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
    console.log('message send')
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