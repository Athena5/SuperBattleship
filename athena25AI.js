var athena25AI = function(game, is_player_one, delay) {
    if (is_player_one) {
	var key = game.registerPlayerOne();
    } else {
	key = game.registerPlayerTwo();
    }

    var turn_delay = 0;
    if (delay != undefined) {
	turn_delay = delay;
    }
    
    var eventHandler = function(e) {
	switch (e.event_type) {
		case SBConstants.TURN_CHANGE_EVENT:
		    if (((e.who == SBConstants.PLAYER_ONE) && is_player_one) || ((e.who == SBConstants.PLAYER_TWO) && (!is_player_one))) {
		    	var miss = [];
		    	var opponent = [];
		   		var empty = [];
		    	var invisible = [];

		    	for (var i = 0; i < game.getBoardSize(); i++) {
	    			for (var j = 0; j < game.getBoardSize(); j++) {
	    				var sqr = game.queryLocation(key, i, j);
	    				switch (sqr.type) {
							case "miss":
	 							miss.push({"x": i, "y": j});
					   			break;
							case "p1":
		    					if (!is_player_one) {
									opponent.push({"x": i, "y": j});
		   						}
		   						break;
							case "p2":
					   			if (is_player_one) {
									opponent.push({"x": i, "y": j});
		    					}
				    			break;
							case "empty":
								empty.push({"x": i, "y": j});;
							    break;
							case "invisible":
								invisible.push({"x": i, "y": j});
							    break;
						}
	   				}
	    		}

	   			var column = Math.floor(game.getBoardSize()/2);
	    		var row = Math.floor(game.getBoardSize()/2);
	    		if (opponent.length > 0) {
	    			var point = opponent[0];
	    			column = point.x;
	    			row = point.y;
	    		}
	   			else {
	    			if (miss.length == 1) {
	    				var point = miss[0];
	    				if (point.x > game.getBoardSize()/2) {
	    					column = Math.floor(game.getBoardSize()/2);
	   					}
	    				else {
	    					column = Math.floor((game.getBoardSize() + point.x)/2);
	    				}

	    				if (point.y > game.getBoardSize()/2) {
	    					row = Math.floor(game.getBoardSize()/2);
	    				}
	    				else {
	   						row = Math.floor((game.getBoardSize() + point.y)/2);
	   					}
	   				}
	    			else if (miss.length > 1) {
	    				var firstPoint;
	   					var secondPoint;
	    				var distance = 0;

	    				for (var n = 0; n < miss.length; n++) {
	    					var p1 = miss[n];
	    					for (var m =0; m < miss.length; m++) {
	    						var p2 = miss[m];

	    						var d = Math.sqrt(Math.pow(1.0*(p1.x-p2.x), 2) + Math.pow(1.0*(p1.y-p2.y), 2));
	    						if (d > distance) {
	    							firstPoint = p1;
	    							secondPoint = p2;
	   								distance = d;
	    						}
	   						}
	   					}

	   					column = (p1.x + p2.x)/2;
    					row = (p1.y + p2.y)/2;
       				}
	   			}
	    			
	    		var sqr = game.queryLocation(key, column, row);
	    		var opponentType = "p1"
	    		if (is_player_one) {
					opponentType = "p2";
	    		}

	   			while(sqr.type == "miss" || sqr.type != opponentType && sqr.type != "invisible") {
	    			column++;
	    			row++;
	    			sqr = game.queryLocation(key, column, row);
	   			}

	    		setTimeout(function () {game.shootAt(key, column, row);}, turn_delay);
			}
    	}
    }

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      eventHandler);

    this.giveUpKey = function() {
	return key;
    }
	
}
