const fs = require("fs")
const path = require("path")
const links = document.querySelectorAll('link[rel="import"]')

// Preferences navigation buttons in head of window
const preferencesGeneralButtom = document.getElementById('icon-switch')
const preferencesAccountsButtom = document.getElementById('icon-users')

 // Import and add each page to the DOM
 Array.prototype.forEach.call(links, (link) => {
   let template = link.import.querySelector('.section')
   let clone = document.importNode(template.content, true)
   let windowContent = document.getElementsByClassName("window-content")[0]
   if (link.href.match('general.html')) {
     windowContent.appendChild(clone)
     console.log(clone)
   }
 })

// Events
preferencesGeneralButtom.addEventListener('click', (event) => {
  event.preventDefault()
  console.log('preferencesGeneralButtom')
  Array.prototype.forEach.call(links, (link) => {
    if (link.href.match('general.html')) {
      let divWindow = document.getElementsByClassName("window")[0]
      let toolbarFooter = document.querySelector('.toolbar-footer')
      if(toolbarFooter) {
        divWindow.removeChild(toolbarFooter)
      }
      let template = link.import.querySelector('.section')
      let clone = document.importNode(template.content, true)
      let windowContent = document.getElementsByClassName("window-content")[0]
      windowContent.removeChild(windowContent.lastElementChild);
      // divWindow.removeChild(windowContent.lastChild);
      windowContent.appendChild(clone)
      console.log(clone)
    }
  })
})

// Accounts List
preferencesAccountsButtom.addEventListener('click', (event) => {
  event.preventDefault()
  console.log('preferencesAccountsButtom')
  Array.prototype.forEach.call(links, (link) => {
    if (link.href.match('list.html')) {
      let divWindow = document.getElementsByClassName("window")[0]
      let toolbarFooter = document.querySelector('.toolbar-footer')
      console.log(toolbarFooter)
      if(toolbarFooter) {
        divWindow.removeChild(toolbarFooter)
      }
      let template = link.import.querySelector('.section')
      let cloneTemplate = document.importNode(template.content, true)
      let windowContent = document.getElementsByClassName("window-content")[0]
      windowContent.removeChild(windowContent.lastElementChild);
      let footer = link.import.querySelector('.footer')
      let cloneFooter = document.importNode(footer.content, true)
    // divWindow.removeChild(windowContent.lastChild);
      divWindow.appendChild(cloneFooter)
      windowContent.appendChild(cloneTemplate)

    }
  })
})
