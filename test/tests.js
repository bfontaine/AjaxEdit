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

    test( 'no element', function() {

        ok( $('#no-elem').ajaxedit('foo') );

    });

    test( 'no URL', function() {

        var $theDiv = $baseDiv.clone().appendTo(body);

        throws( function() { $theDiv.ajaxedit();   }         , Error);
        throws( function() { $theDiv.ajaxedit(''); }         , Error);
        throws( function() { $theDiv.ajaxedit({}); }         , Error);
        throws( function() { $theDiv.ajaxedit({ url: '' }); }, Error);

        $theDiv.remove();
    });

    test( 'hover button', function() {

        var $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/no-content.json'
            })
        );

        ok( $('input[type="button"]', $theDiv).length === 0 );

        $theDiv.trigger('mouseenter');
        ok( $('input[type="button"]', $theDiv).length === 1 );

        $theDiv.trigger('mouseleave');
        ok( $('input[type="button"]', $theDiv).length === 0 );


        $theDiv.remove();

    });

    test( 'edit on 1 event', function() {


        var $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/no-content.json',
                editOn: 'mouseover'
            })
        );

        $theDiv.trigger('mouseover');

        $theDiv.remove();

    });

    test( 'edit on multiple events', function() {


        var $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/no-content.json',
                editOn: ['mouseover', 'hoverButton', 'click']
            })
        );

        $theDiv.trigger('mouseover');

        $theDiv.remove();

    });

    test( 'bad url', function() {

        var $theDiv = $baseDiv.clone().appendTo(body);

        ok(
            $theDiv.ajaxedit({
                url: '/api/bad-url'
            })
        );

        // there should be no exception
        $theDiv.trigger('mouseenter');

        $theDiv.remove();

    });

})(jQuery);
