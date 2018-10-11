console.log('hello')

function getselecttext() {
  var t = ''
  if (window.getSelection) { 
    t = window.getSelection()
  } else if (document.getSelection) {
    t = document.getSelection()
  } else if (window.document.selection) { 
    t = window.document.selection.createRange().text
  }

  return t
}

document.onkeydown = function ({ keyCode }) {
  if (keyCode === 18) {
    console.log(getselecttext().toString())
  }
}