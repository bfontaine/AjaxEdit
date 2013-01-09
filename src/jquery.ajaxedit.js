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


    var defaultOptions = {
         
            /* Define when the element will be set to editable mode.
             * Possible values:
             *      - 'hoverButton': A button labelled "Edit" will appear
             *                       when the user put the cursor over the
             *                       element. If they click on the button,
             *                       the element will become editable. This
             *                       is the default.
             *
             *      - Any other value will be threated as an event on the
             *        element, e.g. "dblclick".
             *
             * This can be a list with multiple values.
             */ 
            editOn: 'hoverButton',

            /* This option allows you to have different names for the fields
             * in your API. 
             */ 
            fields: {
                html: 'html', // the name of the field for HTML
                text: 'text'  // the name of the field for text/markup
            },

            // buttons' labels
            labels: {
                edit:   'Edit',
                save:   'Save',
                cancel: 'Cancel'
            }

        },

        // random key used for unique class attributes
        key = '__' + ( 0|Math.random() * 1000 ) + 'k' + +new Date(),

        // button class (internal usage only)
        button_class = key + '_button',
        // editor div class (internal usage only)
        editor_class = key + '_editor',

        // the button base which will be used for all buttons
        // .ajaxedit-button class is added for the user
        $baseButton = $( '<input>' )
                        .attr( 'type', 'button' )
                        .addClass([ 'ajaxedit-button', button_class ]),

        // the editor base which will be used for all editors (divs)
        $baseEditor = $( '<div></div>' )
                        .attr( 'contenteditable', true )
                        .addClass( editor_class );


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
