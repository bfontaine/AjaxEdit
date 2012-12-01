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
            prefetch: false

        },


        // This Error is raised when no URL is provided for
        // GETting/POSTing the content
        noURLException = new Error( 'No URL provided.' );


    // attach an "Edit" button to the element, which will be made
    // visible when the user move their mouse over the element
    function attachHoverButton( $el, label, callback ) {

        var $editButton = $( '<input>' )
                            .attr( 'type', 'button' )
                            .addClass( 'ajaxedit-button' )
                            .text( label )
                            .click( callback );

        $el.hover(
            function() { $editButton.appendTo( $el ); },
            function() { $editButton.detach(); }
        );

    }

    // this is the function which will be called when the user
    // try to edit a field
    function edited() {

        var $el = $(this);

        if ( $el.data( 'edited' ) ) {
            return;
        }

        $el.trigger( 'EditInit' )
           .data( 'edited', true );

        fetch( $el,
             // called with the data from the server
             function( data ) {

                 if ( !$el.data( 'edited' ) ) { return; }

                $el.trigger('EditOk');
             
             },
             // called if there's an error
             function( err ) {

                if ( !$el.data( 'edited' ) ) { return; }
             
                $el.data( 'edited', false )
                   .trigger('EditError');

                //TODO callback?
             
             }
        );
    }

    // called when the user cancel the edit of a field
    function cancelEdit() {
        $(this).data( 'edited', false )
               .trigger( 'EditCanceled' );
    }

    // fetch $el's data from the server and pass it to
    // the callback function
    function fetch( $el, successCallback, errorCallback ) {

        // optional additional parameters
        var params = $el.data( 'params' ) || {};

        $.ajax( $el.data( 'url' ), {
            data: params,
            context: $el,
            success: successCallback,
            error: errorCallback
        });

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

        if ( !opts.hasOwnProperty('url') || !opts['url'] ) {

            throw noURLException;

        }

        var fields = [];

        if ( this.length === 1 && this.attr('data-name') ) {
        
            fields.push( this );
        
        }
        else {

            this.each( function( i, e ) {

                var $e = $(e);

                if ( $e.attr( 'data-name' ) ) {

                    // if this element is editable, don't search for fields in it
                    fields.push($e);

                }
                else {

                    // otherwise, pick its children
                    fields = fields.concat( $e.find( '[data-name]' ) );

                }

            });

        }

        // if there is no editable elements, don't do anything
        if ( fields.length === 0 ) {
            
            return this;
        
        }

        // List of events triggered when the user wants to edit an element
        var editOn = ($.type( opts.editOn ) === 'array')
                        ? opts.editOn
                        : [ opts.editOn ];

        $.each( fields, function( i, $field ) {

            // For each 'edit' event, bind the event to the callback
            $.each( editOn, function( i, ev ) {

                // special 'event': The "Edit" button
                if ( ev === 'hoverButton' ) {

                    attachHoverButton( $field, opts.buttons.edit, edited );
                
                }
                else {

                    $field.bind( ev, edited );

                }

            });

            // The field is ready to be edited
            $field
                .data( 'url', opts.url )
                .attr( 'contenteditable', false )
                .trigger( 'EditReady' );

        });

        return this;

    };

})( jQuery );
