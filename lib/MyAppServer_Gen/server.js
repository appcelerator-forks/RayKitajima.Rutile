
var fs = require('fs');
var Mustache = require('mustache');

var template_file_ws   = 'MyAppServer_TMPL/server.js';
var template_file_http = 'MyAppServer_TMPL/server_http.js';

/* view:

{
	APP_NAME : APP_NAME,
	
	// array of segment
	Segments : [ { segment:SEGMENT }, ],
	
	Lc_first : function(){},
}

*/
var generate = function(options){
	var APP_NAME      = options['APP_NAME'];
	var SERVER_NAME   = options['SERVER_NAME'];
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
	if( options['view'].Protocol.toLowerCase() === 'http' ){
		template_file = template_file_http;
	}else{
		template_file = template_file_ws;
	}
	
	// make path
	var template_path = template_dir + '/' + template_file;
	var output_path   = output_dir + '/' + SERVER_NAME + '/server.js';
	
	// prepare directoreis
	var dir = output_dir + '/' + SERVER_NAME + '/';
	if( !fs.existsSync(dir) ){ fs.mkdirSync(dir); }
	
	// render and output
	var template = fs.readFileSync(template_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_path,output);
};

module.exports = {
	generate : generate
};


