declare const a: Array<string>|null;

function addAsyncStyles(styles: Array<string>|null) {
  if (!styles) {
    return
  }
  for (const s of styles) {
    const link = document.createElement('link');
    link.href = s;
    link.rel = 'stylesheet';
    document.body.appendChild(link);
  }
}
window.addEventListener('load', function() {
  addAsyncStyles(a);
});