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


    var $the_div = $('div')
                    .attr('data-name', 'the_text')
                    .appendTo(document.body);


    test( 'one field, no initial content', function() {

        ok(
            $the_div.ajaxedit({
                url: '/api/no-content'
            })
        );

        // TODO

    });


})(jQuery);
