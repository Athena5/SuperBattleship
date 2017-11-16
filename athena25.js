 $(document).ready(function () {
    var game = new SuperBattleship();
    var player_one = new a2Player(game, $('#userControls'), $("#output"), $('#gameBoard'), true);
    var ai_player_two = new athena25AI(game, false);

    game.startGame();
});