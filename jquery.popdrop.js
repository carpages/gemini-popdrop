/**
 * @fileoverview

A jQuery plugin to populate a dropdown based on the results of another dropdown.

### Notes
- You bind this plugin to the dropdown that is changing based on the results of
another
- You can send all of the options as either a javascript option, or a ``data``
attribute
- Require the JSON response to be a list of objects

#### JSON Respons
```
[
  {
    "id": "caravan",
    "name": "Caravan"
  },
  {
    "id": "viper",
    "name": "Viper"
  }
]
```

 *
 * @namespace jquery.popdrop
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires jquery
 * @requires jquery.boiler
 * @requires underscore
 *
 * @prop {string} url {@link jquery.popdrop#url}
 * @prop {string} bind {@link jquery.popdrop#bind}
 * @prop {boolean} reset {@link jquery.popdrop#reset}
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
  $('#js-select-model').popdrop({
    url: '/example/api/models.json',
    bind: '#js-select-make'
  });
 */

define(['jquery-loader', 'underscore', 'jquery.boiler'], function($, _){

  $.boiler('popdrop', {
    defaults: {
      /**
       * The URL to make ajax requests to
       *
       * @name jquery.popdrop#url
       * @type string
       * @default false
       */
      url: false,
      /**
       * The selector that the plugin will listen to for changes
       *
       * @name jquery.popdrop#bind
       * @type string
       * @default false
       */
      bind: false,
      /**
       * Resets the select dropdown to just the first option when there are no
       * results onChange.
       *
       * @name jquery.popdrop#reset
       * @type boolean
       * @default false
       */
      reset: false
    },

    data: ['url', 'bind', 'reset'],

    init: function(){
      var plugin = this;

      plugin.$originalSelection = plugin.$el.find('option:first');

      //Set original HTML
      if (plugin.settings.reset){
        plugin.$originalHtml = plugin.$originalSelection;
      }else{
        plugin.$originalHtml = $(plugin.$el.html());
        //Reset selected of original html
        plugin.$originalHtml.find('option:selected').removeAttr('selected');
        plugin.$originalHtml.find('option:first').attr('selected', 'selected');
      }


      //Setup dependants
      if (plugin.settings.bind) {
        plugin.$dependants = $(plugin.settings.bind);

        plugin.$dependants.change(function(e){
          e.preventDefault();
          plugin._onDependantChange.call(plugin);
        });
      }
    },

    /**
     * The function to run when the bound select dropdown changes
     *
     * @private
     * @method
     * @name jquery.popdrop#_onDependantChange
    **/
    _onDependantChange: function(){
      var plugin = this;

      var toSend = {}; toSend[plugin.$el.attr('name')] = plugin.$el.val();

      plugin.$dependants.each(function(){
        var $el = $(this);
        toSend[$el.attr('name')] = $el.val();
      });

      plugin.$el
        .empty()
        .append($("<option />").val(0).text('Loading...'));
      plugin.$el.trigger('change');

      $.getJSON(plugin.settings.url, toSend, function(data){
        // reset target
        plugin.$el
          .empty()
          .append(plugin.$originalSelection);

        //populate target
        if (_.isArray(data) && data.length > 0){
          $.each(data, function() {
            plugin.$el.append($("<option />").val(this.id).text(this.name));
          });
        }else{
          plugin.$el.html(plugin.$originalHtml);
        }
        plugin.$el.trigger('change');
      });
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;

});
