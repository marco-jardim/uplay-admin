var pageSession = new ReactiveDict();

Template.Publications.rendered = function() {
	
};

Template.Publications.events({
	
});

Template.Publications.helpers({
	
});

var PublicationsViewItems2 = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PublicationsViewSearchString");
	var sortBy = pageSession.get("PublicationsViewSortBy");
	var sortAscending = pageSession.get("PublicationsViewSortAscending");
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

var PublicationsViewItems = function(cursor) {
    var searchString = pageSession.get("PublicationsViewSearchString");
    if(searchString && searchString!=="") {
        searchString = searchString.replace(".", "\\.");
        Router.go("publications_page_query", {page: 0, queryString: searchString});
        return cursor.fetch();
    } else return PublicationsViewItems2(cursor);
};

var PublicationsViewExport = function(cursor, fileType) {
	var data = PublicationsViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PublicationsView.rendered = function() {
	pageSession.set("PublicationsViewStyle", "table");
	
};

Template.PublicationsView.events({
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
				pageSession.set("PublicationsViewSearchString", searchString);
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
					pageSession.set("PublicationsViewSearchString", searchString);
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
					pageSession.set("PublicationsViewSearchString", "");
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
		PublicationsViewExport(this.admin_feeds, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PublicationsViewExport(this.admin_feeds, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PublicationsViewExport(this.admin_feeds, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PublicationsViewExport(this.admin_feeds, "json");
	},
    
    "click #ctrlBack": function(e, t) {
        if(this.params.page > 0 && !this.params.queryString) {
            Router.go("publications_page", {page: --this.params.page});
        } else if(this.params.page > 0 && !this.params.queryString) {
            Router.go("publications_page_query", {page: --this.params.page, queryString: this.params.queryString});
        }
    },
    
    "click #ctrlFwd": function(e, t) {
        if(!this.params.page) this.params.page = 0;
        if(!this.params.queryString) Router.go("publications_page", {page: ++this.params.page});
        else Router.go("publications_page_query", {page: ++this.params.page, queryString: this.params.queryString});
    }
	
});

Template.PublicationsView.helpers({

	"insertButtonClass": function() {
		return Feeds.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.admin_feeds || this.admin_feeds.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_feeds && this.admin_feeds.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_feeds && pageSession.get("PublicationsViewSearchString") && PublicationsViewItems(this.admin_feeds).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PublicationsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PublicationsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PublicationsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PublicationsViewStyle") == "gallery";
	}

	
});


Template.PublicationsViewTable.rendered = function() {
	
};

Template.PublicationsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PublicationsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PublicationsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PublicationsViewSortAscending") || false;
			pageSession.set("PublicationsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("PublicationsViewSortAscending", true);
		}
	}
});

Template.PublicationsViewTable.helpers({
	"tableItems": function() {
		return PublicationsViewItems(this.admin_feeds);
	}
});


Template.PublicationsViewTableItems.rendered = function() {
	
};

Template.PublicationsViewTableItems.events({
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

		Feeds.update({ _id: this._id }, { $set: values });

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
						Feeds.remove({ _id: me._id });
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
		Router.go("feeds.edit", {item_id: this.item_id});
		return false;
	}
});

Template.PublicationsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Feeds.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Feeds.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
