import msgController from '../../core/msgController.js'

const featureName = 'autoClear'
const storageTag = featureName
const domId = featureName
let el

function init() {
  el = document.getElementById(domId)

  chrome.storage.sync.get(storageTag, function (items) {
    const status = items[storageTag] || false
    el.checked = status
    msgController.sendFeatureStatus(featureName, status)
  });

  bindClickEvent()
}

function bindClickEvent() {
  if (!el) {
    return
  }

  el.addEventListener("click", function () {
    const status = this.checked
    chrome.storage.sync.set({ [storageTag]: status }, null)
    msgController.sendFeatureStatus(featureName, status)
  })
}

export const autoClear = {
  init
}