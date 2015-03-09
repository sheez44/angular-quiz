(function () {

	angular
		.module('myQuiz', [
			'ngRoute', 
			'ngAnimate',
			'ngCookies'
		]);

})(); 
(function () {
	
	angular
		.module('myQuiz')
		.config(config);

	function config($routeProvider) {
		$routeProvider.
			when('/quiz', {
				templateUrl: 'partials/quiz.html',
				controller: 'QuizController'
			}).
			when('/endofquiz', {
				templateUrl: 'partials/endofquiz.html',
				controller: 'EoquizController'
			}).
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
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
		.controller('HomeController', ['$scope', '$location', '$cookieStore', '$cookies', HomeController]);

	function HomeController($scope, $location, $cookieStore, $cookies) {

		$scope.test = "Enter your name to start the quiz";
		$scope.user = {
			name: ''
		};


		function startQuiz (name) {
			setUserName(name);
			return $location.path('/quiz');
		}

		function setUserName(name) {
			$cookies.userName = name;
		}

		$scope.startQuiz = startQuiz;

	};

})(); 

(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", "$cookies", "$cookieStore", MainController]);

	function MainController(CONSTANTS, $cookies, $cookieStore) {	
		
		vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = $cookies.userName;
			 
	};

})();


angular
	.module('myQuiz')
	.controller('QuizController', ['$scope','$http', '$animate', 'Data', '$location', QuizController]);

function QuizController ($scope, $http, $animate, Data, $location) {

	$scope.number = Data.number;

	$scope.loadQuizData = function() {
	      $http({
	        url: 'quizdb.json',
	        dataType: 'json',
	        method: 'GET',
	        data: '',
	        headers: {
	          "Content-Type": "application/json"
	        }
	      }).success(function(response) {
	        $scope.question = response.allQuestions[$scope.number].question;
	        $scope.choices = response.allQuestions[$scope.number].choices;
	        $scope.correctAnswer = response.allQuestions[$scope.number].correctAnswer;
	      }).error(function(error) {
	        $scope.names = [{
	          "Name": "Errrrrrr"
	        }];
	      });
	    };

	$scope.correctAnswers = Data.correctAnswers;
	var incorrectAnswers = Data.incorrectAnswers;
	var correctAnswersList = Data.correctAnswersList;
	var incorrectAnswersList = Data.incorrectAnswersList;    

	function addQuestion() {
		if ($scope.number < 9) {
			var answer = choiceSelection.userAnswers.pop();
			$scope.selected = undefined;
			if (answer === $scope.correctAnswer) {
				$scope.correctAnswers += 1;
				correctAnswersList.push(answer);
				choiceSelection.userAnswer = [];
			} else {
				incorrectAnswers += 1;
				incorrectAnswersList.push(answer);
				choiceSelection.userAnswer = [];
			}
			$scope.number += 1;
		} else {
			$location.path('/endofquiz');
		}
	} // private;

	var choiceSelection = {

		setSelection: function(choice) {
			choiceSelection.userAnswers.push(choice);
			$scope.selected = choice;
		},
		isActive: function(choice) {
			return $scope.selected === choice;
		},
		hasAnsweredOnce: function() {
			if($scope.number !== 0) {
				return true;
			}
		}

	}



	$scope.addQuestion = addQuestion; // make the addQuestion public to the view

	$scope.hasMadeAChoice = Data.hasMadeAChoice;

	$scope.setSelection = choiceSelection.setSelection;

	$scope.isActive = choiceSelection.isActive;

	$scope.hasAnsweredOnce = choiceSelection.hasAnsweredOnce;

	$scope.$watch('number', function() {
		$scope.loadQuizData();
	});	

};	
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
// myQuiz.factory('loadQuestions', function($http) {

// 	var questions = { content: null};

// 	$http.get('quizdb.json').
// 		success(function(data) {
// 			questions = data;
// 		}).
// 		error(function(data, status) {
// 			console.log(data + status);
// 		});

// 	return questions;

// });