# A simple jquery tabs plugin 


**Requirements:** jQuery with live event support

## Required CSS:

	.tabs-content li {display:none}
 	.tabs-content li.active {display:block}
 	
 ## Required HTML:
 
	<ol class="tabs">
		<li><a href="#tab1">Tab 1</a></li>
		<li><a href="#tab2">Tab 2</a></li>
		<li><a href="#tab3">Tab 3</a></li>
	</ol>
	<ul class="tabs-content">
 		<li id="tab1">Content 1</li>
 		<li id="tab2">Content 2</li>
 		<li id="tab3">Content 3</li>
	</ul>
	
## Usage

Initialize the plugin:

	$('.tabs').tabs();

When initializing, you can pass options to the plugin:

	$('.tabs').tabs({'option1':'value', 'option2': 'value'});
	
You can also add a hashchange event to the window, to change the tabs when the
hash changes:

	$(window).bind('hashchange', function (){
		var hash = window.location.hash;
		if(hash){
			$('.tabs').tabs('open', hash.substr(1));
		}
		else{
			$('.tabs').tabs('open', 'first');
		}
	});

The following methods will open a tab:

#### HTML

Insert a hidden input element into the HTML:

	<input name="openTab" value="tab1" type="hidden">
	
#### Javascript

Add this after the plugin was initialized:

	$('.tabs').tabs('open', 'tabname');
		
If you want to set the hash of the current URL:

	$('.tabs').tabs('open', 'tabname', true);
	
#### Open the first or the last tab

	$('.tabs').tabs('open', 'first');
	$('.tabs').tabs('open', 'last');

## Notes

* the tab content must be inserted after the tab handlers sure in your style sheet you hide the li elemenets and show the li.active ones