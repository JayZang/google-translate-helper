document.addEventListener('DOMContentLoaded', function () {  
  console.log(window)
  init()

  // 按鍵監聽設置：自動清除輸入
  const autoClear = document.getElementById("autoClear")
  autoClear.addEventListener("click", function () {
    const status = this.checked
    chrome.storage.sync.set({ autoClear: status }, null)
    sendMsg("autoClear", status)
  })
})

// 介面初始，每當打開小視窗面板都會被調用
function init() {
  const autoClear = document.getElementById("autoClear")

  chrome.storage.sync.get("autoClear", function (items) {
    const status = items.autoClear || false
    autoClear.checked = status
    sendMsg("autoClear", status)
  });
}

// 傳送指令訊息至內容腳本
function sendMsg(eventName, status) {
  const content = {
    feature: eventName,
    status
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, content, null);
  })
}
