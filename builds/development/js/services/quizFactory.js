(function () {
	
	angular
		.module('myQuiz')
		.factory('quizFactory', [ function() {

			var currentQuestion = 7;

			return {

				nextQuestion: function() {
					currentQuestion += 1
					return currentQuestion;
				},
				previousQuestion: function() {
					if(currentQuestion >= 0) {
						currentQuestion -= 1;
					} else {
						currentQuestion = 0;
					}
				},
				getCurrentQuestion: function() {
					return currentQuestion;
				},
				resetQuestion: function() {
					currentQuestion = 0;
				}
			};
	}]);

})(); 