(function(global) {
  global.Card = {
    // 自訂 Dom Id 屬性
    domId: 'tranlate-card',

    // 初始化，創建卡
    init() {
      this.createCard('', {})
    },

    // 呈現翻譯卡
    show(srcTxt, result) {
      let el = this.getEl()

      if (!el.length) {
        el = this.createCard(srcTxt, result)
      } else {
        el.find(".translate-result-txt").text(result.data)
      }

      el.addClass('show')
    },

    // 隱藏卡
    hide() {
      let el = this.getEl()

      if (!el.length) {
        return
      }

      el.css({
        transform: '',
        transition: '',
        right: '',
        left: '',
        top: ''
      })
      el.removeClass('show')
    },

    // 創建翻譯卡
    createCard(srcTxt, result) {
      const tempalte = this.getTempalte(srcTxt, result)
      const el = $(tempalte)
      $("body").prepend(el)

      // 點擊結束按鍵事件
      el.find(".closeBtn").click(() => {
        el.css({
          transform: '',
          transition: '',
          right: '',
          left: '',
          top: ''
        })
        el.removeClass('show')
      });

      // 設置拖移事件
      (function() {
        let start = false
        let elStartPoint = {
          x: 0,
          y: 0
        }
        let pStartPoint = {
          x: 0,
          y: 0
        }

        el.mousedown(function(e) {
          elStartPoint.x = el.offset().left
          elStartPoint.y = el.offset().top
          pStartPoint.x = e.pageX
          pStartPoint.y = e.pageY
          start = true
        })

        $(window).mouseup(function() {
          start = false
        }).mousemove(function(e) {
          if (!start) {
            return
          }

          let offsetX = e.pageX - pStartPoint.x 
          let offsetY = e.pageY - pStartPoint.y - $(window).scrollTop()
          el.css({
            transform: 'none',
            transition: 'unset',
            right: 'unset',
            left: elStartPoint.x + offsetX,
            top: elStartPoint.y + offsetY
          })
        })

        el.find(".translate-result-container").mousemove(function(e) {
          e.stopPropagation()
        })
      })()

      return el
    },

    // 取得 Card 元素
    getEl() {
      return $(`#${this.domId}`)
    },

    // 取得模板樣式
    getTempalte(srcTxt, result) {
      return `
    <div id="${this.domId}" style="visibility: hidden">
      <div class="translate-container">
        <div class="closeBtn">╳</div>
        <div class="translate-title">Google 翻譯小幫手</div>
        <div class="translate-content">
          <div class="translate-result-container">
            <div class="translate-result-txt">${result.data}</div>
          </div>
        </div>
      </div>
    </div>`
    },

    // 注入 card 的 css
    injectCss() {
      var link = document.createElement("link");
      link.href = chrome.extension.getURL("css/card.css");
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName("body")[0].appendChild(link);
    }
  }
})(window)