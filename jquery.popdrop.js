define(['jquery.boiler', 'underscore'], function($, _){

	$.boiler('popdrop', {
		defaults: {
			url: false,
			bind: false,
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
					plugin.onDependantChange.call(plugin);
				});
			}
		},

		onDependantChange: function(el){
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