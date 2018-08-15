requirejs.config({
  baseUrl: '../',
  paths: {
    underscore: 'bower_components/underscore/underscore',
    jquery: 'bower_components/jquery/dist/jquery',
    handlebars: 'bower_components/handlebars/handlebars.runtime',
    'jquery.boiler': 'bower_components/jquery-boiler/jquery.boiler',
    'gemini.support': 'bower_components/gemini-support/gemini.support',
    gemini: 'bower_components/gemini-loader/gemini',
    'jquery.mockjax': 'bower_components/jquery-mockjax/src/jquery.mockjax'
  }
});

require([ 'gemini', 'gemini.popdrop', 'jquery.mockjax' ], function( G ) {
  var urlFormat = 'https://local.carpag.es:3000/example/api/:make/models';

  G.mockjax({
    url: /^\/example\/api\/([a-zA-Z0-9]+)\/models$/,
    urlParams: [ 'makeId' ],
    response: function( settings ) {
      console.log({ settings });

      this.responseText = [
        {
          value: 'Test',
          display: 'Test'
        }
      ];
    }
  });

  var $modelField = G( '#js-select-model' );
  $modelField.popdrop({
    url: {
      format: urlFormat
    },
    bind: '#js-select-make',
    onPopulate: function() {
      G( '#query-url' ).text( $modelField.data( 'popdrop' ).url );
    }
  });
});
