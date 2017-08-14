ONE_SECOND = 1000
ONE_MINUTE = ONE_SECOND*60
ONE_HOUR = ONE_MINUTE*60
ONE_DAY = ONE_HOUR*24
window.log = console.log

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

window.copyToClipboard = function(text) {
  // IE specific
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);
  }

  // all other modern
  target = document.createElement("textarea");
  target.style.position = "absolute";
  target.style.left = "-9999px";
  target.style.top = "0";
  target.textContent = text;
  document.body.appendChild(target);
  target.focus();
  target.setSelectionRange(0, target.value.length);

  // copy the selection of fall back to prompt
  try {
    document.execCommand("copy");
    target.remove();
    console.log('Copied to clipboard: "'+text+'"');
  } catch(e) {
    console.log("Can't copy string on this browser. Try to use Chrome, Firefox or Opera.")
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  }
}