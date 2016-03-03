Playlists.allow({
	insert: function (userId, doc) {
		return Playlists.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Playlists.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Playlists.userCanRemove(userId, doc);
	}
});

Playlists.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Playlists.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Playlists.before.remove(function(userId, doc) {
	
});

Playlists.after.insert(function(userId, doc) {
	
});

Playlists.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Playlists.after.remove(function(userId, doc) {
	
});
