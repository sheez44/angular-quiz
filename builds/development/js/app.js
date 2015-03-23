	angular
		.module('myQuiz', [
			'ngRoute', 
			'ngAnimate',
		]);

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
		"TITLE": "My first Quiz!"
	});

})();	
(function () {
	
	angular
		.module('myQuiz')
		.factory('QuestionService', ['$http', '$q', function($http, $q) {

			var currentQuestion = 0;

			return {

				getQuestion: function() {	

				var def = $q.defer();

				$http.get("quizdb.json")
					.success(function(data) {
						// resolve the data by returning the question, choices and correctanswer in an object
						def.resolve({
							totalQuestions: data.allQuestions.length,
							question: data.allQuestions[currentQuestion].question,
							choices: data.allQuestions[currentQuestion].choices,
							correctAnswer: data.allQuestions[currentQuestion].correctAnswer
							});
					})
					.error(function() {
						def.reject("failed to retrieve questions");
					});
				return def.promise;	
				},
				getCurrentQuestion: function() {
					return currentQuestion;
				},
				nextQuestion: function() {
					(currentQuestion >= 0) ? currentQuestion += 1 : false; 
				}, 
				prevQuestion: function() {
					(currentQuestion < 0) ? false : currentQuestion -= 1; 
				}
			};
	}]);

})(); 
(function () {
	
	angular
		.module('myQuiz')
		// Ask for username which will displayed during quiz
		.value("User", {
			name: ""
		})
})(); 
(function () {
	
	angular
		.module('myQuiz')
		.config(config);

	function config($routeProvider) {
		$routeProvider.
			when('/quiz', {
				templateUrl: 'partials/quiz.html',
				controller: 'QuizController',
				controllerAs: 'quiz'
			}).
			when('/endofquiz', {
				templateUrl: 'partials/endofquiz.html',
				controller: 'EoquizController'
			}).
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController',
				controllerAs: 'vm',
				resolve: function (User) {
					$scope.user = User.name;
				}
			}).
			when('/', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
			}).
			otherwise({
				redirectTo: '/home'
			});
	}

})(); 
(function () {
	
	angular
		.module('myQuiz')
		.controller('EoquizController', ['$scope', 'Data', EoquizController]);

	function EoquizController($scope, Data) {

		$scope.scores = Data.scores;

	}

})(); 
(function () {

	angular
		.module('myQuiz')
		.controller('HomeController', ['$scope', '$location', 'User', HomeController]);

	function HomeController($scope, $location, User) {

		$scope.test = "Enter your name to start the quiz";

		$scope.user;

		function startQuiz (name) {
			setUserName(name);
			return $location.path('/quiz');
		}

		function setUserName(name) {
			User.name = name;
		}

		$scope.startQuiz = startQuiz;



	};

})(); 

(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", 'User', MainController]);

	function MainController(CONSTANTS, User) {	
		
		vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 
	};

})();


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