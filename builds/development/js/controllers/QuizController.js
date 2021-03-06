(function () {
	angular
		.module('myQuiz')
		.controller('QuizController', 
			['Topscore', 'currentQuestion', '$http', '$animate', 'Data', '$location', 'QuestionService', 'User', 'quizFactory', QuizController]);

	function QuizController (Topscore, currentQuestion, $http, $animate, Data, $location, QuestionService, User, quizFactory) {

		var vm = this;
		var totalQuestions;
		var currentQuestion = currentQuestion;
		vm.answered = undefined;
		var userid = User.user.$id;
		var allQuestions;


		QuestionService.getAllQuestions().then(function(data) {
			allQuestions = data;	
		});

		function getCurrentQuestion() {
			currentQuestion = quizFactory.getCurrentQuestion();
		}

		// This function is used to call the questionService everytime the user clicks on the 'add' button
		function getTheCurrentQuestion() {
			QuestionService.getQuestion(currentQuestion).then(function(data) {
				vm.question = data.question;
				vm.choices = data.choices;
				vm.correctAnswer = data.correctAnswer;
				vm.index = data.index;
			});
		}		

		// Initial call of the data => first question
		QuestionService.getQuestion(currentQuestion).then(function(data) {
			User.hasStarted = true;
			totalQuestions = data.totalQuestions;
			getTheCurrentQuestion();
		});

		// Every time a user clicks on the "add" button this function is called
		// Will update the question and choices
		function addQuestion() {
			if(currentQuestion === User.indexAnswers.length ) {
				vm.q_index = undefined;
			}
			if(currentQuestion + 1 < totalQuestions ) {
				vm.selected = false; // prevents highlight same question
				getUserAnswer();
				quizFactory.nextQuestion();
				getCurrentQuestion();
				getTheCurrentQuestion();
			} else {
				getUserAnswer();
				Topscore.getTopscore(userid).then(function(topscore) {
					if(topscore < User.totalCorrect) {
						Topscore.saveTopscore(User.totalCorrect, userid);
						User.newTopscore = true;
					}
				});
				User.hasStarted = false;
				$location.path('/endofquiz');
			}	
		}

		function prevQuestion() {
			User.quizFlow = 'backwards';
			choiceSelection.hasMadeAChoice();
			quizFactory.previousQuestion();
			getCurrentQuestion();
			getTheCurrentQuestion();
			QuestionService.getIndexQuestion(currentQuestion, User.indexAnswers[currentQuestion].theAnswer).then(function(data) {
			  if(User.quizFlow === 'backwards') {
			  	vm.q_index = data;
			  }		  
			});
		
		}

		// This function passes the last given answer by the user to a new array
		// Then that answers is passed on to get validated
		// Additionally it will clear the array entirely to save memory 
		function getUserAnswer() {
			var userAnswer = choiceSelection.userAnswers.pop();
			validateAnswer(userAnswer);
			choiceSelection.userAnswers = [];
		}

		function addPoints(status) {
			while(quizFlow === 'forwards') {
				if(status === 'correct') {
					User.totalCorrect += 1;
				} else if (status === 'incorrect') {
					User.totalIncorrect += 1;
				}	
			}

			if (status === 'correct') {
				for (var i = 0; i < User.correctQuestions; i += 1) {
					if (userAnswer != User.correctQuestions[i].theAnswer) {
						User.totalCorrect -=1
					}
				}
			} else {
				if(vm.correctAnswer === userAnswer) {
					User.totalCorrect += 1;
				}
			}
			
		}
		// This function checks the correct answer with the answers provided by the user
		// If the answer is correct it updates the totalcorrect answers and the questions
		// gets pushed in a new array for future purpose; vice versa for the wrong answers
		function validateAnswer(userAnswer) {
			if(vm.correctAnswer === userAnswer) {
				User.totalCorrect += 1;
				if(User.quizFlow === 'forwards') {
					User.indexAnswers.push({
						theAnswer: userAnswer,
						index: vm.index
					});
					User.correctQuestions.push({
						theAnswer: userAnswer,
						theQuestion: vm.question,
						currentQuestion: currentQuestion
					});
				} else if (User.quizFlow === 'backwards') {
					User.indexAnswers.splice(currentQuestion, 1, {
						theAnswer: userAnswer,
						index: vm.index
					});
					User.correctQuestions.splice(currentQuestion, 1, {
						theAnswer: userAnswer,
						theQuestion: vm.question,
						currentQuestion: currentQuestion
					});
				}
				
			} else {
				User.totalIncorrect += 1;
				if(User.quizFlow === 'forwards') {
					User.indexAnswers.push({
						theAnswer: userAnswer,
						index: vm.index
					});
					User.incorrectQuestions.push({
						theAnswer: userAnswer,
						theQuestion: vm.question,
						good: vm.correctAnswer,
						currentQuestion: currentQuestion
					});
				} else if (User.quizFlow === 'backwards') {
					User.indexAnswers.splice(currentQuestion, 1, {
						theAnswer: userAnswer,
						index: vm.index
					});
					User.incorrectQuestions.splice(currentQuestion, 1, {
						theAnswer: userAnswer,
						theQuestion: vm.question,
						good: vm.correctAnswer,
						currentQuestion: currentQuestion
					});
				}				
			} 
		}

		var choiceSelection = {
			userAnswers: [],
			setSelection: function(choice) {
				choiceSelection.userAnswers.push(choice);
				vm.q_index = undefined;
				vm.selected = choice;
			},
			hasMadeAChoice: function() {
				// doesnt work somehow
				if(currentQuestion < User.indexAnswers.length) {
					return true;
				} else {
					return (choiceSelection.userAnswers.length === 0);
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

		function isChosen(index) {
			vm.answered = index;
		}

		function showBackbutton() {
			return currentQuestion > 0 ? true : false;
		}

		vm.isChosen = isChosen;
		vm.addQuestion = addQuestion;
		vm.prevQuestion = prevQuestion;
		vm.showBackbutton = showBackbutton;
		vm.setSelection = choiceSelection.setSelection;
		vm.hasMadeAChoice = choiceSelection.hasMadeAChoice;
		vm.isActive = choiceSelection.isActive;
		vm.hasAnsweredOnce = choiceSelection.hasAnsweredOnce;
		vm.newTopscore;
	};
	
})(); 