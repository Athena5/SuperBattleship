var a2Player = function(game, input, output, map, is_player_one) {
    
    if (is_player_one) {
		var key = game.registerPlayerOne();
    }
    else {
		key = game.registerPlayerTwo();
    }


    output = $(output);
    input = $(input);
    map = $(map);
    
    var eventLogHandler = function(e) {
		var message = "";
		switch (e.event_type) {
			case SBConstants.TURN_CHANGE_EVENT:
		    	if (e.who == SBConstants.PLAYER_ONE) {
					message = "Player one's turn<br>(count = " + game.getTurnCount() + ")";
		    	}
		    	else {
					message = "Player two's turn<br>(count = " + game.getTurnCount() + ")";
	    		}
	    		break;
			case SBConstants.MISS_EVENT:
	    		message = "Miss event at (" + e.x + ", " + e.y + ")";
	    		break;
			case SBConstants.HIT_EVENT:
	    		message = "Hit event at (" + e.x + ", " + e.y + ")";
	    		break;
			case SBConstants.SHIP_SUNK_EVENT:
		    	var ship = e.ship;
	    		if (ship.isMine(key)) {
					var pos = ship.getPosition(key);
					message = "Foe sunk your " + ship.getName() + " at<br>(" + pos.x + ", " + pos.y + ")";
			    }
			    else {
					var pos = ship.getPosition(null); // This works because ship is dead.
					message = "You sunk their " + ship.getName() + " at<br>(" + pos.x + ", " + pos.y + ")";
	   			}
	    		break;
			case SBConstants.GAME_OVER_EVENT:
	    		if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
					message = "Game over. You win!";
	    		}
	    		else if (is_player_one && e.winner == SBConstants.DRAW) {
					message = "Game over. You tied!";
		    	}
		    	else {
					message = "Game over. You lose!";
		    	}
	    		break;
		}
		output.html(message);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT, eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT, eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT, eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT, eventLogHandler);
    game.registerEventHandler(SBConstants.GAME_OVER_EVENT, eventLogHandler);


    var mapDrawHandler = function(e) {
		map.empty();
  		var gameBoard = $("<tbody></tbody>");
	
		for (var y = 0; y < game.getBoardSize(); y++) {
    		var boardRow = $("<tr></tr>");

	    	for (var x = 0; x < game.getBoardSize(); x++) {
				var boardSquare = $("<td></td>");
		    	boardSquare.data("row", y);
    			boardSquare.data("column", x);
    			boardSquare.addClass("gridSquare");

				var sqr = game.queryLocation(key, x, y);
    			var squareColor = "blue"
				
				switch (sqr.type) {
					case "miss":
	 					squareColor = "white";
		    			break;
					case "p1":
		    			if (sqr.state == SBConstants.OK) {
							squareColor = "gray";
		    			}
		    			else {
							squareColor = "maroon";
					    }
		    			break;
					case "p2":
		    			if (sqr.state == SBConstants.OK) {
							squareColor = "black";
					    }
					    else {
							squareColor = "maroon";
					    }
		    			break;
					case "empty":
						squareColor = "aqua";
					    break;
					case "invisible":
						squareColor = "blue";
					    break;
				}
		
				boardSquare.css("background-color", squareColor);
				boardSquare.click(function( ) {
    				var column = parseInt($(this).data("column"));
    				var row = parseInt($(this).data("row"));

    				if (column != NaN && row != NaN) {
						game.shootAt(key, column, row);
					}
				});
				boardRow.append(boardSquare);
	    	}

	    	gameBoard.append(boardRow);
		}

		map.append(gameBoard);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT, mapDrawHandler);


    var buttonNames = ["viewShipInfo", "moveForward", "moveBackward", "rotateCW", "rotateCCW"];
	for (var i = 0; i < buttonNames.length; i++) {
   		var aButton =$("#" + buttonNames[i])
    	aButton.click(function() {
    		var selectedShip = input.find("input[name=\"shipType\"]:checked");
			if (selectedShip.length > 0) {
    			var ship_name = selectedShip.val();
				var ship = game.getShipByName(key, ship_name);
	
				if (ship != null) {
    				var buttonName = $(this).attr("id");
    				var shipInfo = $("#shipInfo");

					switch(buttonName) {
    					case "viewShipInfo":
			    			var ship_str = "<b>" + ship_name + "</b>";
			    			var ship_pos = ship.getPosition(key);

				    		ship_str += "<br>Position: " + ship_pos.x + ", " + ship_pos.y;
					    	ship_str += "<br>Direction: " + ship_pos.direction;
				    		ship_str += "<br>Size: " + ship.getSize();
   		
			   				if (ship.getStatus() == SBConstants.ALIVE) {
								ship_str += "<br>Status: ALIVE";
				    		}
					    	else {
								ship_str += "<br>Status: DEAD";
						    }
						    
						    shipInfo.html(ship_str);
    						break;
    					case "moveForward":
			    			game.moveShipForward(key, ship);
			    			shipInfo.empty();
							break;
    					case "moveBackward":
    						game.moveShipBackward(key, ship);
    						shipInfo.empty();
		    				break;
    					case "rotateCW":
    						game.rotateShipCW(key, ship);
    						shipInfo.empty();
		    				break;
    					case "rotateCCW":
	    					game.rotateShipCCW(key, ship);
	    					shipInfo.empty();
		    				break;
    				}
				}
			}
    	});
    }
};
