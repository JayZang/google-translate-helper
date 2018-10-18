(function () {
  const featureName = 'selectedQuery'
  const translateEventName = 'query'
  const speakEventName = 'speak';

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

  /* 監聽來自 background script 的動作指令 */
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

