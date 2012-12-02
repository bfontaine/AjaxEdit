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
            prefetch: false // #NotImplemented

        },


        // This Error is raised when no URL is provided for
        // GETting/POSTing the content
        noURLException = new Error( 'No URL provided.' ),

        $baseButton = $( '<input>' )
                        .attr( 'type', 'button' )
                        .addClass( 'ajaxedit-button' );


    // attach an "Edit" button to the element, which will be made
    // visible when the user move their mouse over the element
    function attachHoverButton( $el, label, callback ) {

        var $editButton = $baseButton.clone()
                            .attr( 'value', label )
                            .click( callback );

        $el.hover(
            function() {
                if ( !$el.data( 'edited' ) )
                    $editButton.appendTo( $el ); },

            function() { $editButton.detach(); }
        );

    }

    // called when the user click the "Save" button on an element
    // (return a callback)
    function saveEdit( opts, $el ) {

        return function( ev ) {
            //TODO
        };

    }

    // called when the user cancel an edit on an element
    // (return a callback)
    function cancelEdit( opts, $el ) {

        return function( ev ) {
            console.log(_ = $el);
            $el.find( '.ajaxedit-button' ).remove().end()
               .attr( 'contenteditable', false )
               .data( 'edited', false )
               .trigger( 'EditCanceled' );

            // TODO replace the current content by the original one

        };

    }

    // called when the user try to edit an element
    // (return a callback)
    function edited( opts, $el ) {
    
        return function() {

            if ( $el.data( 'edited' ) ) {
                return;
            }

            $el.trigger( 'EditInit' )
               .data( 'edited', true );

            fetch( opts )( $el,
                 // called with the data from the server
                 function( data ) {

                     if ( !$el.data( 'edited' ) ) { return; }

                     // TODO get text from data
                     var text = '';

                     $el.trigger('EditOk')
                        .text( text );

                     // "Cancel" button
                     $baseButton.clone()
                       .attr( 'value', opts.buttons.cancel )
                       .click( cancelEdit( opts, $el ) )
                       .appendTo( $el );

                     // "Save" button
                     $baseButton.clone()
                       .attr( 'value', opts.buttons.save )
                       .click( saveEdit( opts, $el ) )
                       .appendTo( $el );

                     // FIXME: the user can erase the buttons, so we have
                     // to display it with absolute positioning over the element,
                     // but not in it
                     $el.attr( 'contenteditable', true );
                 
                 },
                 // called if there's an error
                 function( err ) {

                    if ( !$el.data( 'edited' ) ) { return; }
                 
                    $el.data( 'edited', false )
                       .trigger('EditError');

                    //TODO callback?
                 
                 }
            );
        };
    }

    // fetch $el's data from the server and pass it to
    // the callback function
    // (return a callback)
    function fetch( opts ) {

        return function( $el, successCallback, errorCallback ) {

            // optional additional parameters
            var params = $el.data( 'params' ) || {};

            $.ajax( opts.url, {
                data: params,
                context: $el,
                success: successCallback,
                error: errorCallback
            });

        };
    
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

                    attachHoverButton( $field, opts.buttons.edit, edited(opts, $field) );
                
                }
                else {

                    $field.bind( ev, edited(opts, $field) );

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
