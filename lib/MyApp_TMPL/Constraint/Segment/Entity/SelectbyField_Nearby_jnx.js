
// postgis geography field

// Selectby{{#Uc_first}}{{field}}{{/Uc_first}}Nearby
// 
// segment : {{segment}}
// entity  : {{entity}}
// field   : {{field}}
// type    : {{search_type}}
// 
// junction                    : {{junction}}
// 
// joined segment              : {{segment_jnx}} (not yet supported)
// joined entity               : {{entity_jnx}}
// joined entity's primary_key : {{primary_key_jnx}}
// search field                : {{field_jnx}}
// search type                 : {{search_type_jnx}}
// 

// usage:
//     
//     var Selectby = require('Constraint/SEGMENT/ENTITY/SelectbyField');
//     var selector = new Selectby({ values:[{centroid:'POINT(LON LAT)',distance:NUM}], logic:"or" });
//     

var LOGIC_OR  = 'or';
var LOGIC_AND = 'and'

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function Constructor(query){
	this.values = [];
	this.logic  = LOGIC_OR;
	this.valid  = false;
	this.limit  = 0;
	
	if( query.limit ){
		this.limit = parseInt(query.limit);
	}
	
	if( query.logic ){
		this.logic = query.logic.toLowerCase();
		if( this.logic != LOGIC_OR || this.logic != LOGIC_AND ){
			this.logic = LOGIC_OR;
		}
	}
	
	for( var i=0; i<query.values.length; i++ ){
		if( query.values[i] ){
			var value    = query.values[i];
			var centroid = value.centroid;
			var distance = value.distance;
			
			if( centroid ){
				if( !centroid.match(/POINT\(\d+\.*\d* \d+\.*\d*\)/) ){
					centroid  = null;
				}
			}
			if( distance ){
				var num = new Number(distance);
				distance = num.valueOf();
			}else{
				distance = null;
			}
			
			if( !centroid && !distance ){ continue; }
			
			this.values.push({ 'centroid':centroid,'distance':distance });
		}
	}
	
	if( this.values.length > 0 ){
		this.valid = true;
	}
}

module.exports = Constructor;

var Selectby = Constructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public apis

Selectby.responsible = function(){
	return this.valid;
};

Selectby.makeConstraint = function(){
	var sql     = '';
	var params  = [];
	var clauses = [];
	var clause  = '';
	
	for( var i=0; i<this.values.length; i++ ){
		var centroid = this.values[i].centroid;
		var distance = this.values[i].distance;
		
		var constraint = "ST_DWithIn({{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{field_jnx}},ST_GeogFromText(?), ?)";
		clauses.push(constraint);
		params.push(centroid);
		params.push(distance);
	}
	var connector = ' or ';
	if( this.logic == LOGIC_AND ){
		connector = ' and ';
	}
	clause = clauses.join(connector);
	
	var limiter = '';
	if( this.limit > 0 ){ limiter = " limit " + this.limit; }
	
	sql = " ( select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}},{{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}},{{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}} where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} = {{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} and {{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_jnx}} = {{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_jnx}} and " + clause + limiter + " ) ";
	
	return {
		"sql"             : sql,
		"params"          : params,
		"parameterizable" : true
	};
};

Selectby.stringify = function(){
	var strs = [];
	for( var i=0; i<this.values.length; i++ ){
		var item = [];
		var min = this.values[i].min;
		var max = this.values[i].min;
		if( min ){ item.push("min:"+min); }
		if( max ){ item.push("max:"+max); }
		var str = item.join(",");
		strs.push(str);
	}
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}}(nearby):" + strs.join("/");
	return str;
};

