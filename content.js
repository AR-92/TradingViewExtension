var url=window.location.href;
var one=url.includes("tradingview");
var two=url.includes("ideas");

function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}
// console.log(chrome.runtime.getURL('injection.js'))
if(one && two){
    injectScript(chrome.runtime.getURL('injection.js'), 'body');
}
