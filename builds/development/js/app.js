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

			var currentNumber = 0;

			return {

				getQuestion: function() {	

				var def = $q.defer();

				$http.get("quizdb.json")
					.success(function(data) {
						def.resolve(data.allQuestions[currentNumber]);
					})
					.error(function() {
						def.reject("failed to retrieve questions");
					});
				return def.promise;	
				},
				getCurrentNumber: function() {
					return currentNumber;
				},
				nextQuestion: function() {
					currentNumber += 1;
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