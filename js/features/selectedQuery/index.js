import { feature } from '../../core/feature.js'
import msgController from '../../core/msgController.js'

const selectedQuery = new feature('selectedQuery')
const queryURL = ['https://translate.google.com.tw/*', 'https://translate.google.com/*']

selectedQuery.afterInit = function() {
  chrome.tabs.query({ url: queryURL}, (tabs) => {
    console.log(tabs)
  })
} 

selectedQuery.afterClick = function(status) {
  if (!status) {
    return
  }

  chrome.tabs.query({ url: queryURL }, (tabs) => {
    if (!tabs.length) {
      chrome.tabs.create({ url: 'https://translate.google.com/', selected: false }, (tab) => {
        console.log(tab.id)
        chrome.tabs.onUpdated.addListener((tabId, info) => {
          if (tabId === tab.id && info.status === 'complete') {
            getTKK(tab.id) 
          }
        })
      })
    } else {
      getTKK(tabs[0].id)
    }
  })
}

function getTKK(tabId) {
  msgController.getDataFromContent(tabId, 'getTKK', null, function(tkk) {
    console.log(tkk)
  })
}

export { selectedQuery }