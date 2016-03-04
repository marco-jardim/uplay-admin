Meteor.publish("admin_feeds", function() {
	return Feeds.find({}, {sort:{created_time:-1},fields:{item_id:1,title:1,created_time:1,publish_start:1,publish_end:1}});
});

Meteor.publish("admin_feed", function(item_id) {
	return Feeds.find({item_id:item_id}, {});
});

