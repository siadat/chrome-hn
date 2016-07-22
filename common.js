let replaceNodeRecursive = function(node, regex, replace) {
  if(node.innerHTML) {
    node.childNodes.forEach(child => replaceNodeRecursive(child, regex, replace));
  } else if (node.textContent){
    if(!node.textContent.match(regex)) { return; }

    let span = document.createElement('span');
    span.innerHTML = node.textContent.replace(regex, replace);
    node.parentNode.replaceChild(span, node)
  }
}

let replaceNode = function(node, regex, replace) {
  if(node.innerHTML) {
    node.innerHTML = node.innerHTML.replace(regex, replace);
  } else if (node.textContent){
    let span = document.createElement('span');
    span.innerHTML = node.textContent.replace(regex, replace);
    node.parentNode.replaceChild(span, node)
  }
}
