/**
 * tabs plugin v0.1.5.3
 * http://wingsline.com
 *
 * Copyright 2012 Arpad Olasz
 * All rights reserved.
 *
 * --------------------------------------------------------------
 * USAGE AND REQUIREMENTS
 * --------------------------------------------------------------
 *
 * Requirements: jQuery 1.9+
 *
 *
 * Required CSS:
 * --------------------------------------------------------------
 *
 * .tabs--content li {display:none}
 * .tabs--content li.active {display:block}
 *
 * Required HTML:
 * --------------------------------------------------------------
 *
 *  <ol class="tabs">
 *      <li><a href="#tab1">Tab 1</a></li>
 *      <li><a href="#tab2">Tab 2</a></li>
 *      <li><a href="#tab3">Tab 3</a></li>
 *  </ol>
 *  <ul class="tabs--content">
 *      <li id="tab1">Content 1</li>
 *      <li id="tab2">Content 2</li>
 *      <li id="tab3">Content 3</li>
 *  </ul>
 *
 *
 * Usage:
 * --------------------------------------------------------------
 *
 *  Initialize the plugin:
 *  $('.tabs').tabs();
 *
 *  When initializing, you can pass options to the plugin:
 *  $('.tabs').tabs({'option1':'value', 'option2': 'value'});
 *
 *
 *  The following methods will open a tab:
 *
 *  1. HTML
 *  Insert a hidden input element into the HTML:
 *  <input name="openTab" value="tab1" type="hidden"/>
 *
 *  2. Javascript
 *  Add this after the plugin was initialized:
 *  $('.tabs').tabs('open', 'tabname');
 *
 *  If you want to set the hash of the current URL:
 *  $('.tabs').tabs('open', 'langhu', true);
 *
 *  3. Open the first or the last tab
 *  $('.tabs').tabs('open', 'first');
 *  $('.tabs').tabs('open', 'last');
 *
 *
 * Notes:
 * --------------------------------------------------------------
 *
 *  - the tab content must be inserted after the tab handlers
 *  - the plugin adds the class "active" to the li elements, so make
 *  sure in your style sheet you hide the li elemenets
 *  and show the li.active ones
 *
 */

(function( $ ){
    'use strict';
        // namespace for events and data
        // use it like 'click.' + __NS__ for the event
        // and data(__NS__) for data
    var __NS__ = 'tabs',
        // public methods
        methods = {

            /**
             * Initializes the plugin
             * @param  {object} options Options object
             * @return {object}         Tabs object
             */
            init : function( options ) {

                return this.each(function(){

                    var $this = $(this),
                        data = $this.data(__NS__);

                    // If the plugin hasn't been initialized yet
                    if ( ! data ) {
                        // default options
                        data = $.extend( {
                            // the class for the tabbed content container
                            'tabContent' : '.tabs--content',
                            // content element in the container will have this class when open
                            'activeClass': 'active',
                            // if a hidden element is present in the page we attempt to open that tab
                            'hiddenInputName': 'openTab',
                            // update the browser hash
                            'updateHash' : false
                        }, options);

                        $(this).data(__NS__, data);

                        // update the validIds for the tabs
                        methods.update.apply($this);

                        // if there is a hidden element in the page open that tab
                        var openTab = $(':hidden[name="'+data.hiddenInputName+'"]'),
                            openTabArray = $(':hidden[name="'+data.hiddenInputName+'[]"]');


                        // if there are multiple opentab arrays
                        if (openTabArray.length) {
                            openTabArray.each(function () {
                                methods.open.apply($this, [$(this).val().toString()]);
                            });
                        } else if(openTab.length) {
                            methods.open.apply($this, [$(openTab).val().toString()]);
                        }

                        else if(window.location.hash)
                        {
                            var hash = window.location.hash.substr(1);
                            $.extend($this.data(__NS__), {'hash':hash});
                            // attempt to auto-open the tab if it is a valid id
                            if($.inArray(hash, data.validIds) >= 0)
                            {
                                methods.open.apply($this, [hash]);
                            }

                        }

                        // add the events to the li > a elements
                        /* jQuery 9 compatibility */
                        $(this).on('click.' + __NS__, 'li > a', function(e)
                        // $('li > a', $this).live('click.' + __NS__, function(e)
                        {
                            // update the valid tabs
                            methods.update.apply($this);

                            var aHash = this.hash.substr(1);
                            if(aHash) {
                                e.preventDefault();
                                if (data.updateHash) {
                                    window.location.hash = '#' + aHash;
                                }
                                methods.open.apply($this, [aHash, e]);

                            }

                        });
                    }
                });
            }, // end init()


            /**
             * This function essentially updates the tab id's in case new tabs are added
             * @return {object} Tabs object
             */
            update : function ( ) {

                return this.each(function(){

                    var $this = $(this),
                        data = $this.data(__NS__);

                    data.validIds = [];
                    $('li > a', $this).each(function()
                    {
                        var aHash = this.hash.substr(1);
                        if(aHash)
                        {
                            data.validIds.push(aHash);
                        }
                    });

                });
            },


            /**
             * Removes every trace of the tabs plugin from the DOM
             * @return {object} Tabs object
             */
            destroy : function( ) {

                return this.each(function(){

                    var $this = $(this),
                        data = $this.data(__NS__);

                    $(window).unbind('.'+__NS__);
                    /* jQuery 1.9 compatibility */
                    $(document).off('.'+__NS__, 'li > a');
                    // $('li > a').die('.'+__NS__);
                    data[__NS__].remove();
                    $this.removeData(__NS__);

                });

            }, // end destroy()


            /**
             * Opens a tab, closing the others
             * @param  {string} hash Id of the tab to be opened
             * @return {object}      Tabs element
             */
            open: function (hash, e) {

                return this.each(function(){

                    var $this = $(this),
                        data = $this.data(__NS__),
                        container = $this.next(data.tabContent);

                    // if the requested hash is not in the validIds we don't do nothing
                    if($.inArray(hash, data.validIds) < 0 && hash !== 'first' && hash !== 'last') {
                        return;
                    }

                    // if hash == first, we open the 1st tab
                    if(hash === 'first')
                    {

                        hash = data.validIds[0];
                    }
                    // if hash == last, we open the last tab
                    else if (hash === 'last')
                    {
                        hash = data.validIds[data.validIds.length - 1];
                    }


                    if(container.length)
                    {
                        // make the tab active
                        // get hash of the A element
                        $this.children('li').each(function (){
                            var a = $('a:first', this);

                            if(a.length)
                            {

                                var aHash = a.get(0).hash.substr(1);

                                if(aHash)
                                {
                                    // if the hash of the a elmenet matches, we make this active
                                    if(aHash === hash)
                                    {
                                        $(this).addClass(data.activeClass);
                                        // update the hash only if we have hash
                                        if(undefined !== e && window.location.hash && data.updateHash)
                                        {
                                            window.location.hash = '#' + aHash;
                                        }

                                    }
                                    // otherwise we remove the active class from the li
                                    else
                                    {
                                        $(this).removeClass(data.activeClass);
                                    }
                                }

                            }
                        });


                        // show the tab content
                        $('#' + hash, container).addClass(data.activeClass);
                        // hide other tab content
                        container.children().not($('#'+hash)).removeClass(data.activeClass);
                    }

                });
            } // end open ()

        }; // end methods

        $.fn.tabs = function( method ) {

            if ( methods[method] ) {
                return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply( this, arguments );
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.tabs' );
            }

        }; // end plugin

})( jQuery );
