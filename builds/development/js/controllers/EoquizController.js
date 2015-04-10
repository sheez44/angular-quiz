(function () {
	
	angular
		.module('myQuiz')
		.controller('EoquizController', ['User', EoquizController]);

	function EoquizController(User) {

		var vm = this;

		// numbers
		vm.totalIncorrect = User.totalIncorrect;
		vm.totalCorrect = User.totalCorrect;
		// arrays
		vm.correctScores = User.correctQuestions;
		vm.incorrectScores = User.incorrectQuestions;

	}

})(); 