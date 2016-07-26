const commands = [
  {name: 'grep',  options: '[-v] [REGEX]',    description: 'Display matching comments on a post. Invert with <url>-v</url>.'},
  {name: 'user',  options: '[-v] [USERNAME]', description: 'Display comments by <url>USERNAME</url>. Invert with <url>-v</url>.'},
  {name: 'depth', options: '[NUMBER]',        description: 'Display comments with depth <url>NUMBER</url>.'},
  {name: 'reset', options: '',                description: 'Reset all filters and display everything.'},
  {name: 'limit', options: '[NUMBER]',        description: 'Show only the first <url>NUMBER</url> comments for each comment.'},
  {name: 'open',  options: '',                description: '[Experimental] Open HN home page in a new tab.'},
  {name: 'focus', options: '',                description: '[Experimental] Put each sentence in its own line.'},
];

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function suggestHelp(words) {
  let cmd = words.shift();
  let suggests = [];
  let regex = new RegExp(`(^${escapeRegExp(cmd)})`, 'i');
  let matches = commands.filter(function(c) {
    return c.name.match(regex);
  }).map(function(c) {
    let name = c.name.replace(regex, "<match>$1</match>");
    let options = c.options;
    return {
      content: c.name,
      description: `<url>${name} ${options}</url> ${c.description}`,
    }
  });

  // let matches = commands.filter(c => c.content.match(regex));
  let commandNames = commands.map(c => c.name.replace(regex, "<match>$1</match>")).join(' | ')
  matches.push({content: 'help', description: `<url>HN commands</url> ${commandNames}`});
  return matches;
}

function unFocus() {
  document.querySelectorAll('b[hnFocus]').forEach(function(hnFocus) {
    hnFocus.outerHTML = hnFocus.innerHTML;
  });
}

function cmdFocus() {
  unFocus();

  const replace = `<b style="display:block; font-weight:normal;" hnFocus>$1</b>`;
  const regex = /([^.]+\.\s)/g;

  document.querySelectorAll('.comtr').forEach(function(comtr) {
    comtr.querySelectorAll('.comment').forEach(function(comment) {
      setTimeout(() => replaceNodeRecursive(comment, regex, replace), 0);
    });
  });
}

function cmdLimit(queries) {
  let minDepth = 1;
  let limit = parseInt(queries[0]) || 0;

  if(limit === 0) {
    document.querySelectorAll('.comtr.hnOmniNoMatch').forEach(comtr => comtr.classList.remove('hnOmniNoMatch'));
    return;
  }

  let counter = [0];
  let lastDepth = 0;
  const leftIndent = 40;
  document.querySelectorAll('.comtr').forEach(function(comtr) {
    let depth = parseInt(comtr.querySelector('.ind img').getAttribute('width'))/leftIndent;

    if(depth > lastDepth) {
      counter.push(0);
    } else if(depth < lastDepth) {
      for(let i = depth ; i < lastDepth ; i++) {
        counter.pop();
      }
    }

    counter[counter.length-1]++;

    console.log(depth, counter);

    deepestParent = counter[counter.length-1];

    for(let i = counter.length-1 ; i >= 1 ; i--) {
      if(counter[i] > deepestParent) {
        deepestParent = counter[i];
      }
    }

    if(deepestParent > limit && counter.length > minDepth) {
      setTimeout(() => comtr.classList.add('hnOmniNoMatch'), 0);
    } else {
      setTimeout(() => comtr.classList.remove('hnOmniNoMatch'), 0);
    }

    lastDepth = depth;
  });
}

function cmdDepth(queries) {
  let depth = parseInt(queries[0]) || 0;

  let selectors = [];
  const leftIndent = 40;
  for(let i = 0 ; i < depth ; i++) {
    selectors.push(`.ind img[width="${i * leftIndent}"]`);
  }

  if(selectors.length === 0) {
    document.querySelectorAll('.comtr.hnOmniNoMatch').forEach(comtr => comtr.classList.remove('hnOmniNoMatch'));
    return;
  }

  document.querySelectorAll('.comtr').forEach(function(comtr) {
    if(comtr.querySelector(selectors.join(','))) {
      comtr.classList.remove('hnOmniNoMatch');
    } else {
      comtr.classList.add('hnOmniNoMatch');
    }
  });
}

function cmdGrep(queries, options) {
  if(queries.indexOf('-v') > -1) {
    queries.splice(queries.indexOf('-v'), 1);
    options.invert = true;
  }

  let isShowAll = (queries.length === 0);
  let regexes = queries.map(q => new RegExp(`(${q})`, 'ig'));

	let hashCode = function(str) {
		var hash = 0, i, chr, len;
		if (str.length === 0) return hash;
		for (i = 0, len = str.length; i < len; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};

  let generateColor = function(word) {
    const min = 0;
    const max = 230;
    const range = max - min;
    return '#' + [
      min + Math.abs(hashCode("red" + word) % range),
      min + Math.abs(hashCode("blue" + word) % range),
      min + Math.abs(hashCode("green" + word) % range),
    ].map(val => val.toString(16))
     .map(val => "00".substring(0, 2 - val.length) + val)
     .join('');
  }

  let colors = {};
  if(regexes.length === 1) {
    colors[regexes[0].toString()] = '#ff6600';
  } else {
    regexes.forEach(regex => colors[regex.toString()] = generateColor(regex.toString().toLowerCase()));
  }

  document.querySelectorAll('b[hnGrep]').forEach(function(hnGrep) {
    hnGrep.outerHTML = hnGrep.innerHTML;
  });

  document.querySelectorAll('.comtr').forEach(function(comtr, comtri) {
    if(isShowAll) {
      comtr.classList.remove('hnOmniNoMatch');
      return;
    }

    let isMatch = false;
    if(options.user) {
      isMatch = regexes.filter(regex => comtr.querySelector('.hnuser').innerText.match(regex)).length === regexes.length;
    } else {
      isMatch = regexes.filter(regex => comtr.querySelector('.comment').innerText.match(regex)).length === regexes.length;
    }

    if(options.invert) {
      isMatch = !isMatch;
    }

    if(!isMatch) {
      if(!comtr.classList.contains('hnOmniNoMatch')) {
        setTimeout(() => comtr.classList.add('hnOmniNoMatch'), 0);
      }
      return;
    }

    if(comtr.classList.contains('hnOmniNoMatch')) {
      setTimeout(() => comtr.classList.remove('hnOmniNoMatch'), 0);
    }

    if(options.user) {
      return;
    }

    if(options.invert) {
      return;
    }

    comtr.querySelectorAll('.comment').forEach(function(comment) {
      regexes.forEach(function(regex) {
        const replace = `<b style="background-color:${colors[regex]}; color:#fff; font-weight:normal;" hnGrep>$1</b>`;
        replaceNodeRecursive(comment, regex, replace);
      });
    });
  });
}


chrome.omnibox.onInputChanged.addListener(
  function(query, suggest) {
    let words = query.split(/\s+/).filter(q => q);
    suggest(suggestHelp(words));
  }
);

chrome.omnibox.onInputEntered.addListener(
  function(query) {
    let words = query.split(/\s+/).filter(q => q);
    let cmd = words.shift()
    let code = '';

    switch(cmd) {
      case 'reset':
        code = `
          (${unFocus.toString()})();
          (${cmdGrep.toString()})([], {});
          (${cmdDepth.toString()})([], {});
          (${cmdLimit.toString()})([], {});
        `;
        break;
      case 'user':
        code = `(${cmdGrep.toString()})(${JSON.stringify(words)}, {user: true})`;
        break;
      case 'grep':
        code = `(${cmdGrep.toString()})(${JSON.stringify(words)}, {})`; // TODO {children: true, parents: true}
        break;
      case 'depth':
        code = `(${cmdDepth.toString()})(${JSON.stringify(words)})`;
        break;
      case 'limit':
        code = `(${cmdLimit.toString()})(${JSON.stringify(words)})`;
        break;
      case 'open':
        chrome.tabs.create({url: "https://news.ycombinator.com"});
        return;
      case 'focus':
        code = `(${cmdFocus.toString()})(${JSON.stringify(words)})`;
        break;
      // case 'hl':
      //   code = `(${cmdGrep.toString()})(${JSON.stringify(words)}, {hl: true})`;
      //   break;
      // case 'help': // TODO
      //   code = `(${cmdHelp.toString()})(${JSON.stringify(words)})`;
      //   break;
      default:
        return;
    }
    chrome.tabs.executeScript({code: code});
  }
);
