
var fs = require('fs');
var Mustache = require('mustache');

var template_file_ws   = 'MyAppClient_TMPL/app/lib/CentralDispatch.js';
var template_file_http = 'MyAppClient_TMPL/app/lib/CentralDispatch_http.js';

/* view:

{
	
	APP_NAME    : app name,
	CLIENT_NAME : client application name,
	
	ImplAuthLogic : true to implement authentication logic
	AuthPassword  : implement password authentication
	(AuthOauth)   : TODO: implement oauth2 authentication
	(AuthKey)     : TODO: implement publich key authentication
}

*/
var generate = function(options){
	var APP_NAME      = options['APP_NAME'];
	var CLIENT_NAME   = options['CLIENT_NAME'];
	var template_dir  = options['template_dir'];
	var output_dir    = options['output_dir'];
	var view          = options['view'];
	var tools         = options['tools'];
	
	// apply functions
	tools.apply(view);
	
	// remove trailing slash
	var t_match = template_dir.match(/\/$/);
	if( t_match ){
		template_dir = template_dir.substr(0,t_match.index);
	}
	var o_match = output_dir.match(/\/$/);
	if( o_match ){
		output_dir = output_dir.substr(0,o_match.index);
	}
	
	var template_file;
	if( options['Protocol'].toLowerCase() === 'http' ){
		template_file = template_file_http;
	}else{
		template_file = template_file_ws;
	}
	
	// make path
	var template_path = template_dir + '/' + template_file;
	var output_path = output_dir + '/' + CLIENT_NAME + '/app/lib/CentralDispatch.js';
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME + '/app/lib');
	
	// render and output
	var template = fs.readFileSync(template_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_path,output);
};

module.exports = {
	generate : generate
};


