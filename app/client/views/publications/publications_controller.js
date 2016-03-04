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
		var subs = [
			Meteor.subscribe("admin_feeds")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
        var findQuery = {};
        var qString = this.params.queryString;
        if(qString) {
            //findQuery.title = { $regex: ".*"+qString+".*/i" };
            findQuery["$or"] = [
                { title: { $regex: ".*"+qString+".*", $options: "i" } },
                { source: { $regex: ".*"+qString+".*/i" } },
                { description: { $regex: ".*"+qString+".*", $options: "i" } },
                { created_time: { $regex: ".*"+qString+".*", $options: "i" } },
                { item_id: { $regex: ".*"+qString+".*", $options: "i" } },
                { priority: { $regex: ".*"+qString+".*", $options: "i" } }
            ];
        }
        skip = (this.params.page)? this.params.page * limit : 0;
		return {
			params: this.params || {},
			admin_feeds: Feeds.find(findQuery, {sort:{created_time:-1},fields:{item_id:1,title:1,source:1,description:1,created_time:1,priority:1,is_active:1}, skip: skip, limit: limit})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});