const links = document.querySelectorAll('link[rel="import"]');

// Import and add each page to the DOM
Array.prototype.forEach.call(links, link => {
  const template = link.import.querySelector('.task-template');
  const clone = document.importNode(template.content, true);
  if (link.href.match('about.html')) {
    document.querySelector('body').append(clone);
  } else {
    document.querySelector('.content').append(clone);
  }
});
