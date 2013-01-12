/**!
 * AjaxEdit v0.0.1
 *
 * Lightweight jQuery plugin used to edit HTML regions without reloading
 * the page.
 *
 * Author: Baptiste Fontaine
 * Licence: MIT
 * Repository: github.com/bfontaine/AjaxEdit 
 *
 **/
;(function( $ ) {


    var fetch, save,
        defaultOptions = {

            /** 
             * Default container of the editable elements. This should be
             * set for better performances. Can be any valid CSS selector,
             * a DOM object or a jQuery object. If the selector match more
             * than one element, only the first will be used.
             **/ 
            container: 'body',

            /**
             * Define when an element should be set to editable mode. The value
             * should be the name of an event.
             **/
            editOn: 'dblclick',

            /**
             * Define when an element’s value should be saved and the element
             * unset from editable mode. The value should be the name of an
             * event.
             **/
            saveOn: 'blur',

            /**
             * Define when an element edition should be canceled and the
             * element unset from editable mode. The value should be the
             * name of an event. if it’s a keydown event, the key number
             * can be specified after a colon, e.g.: "keydown:13".
             **/
            cancelOn: 'keydown:27',

            /**
             * Define the fields used to fetch/save from your API. The plugin
             * get values from an endpoint, and post them to this endpoint. You
             * may want to override the `fetch` & `save` functions, see the `fn`
             * option.
             **/
            fields: {
                html: 'html', // the name of the field for HTML
                text: 'text'  // the name of the field for text/markup
            },

            /**
             * Default functions used by the plugin
             **/
            fn: {

                /**
                 * Function used to fetch the data for the editable elements.
                 * The function signature should be as follow:
                 *  fetch( url, params fn )
                 *  - url [String]: the URL to fetch
                 *  - params [Object]: A set of parameters, empty right now, but
                 *    may be used in the future. These parameters should be sent
                 *    along with the fetch request.
                 *  - fn [Function]: a function, used as a callback, which
                 *    takes two arguments: the first is the text value of
                 *    an element, i.e. the text the user will edit, and
                 *    the second is the html value which should be displayed
                 *    when the element is not in edit mode.
                 *  - opts [Object]: the set of options passed to `.ajaxedit()`
                 **/
                fetch: fetch,

                /**
                 * Function used to save the data for the editable elements.
                 * The function signature should be as follow:
                 *  save( url, params, fn )
                 *  - url [String]: the URL to fetch
                 *  - params [Object]: A set of parameters, with:
                 *      - text [String]: the value of the element
                 *      - optionally, more parameters set with the
                 *        `data-ajaxedit-params` attribute of the element.
                 *  - fn [Function]: a function, used as a callback, which
                 *    takes one argument, the html value which should be
                 *    displayed when the element is not in edit mode.
                 *  - opts [Object]: the set of options passed to `.ajaxedit()`
                 **/
                save: save

            },

            /**
             * Define if each element’s values should be prefetched when the
             * page is loaded.
             **/
            prefetch: false

        },
        
        cache, bindEv,
        editElement, saveElement, cancelElement;

    /**
     * Handle values caching (internal function).
     *  cache( obj ) : cache `obj` and return its id
     *  cache( id  ) : return `obj`
     *  cache( id, field ) : return `obj[field]`
     **/
    cache = (function() {
        
        var _cache = {},
            _cacheCount = 0;
        
        return function cache( id, field ) {

            if ( arguments.length === 1 ) {
            
                if ( typeof id === 'number' ) {

                    return _cache[ id ];
                
                }
                else {

                    _cache[ ++_cacheCount ] = id;
                    return _cacheCount;

                }
            
            }

            if ( typeof field === 'string' && id in _cache ) {

                return _cache[ id ][ field ];

            }

        };

    })();

    /**
     * Listen for an event on an element, and call a function on it.
     * This is used as a proxy to `.on` jQuery method, to handle special
     * events like "keydown:13".
     **/
    bindEv = function bindEv( $el, ev, sel, fn ) {

        var ev_parts = ev.split( ':' );

        if ( ev_parts.length === 1 ) {

            return $el.on( ev, sel, fn );

        }

        return $el.on( ev_parts[ 0 ], sel, function( e ) {

            if ( e.keyCode === +ev_parts[1] ) {

                return fn( e );

            }

        });

    };

    /**
     * Default fetch function
     **/
    fetch = function fetchDefaultFn( url, params, fn, opts ) {

        opts = opts || defaultOptions;
        fn   = fn || $.noop;

        // TODO handle errors
        $.ajax( url, {

            type: 'get',
            dataType: 'json',
            data: params,
            success: function( data ) {

                if ( data ) {

                    fn( data[ opts.fields.text ],
                        data[ opts.fields.html ] );

                } else {

                    fn();

                }

            }

        });

    };

    /**
     * Default save function
     **/
    save = function saveDefaultFn( url, params, fn, opts ) {

        params = params || {};
        opts   = opts || defaultOptions;
        fn     = fn || $.noop;

        // TODO handle errors
        $.ajax( url, {

            type: 'post',
            dataType: 'json',
            data: params,
            success: function( data ) {

                if ( data ) {

                    fn( data[ opts.fields.html ] );

                } else {

                    fn();

                }

            }

        });

    };

    /**
     * Function called when the user want to edit an element.
     **/
    editElement = function( ev ) {

        var $e = $( ev.target );

        if ( $el.data( 'ajaxedit.editMode' ) === true ) { return; }

        //TODO
    };

    /**
     * Function called when the user want to save an element.
     **/
    saveElement = function( ev ) {

        var $e = $( ev.target );

        if ( !$el.data( 'ajaxedit.editMode' ) ) { return; }

        //TODO
    };

    /**
     * Function called when the user want to cancel an element edition.
     **/
    cancelElement = function( ev ) {

        var $e = $( ev.target );

        if ( !$el.data( 'ajaxedit.editMode' ) ) { return; }

        //TODO
    };

    // AjaxEdit main function
    $.fn.ajaxedit = function( o ) {

        var opts = {},
            $container, url;

        // if the argument is a string, we assume that
        // this is the API endpoint (URL)
        if ( typeof o === 'string' ) {

            opts = $.extend( true, {}, defaultOptions, { url: o } );

        }
        // else, this is an object where keys/values are options
        else if ( typeof o === 'object' ) {

            opts = $.extend( true, {}, defaultOptions, o );

        } else {

            opts = $.extend( true, {}, defaultOptions );

        }

        url = opts.url || opts.uri;

        this.each(function( i, e ) {

            var $e = $( e ), u;

            if (u = ( $e.data( 'fetchUrl' ) || $e.data( 'fetchUri' ) ) ) {

                $e.data( 'ajaxedit.url', u.trim() );

            } else if ( url ) {

                $e.data( 'ajaxedit.url', url.trim() );

            } else {

                throw new Error( 'No URL provided.' );

            }

            $e.data( 'ajaxedit.editMode', false );

        });

        $container = $( opts.container ).first();

        if ( $container.length === 0 ) {

            $container = $( defaultOptions.container ).first();

        }

        bindEv( $container, opts.editOn  , this.selector, editElement   );
        bindEv( $container, opts.saveOn  , this.selector, saveElement   );
        bindEv( $container, opts.cancelOn, this.selector, cancelElement );

        return this;

    };

})( jQuery );
