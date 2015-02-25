var myQuiz = angular.module('myQuiz', ['ngRoute', 'ngAnimate']);

myQuiz.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/quiz', {
				templateUrl: 'partials/quiz.html',
				controller: 'QuizController'
			}).
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController'
			}).
			otherwise({
				redirectTo: '/home'
			});
	}]);
myQuiz.controller('HomeController', function($scope, $location) {

	$scope.test = "Click the button to start the quiz";

	function startQuiz () {
		return $location.path('/quiz');
	}

	$scope.startQuiz = startQuiz;

});
myQuiz.controller('MainController', function($scope) {
	
	$scope.title = "My first Quiz!";
		 
});
myQuiz.controller('QuizController', function($scope, $http) {



		$scope.number = 0;


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
		      }).error(function(error) {
		        $scope.names = [{
		          "Name": "Errrrrrr"
		        }];
		      });
		    };

		function addQuestion() {
			if ($scope.number < 9) {
				console.log($scope.number);
				$scope.number += 1;
			} else {
				$scope.number = 0;
			}
		} // private;

		function isSelected(question) {
			return false;
		}

		$scope.isSelected = isSelected;

		$scope.addQuestion = addQuestion; // make the addQuestion public to the view

		$scope.$watch('number', function() {
			$scope.loadQuizData();
		});

	});	
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