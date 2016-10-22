/**
 * @fileoverview

A Gemini plugin to populate a dropdown based on the results of another dropdown.

### Notes
- You bind this plugin to the dropdown that is changing based on the results of
another
- You can send all of the options as either a javascript option, or a ``data``
attribute
- The JSON response needs to be mapped to a list of objects with ``value`` and
``display`` keys to populate the dropdown. You can use the map function to
map the data to this object.

#### Expected data
```
[
  {
    "value": "caravan",
    "display": "Caravan"
  },
  {
    "value": "viper",
    "display": "Viper"
  }
]
```

 *
 * @namespace gemini.popdrop
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires gemini
 *
 * @prop {string} url {@link gemini.popdrop#url}
 * @prop {string} bind {@link gemini.popdrop#bind}
 * @prop {function} map {@link gemini.popdrop#map}
 * @prop {string} toQuery {@link gemini.popdrop#toQuery}
 * @prop {boolean} reset {@link gemini.popdrop#reset}
 * @prop {function} onPopulate {@link gemini.popdrop#onPopulate}
 *
 * @example
  <html>
    <select id="js-select-make" name="make">
      <option selected>Select Make</option>
      <option value="acura">Acura</option>
      <option value="dodge">Dodge</option>
      <option value="ford">Ford</option>
    </select>

    <select id="js-select-model" name="model">
      <option selected>Select Model</option>
    </select>
  </html>
 *
 * @example
  G('#js-select-model').popdrop({
    url: '/example/api/models.json',
    bind: '#js-select-make'
  });
 */

( function( factory ) {
  if ( typeof define === 'function' && define.amd ) {
    // AMD. Register as an anonymous module.
    define([ 'gemini' ], factory );
  } else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    module.exports = factory(
      require( 'gemini-loader' )
    );
  } else {
    // Browser globals
    factory( G );
  }
}( function( $ ) {
  var _ = $._;

  $.boiler( 'popdrop', {
    defaults: {
      /**
       * The URL to make ajax requests to
       * hint: you can test this on your local site,
       * e.g. https://repo-name.carpag.es/_lookup/models/?make_name=chevrolet&
       *
       * @name gemini.popdrop#url
       * @type string
       * @default false
       */
      url: false,

      /**
       * The selector that the plugin will listen to for changes
       *
       * @name gemini.popdrop#bind
       * @type string
       * @default false
       */
      bind: false,

      /**
       * A function that accepts the JSON response and returns a list of options
       * to populate the dropdown with. See expected data to know what the
       * map should return.
       *
       * @name gemini.popdrop#map
       * @type function
       * @default false
       */
      map: false,

      /**
       * A selector of form elements to query with the JSON request
       *
       * @name gemini.popdrop#toQuery
       * @type string
       * @default settings.bind
       */
      toQuery: false,

      /**
       * Resets the select dropdown to just the first option when there are no
       * results onChange.
       *
       * @name gemini.popdrop#reset
       * @type boolean
       * @default false
       */
      reset: false,

      /**
       * Add a callback event for when the dropdown is populated with new data.
       * The data is sent back as a parameter.
       *
       * @name gemini.popdrop#onPopulate
       * @type function
       * @default false
       */
      onPopulate: false
    },

    data: [ 'url', 'bind', 'reset' ],

    init: function() {
      var plugin = this;

      plugin.$originalSelection = plugin.$el.find( 'option:first' );

      // Set original HTML
      if ( plugin.settings.reset ) {
        plugin.$originalHtml = plugin.$originalSelection;
      } else {
        plugin.$originalHtml = $( plugin.$el.html());
        // Reset selected of original html
        plugin.$originalHtml.find( 'option:selected' ).removeAttr( 'selected' );
        plugin.$originalHtml.find( 'option:first' ).attr( 'selected', 'selected' );
      }

      // Cache elements to query the JSON request with
      plugin.$toQuery = plugin.settings.toQuery
        ? $( plugin.settings.toQuery )
        : false;

      // Setup dependants
      if ( plugin.settings.bind ) {
        plugin.$dependants = $( plugin.settings.bind );

        plugin.$dependants.change( function( e ) {
          e.preventDefault();
          plugin._onDependantChange();
        });
      }
    },

    /**
     * The function to run when the bound select dropdown changes
     *
     * @private
     * @method
     * @name gemini.popdrop#_onDependantChange
    **/
    _onDependantChange: function() {
      var plugin = this;

      var $toQuery = plugin.$toQuery || plugin.$dependants;
      var toQuery = {};

      $toQuery.each( function() {
        var $el = $( this );
        toQuery[$el.attr( 'name' )] = $el.val();
      });

      plugin.idle();

      $.getJSON( plugin.settings.url, toQuery, function( data ) {
        if ( plugin.settings.map ) {
          data = plugin.settings.map( data );
        }
        plugin.populate( data );
      });
    },

    /**
     * Put the dropdown in idle mode
     *
     * @method
     * @name gemini.popdrop#idle
    **/
    idle: function() {
      var plugin = this;

      plugin.$el
        .empty()
        .append( $( '<option />' ).val( 0 ).text( 'Loading...' ));
    },

    /**
     * Populates the dropdown using the given data
     *
     * @method
     * @name gemini.popdrop#populate
     * @param {array} data The data to populate the dropdown
    **/
    populate: function( data ) {
      var plugin = this;

      // reset target
      plugin.$el
        .empty()
        .append( plugin.$originalSelection );

      // populate target
      if ( _.isArray( data ) && data.length > 0 ) {
        $.each( data, function() {
          plugin.$el.append( $( '<option />' ).val( this.value ).text( this.display ));
        });
      } else {
        plugin.$el.html( plugin.$originalHtml );
      }
      plugin.$el.trigger( 'change' );

      if ( plugin.settings.onPopulate ) plugin.settings.onPopulate.call( plugin, data );
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;
}));
