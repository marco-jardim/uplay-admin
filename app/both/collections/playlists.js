this.Playlists = new Mongo.Collection("playlists");

this.Playlists.userCanInsert = function(userId, doc) {
	return true;
}

this.Playlists.userCanUpdate = function(userId, doc) {
	return true;
}

this.Playlists.userCanRemove = function(userId, doc) {
	return true;
}
