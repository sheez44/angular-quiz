(function () {
	angular
		.module('myQuiz')
		.controller('QuizController', 
			['$scope', '$http', '$animate', 'Data', '$location', 'QuestionService', 'User', QuizController]);

	function QuizController ($scope, $http, $animate, Data, $location, QuestionService, User) {

		var vm = this;
		var totalQuestions;
		var currentQuestion = 0;

		// This function is used to call the questionService everytime the user clicks on the 'add' button
		function getTheCurrentQuestion() {
			QuestionService.getQuestion(currentQuestion).then(function(data) {
				vm.question = data.question;
				vm.choices = data.choices;
				vm.correctAnswer = data.correctAnswer;
			});
		}

		// Initial call of the data => first question
		QuestionService.getQuestion(currentQuestion).then(function(data) {
			totalQuestions = data.totalQuestions;
			getTheCurrentQuestion();
		});

		// Every time a user clicks on the "add" button this function is called
		// Will update the question and choices
		function addQuestion() {
			if(currentQuestion + 1 < totalQuestions ) {
				vm.selected = false; // prevents highlight same question
				getUserAnswer();
				vm.test = choiceSelection.nextQuestion();
				getTheCurrentQuestion();	
			} else {
				$location.path('/endofquiz');
			}		
		}

		// This function passes the last given answer by the user to a new array
		// Then that answers is passed on to get validated
		// Additionally it will clear the array entirely to save memory 
		function getUserAnswer() {
			var userAnswer = choiceSelection.userAnswers.pop();
			validateAnswer(userAnswer);
			choiceSelection.userAnswers = [];
		}

		// This function checks the correct answer with the answers provided by the user
		// If the answer is correct it updates the totalcorrect answers and the questions
		// gets pushed in a new array for future purpose; vice versa for the wrong answers
		function validateAnswer(userAnswer) {
			console.log("the current question is " + currentQuestion);
			if(vm.correctAnswer === userAnswer) {
				User.totalCorrect += 1;
				User.correctQuestions.push(vm.question);
			} else {
				User.totalIncorrect += 1;
				User.incorrectQuestions.push(userAnswer);
			}
		}

		function addScores(totalCorrectAnswers) {

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
			},
			nextQuestion: function() {
				(currentQuestion >= 0) ? currentQuestion += 1 : false; 
				return currentQuestion;
			}, 
			prevQuestion: function() {
				(currentQuestion < 0) ? false : currentQuestion -= 1; 
			}
		};

		vm.addQuestion = addQuestion;
		vm.setSelection = choiceSelection.setSelection;
		vm.hasMadeAChoice = choiceSelection.hasMadeAChoice;
		vm.isActive = choiceSelection.isActive;
		vm.hasAnsweredOnce = choiceSelection.hasAnsweredOnce;

	};
	
})(); 