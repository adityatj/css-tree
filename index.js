module.exports = {
	CSSTree: function(root, currentTab, isLastChildOfPrevParent) {
		if(!currentTab)
			currentTab = '';
		var fixedTab = '';
		if(this.isDefined(isLastChildOfPrevParent)) {
			if(isLastChildOfPrevParent)
				fixedTab = '└───';
			else
				fixedTab = '├───';
		}		
		if(this.isDefined(root.attr('class')))
			console.log(currentTab + fixedTab + root.attr('class'));
		else
			console.log(currentTab + fixedTab + '<noclass>');	
		if(this.isDefined(isLastChildOfPrevParent)) {
			if(isLastChildOfPrevParent)
				currentTab += '    ';
			else
				currentTab += '│   ';
		}	
		var childrenSize = root.children().size();		
		root.children().each(function(idx){
			CSSTree($(this), currentTab, idx + 1 == childrenSize); 
		});
	},
	isDefined: function(obj) {
	    return typeof obj !== 'undefined';
	}
};