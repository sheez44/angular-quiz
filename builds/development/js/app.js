	angular
		.module('myQuiz', [
			'ngRoute', 
			'ngAnimate',
			'firebase'
		]);

(function () {
	angular
		.module("myQuiz")
		.factory("Auth", ["$firebaseAuth", 
			"$firebaseObject", "$rootScope", "$location", "$routeParams", "CONSTANTS", "User", function($firebaseAuth, 
				$firebaseObject, routeParams, $rootScope, $location, CONSTANTS, User) {

			var ref = new Firebase(CONSTANTS.FIREBASE_URL);
			var auth = $firebaseAuth(ref);

			auth.$onAuth(function(authUser) {
				if (authUser) {
					var ref = new Firebase(CONSTANTS.FIREBASE_URL + "users/" + authUser.uid);
					var userObject = $firebaseObject(ref); // returns authUser.uid object with all the registered information (date, username etc)
					User.user = userObject;
				} else {
					User.user = {}; // if no user is not logged in, this value becomes empty  
				}
			});

			var myObject = {
				login: function(user) {
					return auth.$authWithPassword({
						email: user.email,
						password: user.password
					});
				}, // login

				logout: function(user) {
					return auth.$unauth();
				}, // logout

				register: function(user) {
					return auth.$createUser({
						email: user.email,
						password: user.password
					}).then(function(regUser) { // When the data is sent to firebase, an object 'regUser' is returned 
						var ref = new Firebase(CONSTANTS.FIREBASE_URL + "users/" + regUser.uid);

					var userInfo = {
							date: Firebase.ServerValue.TIMESTAMP,
							regUser: regUser.uid,
							name: user.name,
							username: user.username,
							email: user.email
						}; // User Info object

						ref.set(userInfo, function(error) {
							if(error) {
								console.log("Error: ", error);
							} else {
								console.log("created profile successfully")
							}
						});

						
					}); 
				}, // register

				requireAuth: function() {
					return auth.$requireAuth();
				}, // require Authentication

				waitForAuth: function() {
					return auth.$waitForAuth();
				} // Wait until the user is authenticated

			}; // myObject

			return myObject;
	}]);
})(); 
(function () {
	
	angular
		.module('myQuiz')
		.factory('Data', function () {

			var number = 0;
			

			var hasMadeAChoice = function() {
				if (choiceSelection.userAnswers.length === 0) {
					return true;
				}
			};	

			return { 
				number: number,
				correctAnswers: 0,
				incorrectAnswers: 0,
				correctAnswersList: [],
				incorrectAnswersList: [],
				hasMadeAChoice: hasMadeAChoice
			}
		});

})(); 
(function() {

angular.module('myQuiz')
	.constant("CONSTANTS", {
		"TITLE": "My first Quiz!",
		"FIREBASE_URL": "https://angularquiz.firebaseio.com/"
	});

})();	
(function () {
	
	angular
		.module('myQuiz')
		.factory('QuestionService', ['$http', '$q', function($http, $q) {

			return {

				getQuestion: function(number) {	

					var def = $q.defer();

					$http.get("quizdb.json")
						.success(function(data) {
							// resolve the data by returning the question, choices and correctanswer in an object
							def.resolve({
								totalQuestions: data.allQuestions.length,
								question: data.allQuestions[number].question,
								choices: data.allQuestions[number].choices,
								correctAnswer: data.allQuestions[number].correctAnswer
								});
						})
						.error(function() {
							def.reject("failed to retrieve questions");
						});
					return def.promise;	
				}
			};
	}]);

})(); 
(function () {
	
	angular
		.module('myQuiz')
		// Ask for username which will displayed during quiz
		.value("User", {
			user: {},
			totalCorrect: 0,
			totalIncorrect: 0,
			correctQuestions: [],
			incorrectQuestions: []
		});

})(); 
(function () {
	
	angular
		.module('myQuiz')
		.config(config)
		.run(['$rootScope', '$location', function ($rootScope, $location) {
			$rootScope.$on('$routeChangeError', function(event, next, previous, error) {
				if(error === 'AUTH_REQUIRED') { // Whenever an unauthenticated user tries to acces the quiz
					$rootScope.message = 'Sorry, you must log in to acces the quiz'; // this error gets displayed
					$location.path('/login');
				}
			});
		}]);

	function config($routeProvider) {
		$routeProvider.
			when('/quiz', {
				templateUrl: 'partials/quiz.html',
				controller: 'QuizController',
				controllerAs: 'quiz',
				resolve: {
					currentAuth: function(Auth) { // checks whether the user is authenticated (has acces) to view this page
						return Auth.requireAuth();
					}
				}
			}).
			when('/endofquiz', {
				templateUrl: 'partials/endofquiz.html',
				controller: 'EoquizController'
			}).
			when('/', {
				templateUrl: 'partials/home.html',
				controller: 'RegistrationController'
			}).
			when('/register', {
				templateUrl: 'partials/register.html',
				controller: 'RegistrationController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}

})(); 

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
(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", 'User', '$rootScope', 'Auth', MainController]);

	function MainController(CONSTANTS, User, $rootScope, Auth) {	
		
		vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 

	};

})();


(function () {
	angular
		.module('myQuiz')
		.controller('QuizController', 
			['$scope', '$http', '$animate', 'Data', '$location', 'QuestionService', 'User', QuizController]);

	function QuizController ($scope, $http, $animate, Data, $location, QuestionService, User) {

		var vm = this;
		var totalQuestions;
		var currentQuestion = 9;

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
				getTheCurrentQuestion();	
			} else {
				getUserAnswer();
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
(function () {
	
	angular
		.module('myQuiz')
		.controller('RegistrationController', ['User', '$scope', '$location', 'Auth', RegController]);

	function RegController(User, $scope, $location, Auth) {

		$scope.user = User;

		$scope.login = function () {
			Auth.login($scope.user) // user object contains user.email and user.password
			.then(function(user) {
				$location.path('/quiz');
			}).catch(function(error) {
				$scope.message = error.message;
			});
		} // login

		$scope.register = function() {
			Auth.register($scope.user)
			.then(function(user) {
				Auth.login($scope.user);
				$location.path('/quiz');
			}).catch(function(error) {
				$scope.message = error.message;
			});
		} // register

		$scope.resumeQuiz = function () {
			$location.path('/quiz');
		}

	}

})(); 

// 3:55
(function () {
	angular
		.module('myQuiz')
		.controller('StatusController', ['$scope', '$location', 'Auth', StatusController]);

		function StatusController($scope, $location, Auth) {

			$scope.logout = function() {
				Auth.logout();
				$location.path('/');
			} // logout

		} // StatusController

})(); 