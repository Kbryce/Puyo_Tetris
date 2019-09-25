//VARIABLES
var game = {
	canvas : document.createElement("canvas"),
	start : function(){
		this.canvas.width = 800;
		this.canvas.height = 800;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		
		c = this.canvas;
		ctx = this.context;
	}
};
var screens = ["^txt,500,400,275,62,#AAAAAA,yellow,Lines: ,1^txt,500,500,275,62,#AAAAAA,black,Level: ,2^txt,500,600,275,62,#AAAAAA,black,Time: ,3^txt,500,300,275,62,#AAAAAA,black,High Score: ,4^sp,385,150,65,65,#930049,black^txt,10,10,160,50,#005900,black,UP NEXT,5^txt,500,100,275,62,#ff80c0,black,Score: ,6^txt,500,200,275,62,#b366ff,black,Mode: Tetris,7^sp,25,150,350,625,#5eff5e,black^sp,20,70,52,52,#000080,black^sp,85,90,52,52,#00aeae,black^sp,150,70,52,52,#ff0000,black^sp,215,90,52,52,#AAAAAA,black^sp,280,70,52,52,#AAAAAA,black",
			   "^txt,25,25,305,460,#AAAAAA,black,Solo Arcade^txt,375,50,400,285,#AAAAAA,black,Multiplayer Arcade^txt,445,375,295,360,#AAAAAA,black,Options & Data^txt,50,530,350,240,#AAAAAA,black,Online"];
screens.modes = ["tetris"];
screens.shapes = [];
var shapes = [];
var textBoxes = [];
var c = game.canvas;
var ctx = game.context;
var counter = 0;
var mousePos = {x: 0, y: 0}
var debug = {
	showGrid : false,
	moving : false,
	curObj : null,
	prevObj : null,
	mdlClickSel : false
};

/*newTextBox(500, 50, 275, 62.5, "Score: ");
newTextBox(500, 150, 275, 62.5, "Mode: Tetris");
newShape(50, 100, 350, 625); //tetris board

for(var i = 0; i <= 200; i += 50){
	newShape(i, i, 62.5, 62.5);
}*/

//I use my debug tools (which I have programmed to suit my needs) to create a level that I want and the have it come out as a compressed piece of data in a string that I can just store each level as instead of manually hard coding all of this info into the function
//createScreen("^txt,10,10,160,50,#AAAAAA,UP NEXT,1^txt,500,50,275,62,#AAAAAA,Score: ,2^txt,500,150,275,62,#AAAAAA,Mode: Tetris,3^sp,25,150,350,625,#AAAAAA^sp,20,70,52,52,#AAAAAA^sp,85,90,52,52,#AAAAAA^sp,150,70,52,52,#AAAAAA^sp,215,90,52,52,#AAAAAA^sp,280,70,52,52,#AAAAAA");
newShape(0, 0, 800, 800, "#3894d1", "#3894d1", false);
//createScreen("^txt,500,400,275,62,#AAAAAA,yellow,Lines: ,1^txt,500,500,275,62,#AAAAAA,black,Level: ,2^txt,500,600,275,62,#AAAAAA,black,Time: ,3^txt,500,300,275,62,#AAAAAA,black,High Score: ,4^sp,385,150,65,65,#930049,black^txt,10,10,160,50,#005900,black,UP NEXT,5^txt,500,100,275,62,#ff80c0,black,Score: ,6^txt,500,200,275,62,#b366ff,black,Mode: Tetris,7^sp,25,150,350,625,#5eff5e,black^sp,20,70,52,52,#000080,black^sp,85,90,52,52,#00aeae,black^sp,150,70,52,52,#ff0000,black^sp,215,90,52,52,#AAAAAA,black^sp,280,70,52,52,#AAAAAA,black");
createScreen("^txt,25,25,305,460,#AAAAAA,black,Solo Arcade^txt,375,50,400,285,#AAAAAA,black,Multiplayer Arcade^txt,445,375,295,360,#AAAAAA,black,Options & Data^txt,50,530,350,240,#AAAAAA,black,Online");
preRender();

//UPDATE FUNCTION
function canvasDraw(cursor){	
	c = game.canvas;
	ctx = game.context;
	ctx.clearRect(0, 0, c.width, c.height); //clear the canvas so we can redraw the scene
	
	counter += 1;
	if(counter > 60){
		counter = 1
		//console.log("yup");
	}
	
	shapes.forEach(function(obj){
		ctx.drawImage(obj.canvas, obj.x, obj.y);
	});
	
	if(debug.showGrid){ 
		gridModeCheck(); 
		return;
	}
	window.requestAnimationFrame(canvasDraw);
}
//All EVENT LISTENERS go below here
//fixes a problem where double clicking causes text to get selected on the canvas
c.addEventListener("selectstart", function(e){ e.preventDefault(); return false; }, false);
c.addEventListener("contextmenu", function(e){ e.preventDefault(); return false; }, false);

//JQuery Below here (including most of the EVENT LISTENERS; needed for detection of certain keys)
$(document).ready(function(){
	$(c).mousedown(function(e){	
		if(debug.showGrid){
			if(e.which == 1){
				var found = false;
				
				shapes.forEach(function(obj, index){
					if(obj.moveable && within(obj, mousePos.x, mousePos.y) && found == false){
						console.log(obj.id)
						if(debug.mdlClickSel){
							debug.prevObj = debug.curObj;
							unselect();
						}
						
						shapes[index].moving = true;
						debug.moving = true;
						debug.curObj = shapes[index];
						found = true;
					}
					
				});
			}else if(e.which == 2){
				var found = false;
				
				shapes.forEach(function(obj, index){
					if(obj.moveable && within(obj, mousePos.x, mousePos.y) && found == false){
						if(!obj.selected){
							if(debug.curObj){
								debug.prevObj = debug.curObj;
								unselect();
							}
							debug.curObj = 	obj;
							debug.mdlClickSel = true;
							shapes[index].fill = "#FFA500";
							shapes[index].draw(obj.context, 0, 0);
							shapes[index].selected = true;
							debug.mdlClickSel = true;
							$("#inputColor").prop("disabled", false);
							$("#inputBorderColor").prop("disabled", false);
						}else if(obj.selected){
							debug.prevObj = debug.curObj;
							debug.curObj = null;
							unselect();
						}
						
						found = true;
					}
				});	
			}else if(e.which == 3){
				debug.prevObj = debug.curObj;
				debug.curObj = null;
				
				if(debug.mdlClickSel){
					unselect();
				}
			}
		}
	});

	$(c).mousemove(function(e){
		getMousePos(e.pageX, e.pageY);
		debugShapeMoving();
	});

	$(c).mouseup(function(){
		debug.moving = false;
		singleDraw();
		gridModeCheck();
		
		if(!debug.mdlClickSel){
			debug.prevObj = debug.curObj;
			debug.curObj = null;
		
			shapes.forEach(function(obj, index){
				shapes[index].moving = false;
			});	
		
			gridModeCheck();
		}
	});

	$(window).keydown(function(e){
		console.log("yup");
		if(debug.mdlClickSel){
			
			var keys = {
				left : 37,
				up : 38,
				right : 39,
				down : 40,
			};
			
			//For moving shapes to specific positions or change them to specific sizes
			shapes.forEach(function(obj, index){
				if(sameObj(obj, debug.curObj)){
					switch(e.keyCode){
						case keys.left:
							if(e.ctrlKey){
								shapes[index].w -= 5;
								shapes[index].canvas.width -= 5;
								shapes[index].draw(obj.context, 0, 0);
							}else{
								shapes[index].x -= 5;
							}
							
							singleDraw();
							gridModeCheck();
							break;
						case keys.right:
							if(e.ctrlKey){
								shapes[index].w += 5;
								shapes[index].canvas.width += 5;
								shapes[index].draw(obj.context, 0, 0);
							}else{
								shapes[index].x += 5;
							}
							
							singleDraw();
							gridModeCheck(); 
							break;
						case keys.up:
							if(e.ctrlKey){
								shapes[index].h -= 5;
								shapes[index].canvas.height -= 5;
								shapes[index].draw(obj.context, 0, 0);
							}else{
								shapes[index].y -= 5;
							}
							
							singleDraw();
							gridModeCheck();
							break;
						case keys.down:
							if(e.ctrlKey){
								shapes[index].h += 5;
								shapes[index].canvas.height += 5;
								shapes[index].draw(obj.context, 0, 0);
							}else{
								shapes[index].y += 5;
							}
							
							singleDraw();
							gridModeCheck();
							break;
						default: 
							break;
					}
				}
			});
			
		}
	});
	
	//this way the objs colors will only be changed if the input value has been changed first
	$("#inputColor").change(function(){
		shapes.forEach(function(obj, index){
			if(sameObj(obj, debug.curObj)){
				shapes[index].fill = $("#inputColor").val();
				shapes[index].objFill = $("#inputColor").val();
				shapes[index].draw(obj.context, 0, 0);
				singleDraw();
			}
		});
	});
	
	$("#inputBorderColor").change(function(){
		shapes.forEach(function(obj, index){
			if(sameObj(obj, debug.curObj)){
				//console.log("wtf");
				shapes[index].bColor = $("#inputBorderColor").val();
				shapes[index].draw(obj.context, 0, 0);
				singleDraw();
			}
		});
	});
});
