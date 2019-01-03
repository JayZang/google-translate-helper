// 透過 background 當作橋樑使所有頁面與 google翻譯做溝通
chrome.runtime.onInstalled.addListener(function () {
  setEventHandlerFromContent('stringToTranslate', async (content, sendResponse) => {
    let tabs = await checkGooglePageExist()
      .catch((err) => {
        alert(err)
      })

    eventTrigger(tabs[0].id, 'query', { query: content }, (res) => {
      sendResponse(res)
    })
  })
})
