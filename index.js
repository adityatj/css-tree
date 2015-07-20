var fs = require('fs');
var sys = require('sys');
var request = require('request');
var cheerio = require('cheerio');
var optparse = require("optparse");
var url, file, html, $, root, isDomLoaded = true;
var switches = [
	['-h', '--help', 'Show help'],
	['-u', '--url [URL]', 'Source as URL'],
	['-f', '--file [FILE]', 'Source as a file'],
	['-s', '--html-string [HTML]', 'Source as a string'],
	['-r', '--root [ROOT]', 'Selector string for root node of DOM Class Tree']
];

var parser = new optparse.OptionParser(switches);

parser.on('url', function(name, value) {
    url = value;
});
parser.on('file', function(name, value) {
    file = value;
});
parser.on('html-string', function(name, value) {
    html = value;
});
parser.on('root', function(name, value) {
    root = value;
});
parser.on('help', function() {
    console.log(parser.toString());
    process.exit(0);
});

parser.parse(process.argv);

if(isDefined(html)) {
	$ = cheerio.load(html);
} else if(isDefined(file)) {
	$ = cheerio.load(fs.readFileSync(file));
} else if(isDefined(url)) {
	isDomLoaded = !isDomLoaded;	
	request.get({
	    url: url,
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
	     }
	  }, function(err, resp, body) {
		$ = cheerio.load(body);
		if(root)
			root = $(root);
		else
			root = $.root();
		CSSTree(root);
	});	
} else {
	console.log('Source is a must!');
	isDomLoaded = !isDomLoaded;
}

if(isDomLoaded) {
	if(root)
		root = $(root);
	else
		root = $.root();
	CSSTree(root);
}

function CSSTree(root, currentTab, isLastChildOfPrevParent) {
	if(!isDefined(currentTab))
		currentTab = '';
	var fixedTab = '';
	if(isDefined(isLastChildOfPrevParent)) {
		if(isLastChildOfPrevParent)
			fixedTab = '└───';
		else
			fixedTab = '├───';
	}		
	if(isDefined(root.attr('class')))
		console.log(currentTab + fixedTab + root.attr('class'));
	else
		console.log(currentTab + fixedTab + '<noclass>');	
	if(isDefined(isLastChildOfPrevParent)) {
		if(isLastChildOfPrevParent)
			currentTab += '    ';
		else
			currentTab += '│   ';
	}	
	var childrenSize = root.children().length;		
	root.children().each(function(idx){
		CSSTree($(this), currentTab, idx + 1 == childrenSize); 
	});
}

function isDefined(obj) {
    return typeof obj !== 'undefined';
};	


module.exports = {};