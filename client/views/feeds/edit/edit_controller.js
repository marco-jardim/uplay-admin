this.FeedsEditController = RouteController.extend({
	template: "FeedsEdit",
	

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
			Meteor.subscribe("admin_feed", this.params.item_id)
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
			admin_feed: Feeds.findOne({item_id:this.params.item_id}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});