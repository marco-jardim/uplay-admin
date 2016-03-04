var limit = 10, skip = 0;

this.PublicationsController = RouteController.extend({
	template: "Publications",
	

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
        skip = (this.params.page)? this.params.page * limit : 0;

		var subs = [
			Meteor.subscribe("admin_feeds", skip, limit)
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
			admin_feeds: Feeds.find({}, { sort: {created_time:-1}, fields: {item_id:1,title:1,created_time:1,publish_start:1,publish_end:1} })
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});