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

            expect(function() {
            
                g.$baseDiv.ajaxedit({ uri: 'foo' });
            
            }).to.not.throw(Error);

        });

        it( 'should accept the URL as an `uri` parameter', function() {

            expect(function() {
                
                g.$baseDiv.ajaxedit({ url: 'foo' });
            
            }).to.not.throw(Error);

        });

        it( 'should accept the URL as '
          + 'a `data-fetch-url` attribute', function() {

            g.$baseDiv.attr( 'data-fetch-url', 'foo' );
            expect(function() { g.$baseDiv.ajaxedit(); }).to.not.throw(Error);

        });

        it( 'should accept the URL as '
          + 'a `data-fetch-uri` attribute', function() {

            g.$baseDiv.attr( 'data-fetch-uri', 'foo' );
            expect(function() { g.$baseDiv.ajaxedit(); }).to.not.throw(Error);

        });

        it( 'should prefer the `data-fetch-uri|url` '
          + 'over the `uri|url` parameter', function() {

            g.$baseDiv.attr( 'data-fetch-uri', 'foo' );
            g.$baseDiv.ajaxedit({ uri: 'bar' });

            expect( g.$baseDiv.data( 'ajaxedit.url' ) ).to.equal( 'foo' );

        });

        it( 'should return itself', function() {

            expect( g.$baseDiv.ajaxedit({ url: 'foo' }) ).to
                                                    .deep.equal( g.$baseDiv );
        
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

        describe( 'with custom options', function() {

            beforeEach(function() {

                g.$baseDiv = $( '<div></div>' )
                                    .attr( 'data-fetch-uri', '/test.json' )
                                    .html( '<p>Hello!</p>' )
                                    .appendTo( g.$body );

                g.$body.off( 'dblclick' ).off( 'keydown' ).off( 'blur' )
                       .off( 'foo' ).off( 'boo' ).off( 'bar' );

            });

            afterEach(function() {

                g.$baseDiv.remove();

            });


            it( 'should accept other events '
              + 'from the options argument', function() {

                expect( $._data( g.$body[0], 'events' ) ).to.be.undefined;

                g.$baseDiv.ajaxedit({ editOn: 'foo',
                                      saveOn: 'bar',
                                      cancelOn: 'boo' });

                expect( $._data( g.$body[0], 'events' ) ).not.to.be.undefined;
                expect( $._data( g.$body[0], 'events' ) ).to.include.keys(
                                                'foo', 'boo', 'bar' );
                
            });

            it( 'should accept special keydown events '
              + 'from the options argument', function() {

                expect( $._data( g.$body[0], 'events' ) ).to.be.undefined;

                g.$baseDiv.ajaxedit({ editOn: 'keydown:1',
                                      saveOn: 'keydown:2',
                                      cancelOn: 'keydown:3' });

                expect( $._data( g.$body[0], 'events' ) ).not.to.be.undefined;
                expect( $._data( g.$body[0], 'events' ) ).to.include
                                                            .keys( 'keydown' );

            });

            it( 'should accept a different container', function() {

                g.$baseDiv.detach();

                var $c = $( '<div></div>' )
                        .append( g.$baseDiv )
                        .appendTo( g.$body );

                expect( $._data( g.$body[0], 'events' ) ).to.be.undefined;
                expect( $._data( $c[0], 'events' ) ).to.be.undefined;

                g.$baseDiv.ajaxedit({ container: $c });

                expect( $._data( g.$body[0], 'events' ) ).to.be.undefined;
                expect( $._data( $c[0], 'events' ) ).not.to.be.undefined;
                expect( $._data( $c[0], 'events' ) ).to.include
                                        .keys( 'keydown', 'dblclick', 'blur' );

            });

            it( 'should prefetch the data '
              + 'if the `prefetch` option is truthy', function( done ) {

                $.mockjax({
                    url: '/test.json',
                    response: function() {
                        this.responseText = { html:'', text:'' };
                        done();
                    },
                    log: false
                });

                g.$baseDiv.ajaxedit({ prefetch: true });

            });

        });

    });

})(jQuery);
