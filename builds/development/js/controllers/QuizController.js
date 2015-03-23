(function () {
	angular
		.module('myQuiz')
		.controller('QuizController', ['$scope', '$http', '$animate', 'Data', '$location', 'QuestionService', QuizController]);

	function QuizController ($scope, $http, $animate, Data, $location, QuestionService) {

		var vm = this;
		var totalQuestions;
		var currentQuestion;

		var dirty = false;
		
		QuestionService.getQuestion().then(function(data) {
			totalQuestions = data.totalQuestions;
			currentQuestion = data.currentQuestion;
			vm.question = data.question;
			vm.choices = data.choices;
			vm.correctAnswer = data.correctAnswer;
		});

		function addQuestion() {
			vm.selected = false; // prevents highlight same question
			QuestionService.nextQuestion();
			getQuestions();
			QuestionService.getQuestion().then(function(data) {
				vm.question = data.question;
				vm.choices = data.choices;
				vm.correctAnswer = data.correctAnswer;
			});
		}

		var choiceSelection = {
			userAnswers: [],
			setSelection: function(choice) {
				choiceSelection.userAnswers.push(choice);
				vm.selected = choice;
			},
			hasMadeAChoice: function() {
				if(choiceSelection.userAnswers.length === 0) {
					return true;
				}
			},
			isActive: function (choice) {
				return vm.selected === choice;
			},
			hasAnsweredOnce: function() {
				if(currentQuestion !== 0) {
					return true;
				}
			}
		};
		vm.addQuestion = addQuestion;
		vm.setSelection = choiceSelection.setSelection;
		vm.hasMadeAChoice = choiceSelection.hasMadeAChoice;
		vm.isActive = choiceSelection.isActive;
		vm.hasAnsweredOnce = choiceSelection.hasAnsweredOnce;

	};
	
})(); 