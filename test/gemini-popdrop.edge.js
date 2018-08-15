requirejs.config({
  baseUrl: '../',
  paths: {
    underscore: 'bower_components/underscore/underscore',
    jquery: 'bower_components/jquery/dist/jquery',
    handlebars: 'bower_components/handlebars/handlebars.runtime',
    'jquery.boiler': 'bower_components/jquery-boiler/jquery.boiler',
    'gemini.support': 'bower_components/gemini-support/gemini.support',
    gemini: 'bower_components/gemini-loader/gemini'
  }
});

require([ 'gemini', 'gemini.popdrop' ], function( G ) {
  var $modelField = G( '#js-select-model' );
  $modelField.popdrop({
    url: '/example/api/models.json',
    bind: '#js-select-make'
  });

  G( '#query-url' ).text( $modelField.data( 'popdrop' )._getUrl());
});
