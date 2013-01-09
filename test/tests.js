(function($) {

    // globals
    var g = {};

    describe( 'Initialization', function() {

        beforeEach(function() {

            g.$baseDiv = $( '<div></div>' )
                                .html( '<p>Hello!</p>' );

        });

        it( 'should accept the URL as an `uri` parameter', function() {

            expect(function() { g.$baseDiv.ajaxedit({ uri: 'foo' }); }).to.not.throw(Error);

        });

        it( 'should accept the URL as an `uri` parameter', function() {

            expect(function() { g.$baseDiv.ajaxedit({ url: 'foo' }); }).to.not.throw(Error);

        });

        it( 'should accept the URL as a `data-fetch-url` attribute', function() {

            g.$baseDiv.attr( 'data-fetch-url', 'foo' );
            expect(function() { g.$baseDiv.ajaxedit(); }).to.not.throw(Error);

        });

        it( 'should accept the URL as a `data-fetch-uri` attribute', function() {

            g.$baseDiv.attr( 'data-fetch-uri', 'foo' );
            expect(function() { g.$baseDiv.ajaxedit(); }).to.not.throw(Error);

        });

        it( 'should return itself', function() {

            expect( g.$baseDiv.ajaxedit({ url: 'foo' }) ).to.deep.equal( g.$baseDiv );
        
        });

    });

})(jQuery);
