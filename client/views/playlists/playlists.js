var pageSession = new ReactiveDict();

Template.Playlists.rendered = function() {
	
};

Template.Playlists.events({
	
});

Template.Playlists.helpers({
	
});

var PlaylistsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PlaylistsViewSearchString");
	var sortBy = pageSession.get("PlaylistsViewSortBy");
	var sortAscending = pageSession.get("PlaylistsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["title", "created_time", "publish_start", "publish_end"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var PlaylistsViewExport = function(cursor, fileType) {
	var data = PlaylistsViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PlaylistsView.rendered = function() {
	pageSession.set("PlaylistsViewStyle", "table");
	
};

Template.PlaylistsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("PlaylistsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("PlaylistsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("PlaylistsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PlaylistsViewExport(this.admin_playlists, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PlaylistsViewExport(this.admin_playlists, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PlaylistsViewExport(this.admin_playlists, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PlaylistsViewExport(this.admin_playlists, "json");
	}

	
});

Template.PlaylistsView.helpers({

	"insertButtonClass": function() {
		return Playlists.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_playlists || this.admin_playlists.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_playlists && this.admin_playlists.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_playlists && pageSession.get("PlaylistsViewSearchString") && PlaylistsViewItems(this.admin_playlists).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PlaylistsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PlaylistsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PlaylistsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PlaylistsViewStyle") == "gallery";
	}

	
});


Template.PlaylistsViewTable.rendered = function() {
	
};

Template.PlaylistsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PlaylistsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PlaylistsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PlaylistsViewSortAscending") || false;
			pageSession.set("PlaylistsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("PlaylistsViewSortAscending", true);
		}
	}
});

Template.PlaylistsViewTable.helpers({
	"tableItems": function() {
		return PlaylistsViewItems(this.admin_playlists);
	}
});


Template.PlaylistsViewTableItems.rendered = function() {
	
};

Template.PlaylistsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Playlists.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Playlists.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("playlist.edit", {playlist_id: this.playlist_id});
		return false;
	}
});

Template.PlaylistsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Playlists.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Playlists.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
