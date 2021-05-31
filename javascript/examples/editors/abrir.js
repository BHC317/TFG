	// Reads files locally
	function handleFiles(files)
	{
		for (var i = 0; i < files.length; i++)
		{
			(function(file)
			{
				// Small hack to support import
				if (window.parent.openNew)
				{
					window.parent.open(window.parent.location.href);
				}
				
				var reader = new FileReader();
				reader.onload = function(e)
				{
					window.parent.openFile.setData(e.target.result, file.name);
				};
				reader.onerror = function(e)
				{
					console.log(e);
				};
				reader.readAsText(file);
			})(files[i]);
		}
	};

	// Handles form-submit by preparing to process response
	function handleSubmit()
	{
		var form = window.openForm || document.getElementById('openForm');
		
		// Checks for support of the File API for local file access
		// except for files where the parse is on the server
		if (window.parent.Graph.fileSupport && form.upfile.files.length > 0)
		{
			handleFiles(form.upfile.files);
			
			return false;
		}
		else
		{
			if (/(\.xml)$/i.test(form.upfile.value) || /(\.txt)$/i.test(form.upfile.value) ||
				/(\.mxe)$/i.test(form.upfile.value))
			{
				// Small hack to support import
				if (window.parent.openNew)
				{
					window.parent.open(window.parent.location.href);
				}
				
				// NOTE: File is loaded via JS injection into the iframe, which in turn sets the
				// file contents in the parent window. The new window asks its opener if any file
				// contents are available or waits for the contents to become available.
				return true;
			}
			else
			{
				window.parent.mxUtils.alert(window.parent.mxResources.get('invalidOrMissingFile'));
				
				return false;
			}
		}
	};