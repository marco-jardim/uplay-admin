this.PlaylistsController = RouteController.extend({
	template: "Playlists",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("admin_playlists")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		return {
			params: this.params || {},
			admin_playlists: Playlists.find({}, {sort:{created_time:-1},fields:{playlist_id:1,title:1,created_time:1}})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});