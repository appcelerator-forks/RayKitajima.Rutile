
// variables

var buttonHandler = function(){};

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

// setup ok button

$.ButtonSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.ButtonSymbol.setText(fontawesome.icon('fa-trash-o'));

exports.setButtonHandler = function(handler){
	buttonHandler = handler;
};

function clickButton(e){
	buttonHandler(e);
}

function showButtonFlame(e){
	$.ButtonFlame.visible = true;
}

function hideButtonFlame(e){
	$.ButtonFlame.visible = false;
}

exports.showButton = function(){
	$.ButtonView.visible = true;
};

exports.hideButton = function(){
	$.ButtonView.visible = false;
};

