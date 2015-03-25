(function () {
	
	angular
		.module('myQuiz')
		.controller('EoquizController', ['$scope', 'User', EoquizController]);

	function EoquizController($scope, User) {

		// numbers
		$scope.totalIncorrect = User.totalIncorrect;
		$scope.totalCorrect = User.totalCorrect;
		// arrays
		$scope.correctScores = User.correctQuestions;
		$scope.incorrectScores = User.incorrectQuestions;

	}

})(); 