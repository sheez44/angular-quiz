(function () {
	angular
		.module('myQuiz')
		.controller('QuizController', ['$scope', '$http', '$animate', 'Data', '$location', 'QuestionService', QuizController]);

	function QuizController ($scope, $http, $animate, Data, $location, QuestionService) {

		var vm = this;
		
		QuestionService.getQuestion().then(function(data) {
			// bad code, needs to get resolved in service
			vm.question = data.question;
			vm.choices = data.choices;
			vm.correctAnswer = data.correctAnswer;
		});

		function addQuestion() {
			QuestionService.nextQuestion();
			// bad code, needs to get resolved in service
			QuestionService.getQuestion().then(function(data) {
				vm.question = data.question;
				vm.choices = data.choices;
				vm.correctAnswer = data.correctAnswer;
			});
		}

		vm.addQuestion = addQuestion;

	};


	
})(); 