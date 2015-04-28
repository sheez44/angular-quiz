(function () {
	angular
		.module('myQuiz')
		.controller('QuizController', 
			['$http', '$animate', 'Data', '$location', 'QuestionService', 'User', '$firebaseObject', 'CONSTANTS', QuizController]);

	function QuizController ($http, $animate, Data, $location, QuestionService, User, $firebaseObject, CONSTANTS) {

		var vm = this;
		var totalQuestions;
		var currentQuestion = 8;

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
				currentQuestion += 1;
				getTheCurrentQuestion();	
			} else {
				getUserAnswer();
				addTopscore();
				User.quizStatus = false;
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

			if(vm.correctAnswer === userAnswer) {
				User.totalCorrect += 1;
				User.correctQuestions.push({
					theAnswer: userAnswer,
					theQuestion: vm.question,
				});
			} else {
				User.totalIncorrect += 1;
				User.incorrectQuestions.push({
					theAnswer: userAnswer,
					theQuestion: vm.question,
					good: vm.correctAnswer
				});
			}
		}

		function addTopscore() {
			console.log(User.user.$id);
			var ref = new Firebase(CONSTANTS.FIREBASE_URL + 'users/' + User.user.$id);

			var userObject = $firebaseObject(ref);

			userObject.$loaded().then(function() {
				angular.forEach(userObject, function(key, value) {
					if(key === 'topscore') {
						console.log(User.topscore);
					} else {
						saveTopscore();
					}
				});
			}).
			catch(function(error) {
				console.log("error: " + error);
			});
		}

		function saveTopscore() {
			var ref = new Firebase(CONSTANTS.FIREBASE_URL + 'users/' + User.user.$id);
			ref.update({ topscore: User.totalCorrect });
		}

		// function addScores(totalCorrectAnswers) {

		// }

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