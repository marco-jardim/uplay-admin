var pageSession = new ReactiveDict();

Template.PlaylistEdit.rendered = function() {
	
};

Template.PlaylistEdit.events({
	
});

Template.PlaylistEdit.helpers({
	
});

Template.PlaylistEditEditForm.rendered = function() {
	

	pageSession.set("playlistEditEditFormInfoMessage", "");
	pageSession.set("playlistEditEditFormErrorMessage", "");

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

Template.PlaylistEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("playlistEditEditFormInfoMessage", "");
		pageSession.set("playlistEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var playlistEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(playlistEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("playlistEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("playlists", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("playlistEditEditFormErrorMessage", message);
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
                
                if(values.videos_id instanceof Array) values.videos_id = values.videos_id[0].replace(' , ', ',').replace(' ,', ',').replace(', ', ',').split(',');
				else values.videos_id = values.videos_id.replace(' , ', ',').replace(' ,', ',').replace(', ', ',').split(',');
                for(i=0; i<values.videos_id.length; i++) values.videos_id[i] = values.videos_id[i].trim();

				Playlists.update({ _id: t.data.admin_playlist._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("playlists", {});
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

Template.PlaylistEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("playlistEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("playlistEditEditFormErrorMessage");
	}
	
});
