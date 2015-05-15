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
		.factory('Topscore' , ['$firebaseObject', 'CONSTANTS', 'User', function($firebaseObject, CONSTANTS, User) {
			var ref = new Firebase(CONSTANTS.FIREBASE_URL);
			var userObject = $firebaseObject(ref);

			return {
				getTopscore: function(userid) {
					var ref = new Firebase(CONSTANTS.FIREBASE_URL + 'users/' + userid);
					var userObject = $firebaseObject(ref);

					return userObject.$loaded().then(function() {
						return userObject.topscore;
					}).
					catch(function(error) {
						console.log("error: " + error);
					});
				}, // getTopscore
				saveTopscore: function(correct, userid) {
					var ref = new Firebase(CONSTANTS.FIREBASE_URL + 'users/' + userid);
					var userObject = $firebaseObject(ref);

					ref.update({topscore: correct})

					console.log("topscore successfully updated!")
				}
			};
		}]);
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
								correctAnswer: data.allQuestions[number].correctAnswer,
								index: number
								});
						})
						.error(function() {
							def.reject("failed to retrieve questions");
						});
					return def.promise;	
				},

			// 	getAllQuestions: function() {
			// 		var def = $q.defer();

			// 		$http.get("quizdb.json")
			// 			.success(function(data) {
			// 				// resolve the data by returning the question, choices and correctanswer in an object
			// 				def.resolve(
			// 					data
			// 					);
			// 			})
			// 			.error(function() {
			// 				def.reject("failed to retrieve questions");
			// 			});
			// 		return def.promise;	
			// 	}
			// };
			getIndexQuestion: function(qNumber, answer) {
				return $http.get("quizdb.json")
					.then(function(response) {
						return response.data.allQuestions[qNumber].choices.indexOf(answer);
					}, function(response) {
						return $q.reject(response.data);
					});
					
				}
			};
	}]);

})(); 
(function () {
	
	angular
		.module('myQuiz')
		.factory('quizFactory', [ function() {

			var currentQuestion = 0;

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
(function () {
	
	angular
		.module('myQuiz')
		.config(config)
		.run(['$rootScope', '$location', function ($rootScope, $location) {
			$rootScope.$on('$routeChangeError', function(event, next, previous, error) {
				if(error === 'AUTH_REQUIRED') { // Whenever an unauthenticated user tries to acces the quiz
					$rootScope.message = 'Sorry, you must log in to acces the quiz'; // this error gets displayed
					$location.path('/');
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
					},
					currentQuestion: function(quizFactory) {
						return quizFactory.getCurrentQuestion();
					}
				}
			}).
			when('/endofquiz', {
				templateUrl: 'partials/endofquiz.html',
				controller: 'EoquizController',
				controllerAs: 'eo',
				resolve: {
					app: function(User, $q, $location, $rootScope) {
						var defer = $q.defer();
						if(User.quizStatus === true) {
							defer.reject();
							$location.path('/');
						} else {
							return defer.resolve();
						}
						return defer.promise; 
					}
				}
			}).
			when('/login', {
				templateUrl: 'partials/home.html',
				controller: 'RegistrationController',
				controllerAs: 'reg',
			}).
			when('/register', {
				templateUrl: 'partials/register.html',
				controller: 'RegistrationController',
				controllerAs: 'reg'
			}).
			when('/user-page', {
				templateUrl: 'partials/user-page.html',
				controller: 'UserPageController',
				controllerAs: 'user'
			}).
			otherwise({
				redirectTo: '/login'
			});
	}

})(); 

(function () {
	
	angular
		.module('myQuiz')
		.controller('EoquizController', ['User', 'QuestionService', EoquizController]);

	function EoquizController(User, QuestionService) {

		var vm = this;

		vm.newTopscore = User.newTopscore;

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
(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["$location", "CONSTANTS", 'User', 'Auth', 'QuestionService', MainController]);

	function MainController($location, CONSTANTS, User, Auth, QuestionService) {	
		
		var vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 

		vm.logout = function() {

			Auth.logout();
			$location.path('/login')
		}
	};

})();


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
				console.log(vm.index);
			});
		}

		console.log(User.indexAnswers);

		// Initial call of the data => first question
		QuestionService.getQuestion(currentQuestion).then(function(data) {
			User.hasStarted = true;
			totalQuestions = data.totalQuestions;
			getTheCurrentQuestion();
		});

		// Every time a user clicks on the "add" button this function is called
		// Will update the question and choices
		function addQuestion() {
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
			quizFactory.previousQuestion();
			getCurrentQuestion();
			getTheCurrentQuestion();
			QuestionService.getIndexQuestion(currentQuestion, answer).then(function(data) {
			  vm.index = data;
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

		// This function checks the correct answer with the answers provided by the user
		// If the answer is correct it updates the totalcorrect answers and the questions
		// gets pushed in a new array for future purpose; vice versa for the wrong answers
		function validateAnswer(userAnswer) {
			if(vm.correctAnswer === userAnswer) {
				User.totalCorrect += 1;
				User.indexAnswers.push({
					theAnswer: userAnswer,
					index: vm.index
				});
				User.correctQuestions.push({
					theAnswer: userAnswer,
					theQuestion: vm.question,
					currentQuestion: currentQuestion
				});
			} else {
				User.totalIncorrect += 1;
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
			}
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
(function () {
	
	angular
		.module('myQuiz')
		.controller('RegistrationController', ['User', '$location', 'Auth', RegController]);

	function RegController(User, $location, Auth) {

		var vm = this;

		vm.user = User;

		vm.login = function () {
			Auth.login(vm.user) // user object contains user.email and user.password
			.then(function(user) {
				$location.path('/user-page');
			}).catch(function(error) {
				vm.message = error.message;
			});
		} // login

		vm.register = function() {
			Auth.register(vm.user)
			.then(function(user) {
				Auth.login(vm.user);
				$location.path('/user-page');
			}).catch(function(error) {
				vm.message = error.message;
			});
		} // register

	}

})(); 

// 3:55
(function () {
	angular
		.module('myQuiz')
		.controller('StatusController', ['$location', 'Auth', StatusController]);

		function StatusController($location, Auth) {

			var vm = this;

			vm.logout = function() {
				Auth.logout();
				$location.path('/');
			} // logout

		} // StatusController

})(); 
(function () {
	angular
		.module('myQuiz')
		.controller('UserPageController', 
			['User', '$location', 'Topscore', UserPageController]);

		function UserPageController(User, $location, Topscore) {

			var vm = this;

			vm.user = User;

			var userid = User.user.$id;

			var test = Topscore.getTopscore(userid).then(function(topscore) {
				vm.topscore = topscore;
				console.log(vm.topscore);
			});

			vm.hasStarted = function() {
				return User.hasStarted;
			}

			vm.resumeQuiz = function () {
				$location.path('/quiz');
			}

		}
})(); 
(function () {
	
	angular
    	.module('myQuiz')
  		.directive('quiz', function() {
  			return {
  				restrict: 'E',
  				scope: {
  					quiz: '='
  				},
  				templateUrl: 'js/directives/thequiz.html'
  			}
  	});

})(); 