import msgController from './msgController.js'

function feature(name) {
  /*
    public variable
  */
  this.featureName = name
  this.storageTag = name
  this.afterInit = null
  this.afterClick = null

  /*
    private variable
  */
  const domId = name
  let el

  /*
    public function
  */
  this.init = function () {
    const featureName = this.featureName
    const storageTag = this.storageTag
    el = document.getElementById(domId)

    chrome.storage.sync.get(storageTag, function (items) {
      const status = items[storageTag] || false
      el.checked = status
      msgController.sendFeatureStatus(featureName, status)
    });

    bindClickEvent()

    this.afterInit && this.afterInit()
  }

  /*
    private function，用箭頭函數才取得到正確 this
  */
  const bindClickEvent = () => {
    if (!el) {
      return
    }

    const storageTag = this.storageTag
    const featureName = this.featureName

    el.addEventListener("click", () => {
      const status = el.checked
      chrome.storage.sync.set({ [storageTag]: status }, null)
      msgController.sendFeatureStatus(featureName, status)

      this.afterClick && this.afterClick(status)
    })
  }
}

export { feature }


