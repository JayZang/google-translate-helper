import { feature } from '../../core/browser-action/feature.js'

const selectedQuery = new feature('selectedQuery')
const queryURL = ['https://translate.google.com.tw/*', 'https://translate.google.com/*']

selectedQuery.afterClick = function(status) {
  if (!status) {
    return
  }

  chrome.tabs.query({ url: queryURL }, (tabs) => {
    if (!tabs.length) {
      chrome.tabs.create({ url: 'https://translate.google.com/', selected: false }, null)
    } 
  })
}

export { selectedQuery }