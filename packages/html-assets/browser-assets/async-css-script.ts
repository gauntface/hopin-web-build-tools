declare const a: Array<string>|null;

function addAsyncStyles(styles: Array<string>|null) {
  if (!styles) {
    return
  }
  for (const s of styles) {
    console.log('TODO: Add stylesheet ', s);
  }
}
window.addEventListener('load', function() {
  addAsyncStyles(a);
});