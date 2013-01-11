(function($) {

    // globals
    var g = {
        $body : $( 'body' )
    };

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

        describe( 'with default options', function() {

            beforeEach(function() {

                g.$baseDiv = $( '<div></div>' )
                                    .attr( 'data-fetch-uri', 'foo' )
                                    .html( '<p>Hello!</p>' )
                                    .appendTo( g.$body );

                g.$body.off( 'dblclick' )
                       .off( 'keydown' )
                       .off( 'blur' );

            });

            afterEach(function() {

                g.$baseDiv.remove();

            });

            it( 'should add `dblclick`, `keydown` & `blur` listeners on body',
                        function() {

                expect( $._data( g.$body[0], 'events' ) ).to.be.undefined;

                g.$baseDiv.ajaxedit();

                expect( $._data( g.$body[0], 'events' ) ).not.to.be.undefined;
                expect( $._data( g.$body[0], 'events' ) ).to.include.keys(
                                                'dblclick', 'keydown', 'blur' );


            });

        });

    });

})(jQuery);
