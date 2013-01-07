(function($) {

    // empty text
    $.mockjax({
        url: '/api/no-content.json',
        responseText: {
            the_text: {
                html: '',
                text: ''
            }
        }
    });

    // one field
    $.mockjax({
        url: '/api/hello.json',
        responseText: {
            the_text: {
                html: '<p>Hello</p>',
                text: 'Hello'
            }
        }
    });

    var $baseDiv = $( '<div>' )
                        .attr( 'data-name', 'the_text' )
                        .html( '<p>Hello</p>' ),
        $theDiv,
        body     = document.body;

    test( 'no element', function() {

        ok( $( '#no-elem' ).ajaxedit( 'foo' ) );

    });

    test( 'no URL', function() {

        $theDiv = $baseDiv.clone().appendTo(body);

        throws( function() { $theDiv.ajaxedit();   }         , Error);
        throws( function() { $theDiv.ajaxedit(''); }         , Error);
        throws( function() { $theDiv.ajaxedit({}); }         , Error);
        throws( function() { $theDiv.ajaxedit({ url: '' }); }, Error);

        $theDiv.remove();
    });

    test( 'hover button', function() {

        $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/no-content.json'
            })
        );

        ok( $( 'input[type="button"]', $theDiv ).length === 0 );

        $theDiv.trigger( 'mouseenter' );
        ok( $( 'input[type="button"]', $theDiv ).length === 1 );

        $theDiv.trigger( 'mouseleave' );
        ok( $( 'input[type="button"]', $theDiv ).length === 0 );


        $theDiv.remove();

    });

    test( 'edit on 1 event', function() {

        $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/no-content.json',
                editOn: 'mouseover'
            })
        );

        $theDiv.trigger( 'mouseover' );

        $theDiv.remove();

    });

    test( 'edit on multiple events', function() {

        $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/no-content.json',
                editOn: ['mouseover', 'hoverButton', 'click']
            })
        );

        $theDiv.trigger( 'mouseover' );

        $theDiv.remove();

    });

    test( 'bad url', function() {

        $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/bad-url'
            })
        );

        // there should be no exception
        $theDiv.trigger( 'mouseenter' );

        $theDiv.remove();

    });

    test( 'edit via hover button click', function() {

        $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/hello.json'
            })
        );

        ok( $( 'input[type="button"]', $theDiv).length === 0 );

        $theDiv.trigger( 'mouseenter' );
        ok( $( 'input[type="button"]', $theDiv).length === 1 );

        // click on "Edit": two buttons should be displayed: "Cancel" & "Save"
        $( 'input[type="button"]', $theDiv ).first().trigger( 'click' );

        // waiting for the fake server response
        stop();
        setTimeout(function() {

            ok( $( 'input[type="button"]', $theDiv ).length === 2 );
            ok( $theDiv.find( 'div[contenteditable]' ).length === 1 );
            
            start();

            // $theDiv.remove();

        }, 500);


    });

    test( 'Cancel edit', function() {

        // $theDiv = $baseDiv.clone().appendTo(body);

        $( 'input[type="button"]', $theDiv ).first().trigger( 'click' );

        ok( $( 'input[type="button"]', $theDiv ).length === 1 );
        ok( $theDiv.attr( 'contenteditable' ) === 'false' );
        ok( $theDiv.html() === '<p>Hello</p>' );

    });

})(jQuery);
