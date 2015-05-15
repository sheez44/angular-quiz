(function () {
	
	angular
		.module('myQuiz')
		// Ask for username which will displayed during quiz
		.value("User", {
			user: {},
			indexAnswers: [],
			totalCorrect: 0,
			totalIncorrect: 0,
			correctQuestions: [],
			incorrectQuestions: [],
			hasStarted: false,
			isActive: false,
			currentQuestion: 4,
			newTopscore: false
		});

})(); 