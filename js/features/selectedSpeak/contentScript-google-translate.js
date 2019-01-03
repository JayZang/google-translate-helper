(function () {
  const featureName = 'selectedSpeak'
  const speakEventName = 'speak';

  // 動作初始，造訪 Google 翻譯頁面時初始
  (function init() {
    setEventListener()
  })()

  /* 
  監聽來自 background script 的動作指令 
  */
  function setEventListener() {
    // 語音事件
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.event !== speakEventName) {
        return
      }

      const query = message.para.query
      const tk = getTkValue(query)
      if (tk === -1) {
        return
      }

      console.log(`Speak: ${query}`)

      // 注入語音Tag
      const video = document.createElement("video");
      video.setAttribute('controls', true)
      video.setAttribute('autoplay', true)
      video.setAttribute('name', 'media')
      video.innerHTML = `
        <source src="https://translate.google.com/translate_tts?ie=UTF-8&amp;q=${encodeURIComponent(query)}&amp;tl=en&amp;total=1&amp;idx=0&amp;tk=${tk}&amp;client=t&amp;prev=input" 
        type="audio/mpeg">
      `
      let speakContainer = document.getElementById('speakContainer')
      if (!speakContainer) {
        const div = document.createElement("div");
        div.setAttribute('id', 'speakContainer')
        div.style.display = "none"
        document.getElementsByTagName('body')[0].appendChild(div)
        speakContainer = document.getElementById('speakContainer')
      }
      speakContainer.innerHTML = ''
      speakContainer.innerHTML = video.outerHTML
    })
  }

  function getTkValue(query) {
    if (!window.calcHash) {
      return -1
    }

    const TKK = document.getElementsByTagName('body')[0].getAttribute('tkk')
    return window.calcHash(query, TKK)
  }
})()

