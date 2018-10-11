import { feature } from '../../core/feature.js'
import msgController from '../../core/msgController.js'

const selectedQuery = new feature('selectedQuery')

selectedQuery.afterInit = function() {
  chrome.tabs.query({ url: ['https://translate.google.com.tw/*', 'https://translate.google.com/*'] }, (tabs) => {
    console.log(tabs)
  })
} 

selectedQuery.afterClick = function(status) {
  if (!status) {
    return
  }

  chrome.tabs.query({ url: ['https://translate.google.com.tw/*', 'https://translate.google.com/*'] }, (tabs) => {
    let googleTranslateTabId = null
  
    if (!tabs.length) {
      chrome.tabs.create({ url: 'https://translate.google.com/', selected: false }, (tab) => {
        googleTranslateTabId = tab.id
        getTKK(googleTranslateTabId)
      })
    } else {
      googleTranslateTabId = tabs[0].id
      getTKK(googleTranslateTabId)
    }
  })
}

function getTKK(tabId) {
  msgController.getDataFromContent(tabId, 'getTKK', function (tkk) {
    console.log(tkk)
  })
}

selectedQuery.getTKK = function(tabId) {
  msgController.getDataFromContent(tabId, 'getTKK', function(...x) {
    console.log(x)
  })
}

export { selectedQuery }