this.Feeds = new Mongo.Collection("feeds");

this.Feeds.userCanInsert = function(userId, doc) {
	return true;
}

this.Feeds.userCanUpdate = function(userId, doc) {
	return true;
}

this.Feeds.userCanRemove = function(userId, doc) {
	return true;
}
