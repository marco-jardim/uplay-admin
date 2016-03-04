Meteor.publish("admin_playlists", function() {
	return Playlists.find({}, {sort:{created_time:-1},fields:{playlist_id:1,title:1,created_time:1}});
});

Meteor.publish("admin_playlist", function(playlist_id) {
	return Playlists.find({playlist_id:playlist_id}, {});
});

