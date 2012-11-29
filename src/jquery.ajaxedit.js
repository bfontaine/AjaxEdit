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
                html: 'html',
                text: 'text'
            },

            // buttons' labels
            buttons: {
                edit:   'Edit',
                save:   'Save',
                cancel: 'Cancel'
            },

            // if this is set to true, the fields' text values will
            // be preloaded. If this is set to false, their text values
            // will be loaded only if the user try to edit them.
            preload: false

        },


        // This Error is raised when no URL is provided for
        // GETting/POSTing the content
        noURLException = new Error( 'No URL provided.' );


    // attach an "Edit" button to the element, which will be made
    // visible when the user move their mouse over the element
    function attachHoverButton( $el, label, callback ) {

        var $editButton = $( '<input>' )
                            .attr( 'type', 'button' )
                            .addClass( 'ajaxedit-button' ),
                            .text( label )
                            .click( callback );

        $el.hover(
            function() { $editButton.appendTo( $el ); },
            function() { $editButton.detach(); }
        );

    }

    // AjaxEdit main function
    $.fn.ajaxedit = function( opts ) {

        if ( arguments.length === 0 ) {

            throw noURLException;

        }

        // if the argument is a string, we assume that
        // this is the API endpoint (URL)
        if ( typeof opts === 'string' ) {

            opts = $.extend( true, {}, defaultOptions, { url: opts } );

        }
        // else, this is an object where keys/values are options
        else if ( typeof opts === 'object' ) {

            opts = $.extend( true, {}, defaultOptions, opts );

        }

        if (!opts.hasOwnProperty('url')) {

            throw noURLException;

        }

        var fields = [];

        this.each( function(e) {

            var $e = $(e);

            if ( $e.attr( 'data-editable' ) === 'true' && $e.attr( 'data-name' ) ) {

                // if this element is editable, don't search for fields in it
                fields.push($e);

            }
            else {

                // otherwise, pick its children
                fields = fields.concat( $e.find( '[data-editable="true"][data-name]' ) );

            }

        });

        // if there is no editable elements, don't do anything
        if ( fields.length === 0 ) {
            
            return this;
        
        }

        // List of events triggered when the user wants to edit an element
        var editOn = ($.type( opts.editOn ) === 'array')
                        ? opts.editOn
                        : [ opts.editOn ];

        $.each( fields, function( $field ) {

            // this is the function which will be called when the user
            // try to edit the field
            var callback = function( $el ) {

                // if the field is currently being edited, don't do anything
                if ( $el.data( 'edited' ) ) {
                    return;
                }

                $el.data( 'edited', true );

                // TODO

            };

            // For each 'edit' event, bind the event to the callback
            $.each( editOn, function( ev ) {

                // special 'event' : The "Edit" button
                if ( ev === 'hoverButton' ) {

                    attachHoverButton( $field, opts.buttons.edit, callback );
                
                }
                else {

                    $field.bind( ev, callback );

                }

            });

            // The field is ready to be edited
            $field
                .attr( 'contenteditable', false )
                .trigger( 'EditReady' );

        });

        return this;

    };

})( jQuery );
