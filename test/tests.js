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
                html: '<p>Hello <i>World</i>!</p>',
                text: 'Hello *World*!'
            }
        }
    });

    var $baseDiv = $('<div>').attr('data-name', 'the_text'),
        body     = document.body;

    test( 'no URL', function() {

        var $theDiv = $baseDiv.clone().appendTo(body);

        throws( function() { $theDiv.ajaxedit();   }, Error);
        throws( function() { $theDiv.ajaxedit({}); }, Error);

        $theDiv.remove();
    });

    test( 'hover button', function() {

        var $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/no-content'
            })
        );

        ok( $('input[type="button"]', $theDiv).length === 0 );

        $theDiv.trigger('mouseenter');
        ok( $('input[type="button"]', $theDiv).length === 1 );

        $theDiv.trigger('mouseleave');
        ok( $('input[type="button"]', $theDiv).length === 0 );


        $theDiv.remove();

    });


})(jQuery);
