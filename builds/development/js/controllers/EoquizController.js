(function () {
	
	angular
		.module('myQuiz')
		.controller('EoquizController', ['User', 'QuestionService', EoquizController]);

	function EoquizController(User, QuestionService) {

		var vm = this;

		// numbers
		vm.totalIncorrect = User.totalIncorrect;
		vm.totalCorrect = User.totalCorrect;

		vm.correctObj = { answers: [], questions: [] };

		vm.incorrectObj = { answers: [], questions: [], userAnswers: [] };

		User.correctQuestions.forEach(function(xdata) {
			vm.correctObj.questions.push(xdata.theQuestion);
			vm.correctObj.answers.push(xdata.theAnswer);
		});

		User.incorrectQuestions.forEach(function(xdata) {
			vm.incorrectObj.answers.push(xdata.theAnswer);
			vm.incorrectObj.questions.push(xdata.theQuestion);
			vm.incorrectObj.userAnswers.push(xdata.good);
		});

	}

})(); 