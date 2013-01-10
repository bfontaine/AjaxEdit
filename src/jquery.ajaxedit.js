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
             * This define if the plugin should automatially work on
             * dynamically added elements.
             **/ 
            live: true,

            /**
             * Define when an element should be set to editable mode. The value
             * should be the name of an event.
             **/
            editOn: '',

            /**
             * Define when an element’s value should be saved and the element
             * unset from editable mode. The value should be the name of an
             * event.
             **/
            saveOn: '',

            /**
             * Define when an element edition should be canceled and the
             * element unset from editable mode. The value should be the
             * name of an event.
             **/
            cancelOn: '',

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
                 *  fetch( url, fn )
                 *  - url [String]: the URL to fetch
                 *  - fn [Function]: a function, used as a callback, which
                 *    takes two arguments: the first is the text value of
                 *    an element, i.e. the text the user will edit, and
                 *    the second is the html value which should be displayed
                 *    when the element is not in edit mode.
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
                 **/
                save: save

            }

        };


    // AjaxEdit main function
    $.fn.ajaxedit = function( o ) {

        var opts = {},
            url;

        // if the argument is a string, we assume that
        // this is the API endpoint (URL)
        if ( typeof o === 'string' ) {

            opts = $.extend( true, {}, defaultOptions, { url: o } );

        }
        // else, this is an object where keys/values are options
        else if ( typeof o === 'object' ) {

            opts = $.extend( true, {}, defaultOptions, o );

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

        });

        //TODO

        return this;

    };

})( jQuery );
