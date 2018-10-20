// content script 執行環境無法得到 page variable，需注入程式到 page 環境執行將 TKK 變數放置 body 標籤
(function codeInjectionToPutTKKonBody() {
  const script = document.createElement("script");
  script.innerHTML = `document.getElementsByTagName('body')[0].setAttribute('tkk', window.TKK)`
  document.getElementsByTagName('body')[0].appendChild(script)
})()