// Joel Cantoral, 2015
// Module definition
var game = angular.module('game', []);
game.controller('MainCtrl', function ($scope, GameState) {
    /**
        Marks a box with the current player's piece.
        If the box is already marked a notification(toast) is displayed.
    **/
    $scope.mark = function($event){
        var clickedBox = $event.currentTarget;
        var boxIndex = parseInt(clickedBox.getAttribute("index"), 10);
        
        try{
            // Check if current player has won
            var hasWon = GameState.markBox(boxIndex);
            // Change box's icon and color
            $scope.boxIconClass[boxIndex] = ($scope.currentPlayer=='o'?'mdi-image-panorama-fisheye':'mdi-navigation-close');
            angular.element(clickedBox).removeClass('deep-orange').addClass('blue');

            if (hasWon){
                // Show winner's notification card
                $scope.notifications['oneWinner']='display:block';
            }else{
                // If all boxes are marked and there is no winner
                // show a notification's card to show the game is finished
                if($.inArray(0, $scope.currentState) === -1){
                    $scope.notifications['noWinner']='display:block';
                }
            }
            $scope.currentPlayer = GameState.getCurrentPlayer();
        }catch(err){
            // If box is already checked, show notification
            toast(err, 2000);
        }
    };

    $scope.init = function(){
        // CSS style of card notifications
        $scope.notifications = {
            'oneWinner':'display:none',
            'noWinner':'display:none'
        };
        // Init all boxes with a deep-orange color
        var boxes = document.querySelectorAll('.box');
        for (i = 0; i < boxes.length; ++i) {
          angular.element(boxes[i]).removeClass('blue').addClass('deep-orange');
        }
        // Icon classes from boxes' icons
        $scope.boxIconClass = [
            "mdi-content-create",
            "mdi-content-create",
            "mdi-content-create",
            "mdi-content-create",
            "mdi-content-create",
            "mdi-content-create",
            "mdi-content-create",
            "mdi-content-create",
            "mdi-content-create"
        ];
        // Clear model
        GameState.clearGame();
        // Get initial data
        $scope.currentPlayer = GameState.getCurrentPlayer();
        $scope.currentState = GameState.getState();
    };

    // Init game
    $scope.init();
});
// Define our first service; Posts
// This service simply uses the built-in $http service to retrieve data from
// a static JSON store.
game.service('GameState', function ($http) {
    // Initial state of the game
    this.boxes = [0,0,0,0,0,0,0,0,0];
    // Current player
    this.currentPlayer = "o";
    // Get current player
    this.getCurrentPlayer = function(){
        return this.currentPlayer;
    };
    // Get current state
    this.getState = function(){
        return this.boxes;
    };
    // Change state if permitted
    this.markBox = function(i){
        piece = this.currentPlayer;
        if (this.boxes[i]===0){
            this.boxes[i] = piece;
            if (this.hasWon(piece)){
                return true;
            }else{
                this.currentPlayer = (this.currentPlayer==="o"?"x":"o");
                return false;
            }
        }else{
            throw "The box is already checked.";
        }
    };
    // Compare current state to win states
    this.hasWon = function(piece){
        if (
            ((this.boxes[0] === piece) && (this.boxes[0]===this.boxes[1]) && (this.boxes[1]===this.boxes[2])) ||
            ((this.boxes[3] === piece) && (this.boxes[3]===this.boxes[4]) && (this.boxes[4]===this.boxes[5])) ||
            ((this.boxes[6] === piece) && (this.boxes[6]===this.boxes[7]) && (this.boxes[7]===this.boxes[8])) ||
            ((this.boxes[2] === piece) && (this.boxes[2]===this.boxes[4]) && (this.boxes[4]===this.boxes[6])) ||
            ((this.boxes[0] === piece) && (this.boxes[0]===this.boxes[4]) && (this.boxes[4]===this.boxes[8])) ||
            ((this.boxes[0] === piece) && (this.boxes[0]===this.boxes[3]) && (this.boxes[3]===this.boxes[6])) ||
            ((this.boxes[1] === piece) && (this.boxes[1]===this.boxes[4]) && (this.boxes[4]===this.boxes[7])) ||
            ((this.boxes[2] === piece) && (this.boxes[2]===this.boxes[5]) && (this.boxes[5]===this.boxes[8]))
        ){
            return true;
        }else{
            return false;
        }
    };
    // Return to initial state
    this.clearGame = function(){
        this.boxes = [0,0,0,0,0,0,0,0,0];
        this.currentPlayer = 'o';
    };
});

// Directive that creates the board
game.directive('gameBoard', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'gameBoard.html'
    };
})
// Directive that holds the notifications' cards
.directive('notifications', function(){
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'notifications.html'
    };
});