
	var splitUri = function(uri) {
		var splitted = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
		console.log("Splitted: "+splitted);
        return splitted;
    };

    function is_iri(value) {
        if (!value) {
            return;
        }

        // check for illegal characters
        if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)) return;

        // check for hex escapes that aren't complete
        if (/%[^0-9a-f]/i.test(value)) return;
        if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return;

        var splitted = [];
        var scheme = '';
        var authority = '';
        var path = '';
        var query = '';
        var fragment = '';
        var out = '';

        // from RFC 3986
        splitted = splitUri(value);
        scheme = splitted[1]; 
        authority = splitted[2];
        path = splitted[3];
        query = splitted[4];
        fragment = splitted[5];

        // scheme and path are required, though the path can be empty
        if (!(scheme && scheme.length && path.length >= 0)) return;

        // if authority is present, the path must be empty or begin with a /
        if (authority && authority.length) {
            if (!(path.length === 0 || /^\//.test(path))) return;
        } else {
            // if authority is not present, the path must not start with //
            if (/^\/\//.test(path)) return;
        }

        // scheme must begin with a letter, then consist of letters, digits, +, ., or -
        if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase()))  return;

        // re-assemble the URL per section 5.3 in RFC 3986
        out += scheme + ':';
        if (authority && authority.length) {
            out += '//' + authority;
        }

        out += path;

        if (query && query.length) {
            out += '?' + query;
        }

        if (fragment && fragment.length) {
            out += '#' + fragment;
        }

        return out;
    }

//jquery call
$('.btn-shorten').on('click',function() {
	console.log("Url: "+ $('#url-field').val());
	var allowed = is_iri($('#url-field').val());
	if(allowed)
	{
		$.ajax({
		// url= /api/shorten ?? why?
			url: '/api/shorten',
			type: 'POST',
			dataType: 'JSON',
			data: {url: $('#url-field').val()},
			success: function(data) {
				var resultHTML = '<a class = "result" href = " ' + data.shortUrl + ' ">' + data.shortUrl + '</a>';
			$('#link').html(resultHTML);
			$('#link').hide().fadeIn('slow'); 
			}
	    	});
	}
	else
	{
		alert("Enter a valid url.");
	}
});

//shorten.js client ki taraf .
//it's not server side technology,to node ka part idhar nai chalega
