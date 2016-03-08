var pageSession = new ReactiveDict();

Template.FeedsInsert.rendered = function() {
	
};

Template.FeedsInsert.events({
	
});

Template.FeedsInsert.helpers({
	
});

Template.FeedsInsertInsertForm.rendered = function() {
	

	pageSession.set("feedsInsertInsertFormInfoMessage", "");
	pageSession.set("feedsInsertInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.FeedsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("feedsInsertInsertFormInfoMessage", "");
		pageSession.set("feedsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var feedsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(feedsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("feedsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("publications", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("feedsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
                var i;
                if(values.keywords instanceof Array) values.keywords = values.keywords[0].replace(' , ', ',').replace(' ,', ',').replace(', ', ',').split(',');
				else values.keywords = values.keywords.replace(' , ', ',').replace(' ,', ',').replace(', ', ',').split(',');
                for(i=0; i<values.keywords.length; i++) values.keywords[i] = values.keywords[i].trim();
                
                if(values.playlists_id instanceof Array) values.playlists_id = values.playlists_id[0].replace(' , ', ',').replace(' ,', ',').replace(', ', ',').split(',');
				else values.playlists_id = values.playlists_id.replace(' , ', ',').replace(' ,', ',').replace(', ', ',').split(',');
                for(i=0; i<values.playlists_id.length; i++) values.playlists_id[i] = values.playlists_id[i].trim();
                
                if(values.tags instanceof Array) values.tags = values.tags[0].replace(' , ', ',').replace(' ,', ',').replace(', ', ',').split(',');
				else values.tags = values.tags.replace(' , ', ',').replace(' ,', ',').replace(', ', ',').split(',');
                for(i=0; i<values.tags.length; i++) values.tags[i] = values.tags[i].trim();

				newId = Feeds.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("publications", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.FeedsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("feedsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("feedsInsertInsertFormErrorMessage");
	}
	
});
