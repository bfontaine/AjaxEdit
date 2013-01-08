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
        // getting/posting the content
        noURLException = new Error( 'No URL provided.' ),
                        
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


    // attach an "Edit" button to the element, which will be made
    // visible when the user move their mouse over the element
    function attachHoverButton( $el, label, callback ) {

        var $editButton = $baseButton.clone()
                            .attr( 'value', label )
                            .click( callback );

        $el.hover(

            function() {
            
                if ( !$el.data( 'edited' ) ) {
                
                    addButton( $el, $editButton );
                
                }

            },

            function() { removeButton( $el, $editButton ); }
        );

    }

    // Add a button on an element
    function addButton( $el, $button ) {
        
        $button.appendTo( $el );

    }

    // Remove a button which is on an element
    function removeButton( $el, $button ) {
        
        $button.detach();

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
        
            $el.find( button_class ).remove().end()
               .find( editor_class ).remove().end()
               .data( 'edited', false )
               .trigger( 'EditCanceled' )
               .html( $el.data( 'html' ) || '' );

        };

    }

    // called when the user try to edit an element
    // (return a callback)
    function edited( opts, $el ) {
    
        return function() {

            if ( $el.data( 'edited' ) ) { return; }

            $el.trigger( 'EditInit' )
               .data( 'edited', true );

            fetch( opts )( $el,

                 // called with the data from the server
                 function( data ) {

                     var text;

                     if ( !$el.data( 'edited' ) ) { return; }

                     text = data[ $el.data( 'name' ) ][ opts.fields.text ];

                     $el.trigger( 'EditOk' )
                        .text( '' )
                        .data( 'html',
                               data[$el.data( 'name' )][opts.fields.html] );

                     // "Cancel" button
                     addButton( $el, $baseButton.clone()
                                       .attr( 'value', opts.buttons.cancel )
                                       .click( cancelEdit( opts, $el ) ) );

                     // "Save" button
                     addButton( $el, $baseButton.clone()
                                       .attr( 'value', opts.buttons.save )
                                       .click( saveEdit( opts, $el ) ) );

                     $el.append( $baseEditor.clone().text( text ) );
                 
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
        if ( fields.length === 0 ) { return this; }

        // List of events triggered when the user wants to edit an element
        var editOn = ( $.type( opts.editOn ) === 'array' ) ?
                            opts.editOn :
                                [ opts.editOn ];

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
