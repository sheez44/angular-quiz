angular
	.module('myQuiz', [
		'ngRoute', 
		'ngAnimate'
	]);
	

angular
	.module('myQuiz')
	.controller('HomeController', HomeController);

function HomeController($scope, $location) {

	vm.test = "Click the button to start the quiz";

	function startQuiz () {
		return $location.path('/quiz');
	}

	vm.startQuiz = startQuiz;

};
angular
	.module('myQuiz')
	.controller('MainController', MainController);

function MainController($scope) {	
	
	$scope.title = "My first Quiz!";
		 
};
angular
	.module('myQuiz')
	.controller('QuizController', QuizController);

function QuizController ($scope, $http) {

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

	var choiceSelection = {
		isSelected: false,
		userAnswers: [],
		setSelection: function(choice) {
			this.userAnwers.push(choice);
		},
		isSelection: function() {
			if(this.isSelected === true) {
				return true;
			}
		}
	}

	$scope.setSelection = choiceSelection.setSelection;

	$scope.isSelection = choiceSelection.isSelection;

	$scope.addQuestion = addQuestion; // make the addQuestion public to the view

	$scope.$watch('number', function() {
		$scope.loadQuizData();
	});	

};	
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
angular
	.module('myQuiz')
	.config(config);

function config($routeProvider) {
	$routeProvider.
		when('/quiz', {
			templateUrl: 'partials/quiz.html',
			controller: 'QuizController'
		}).
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'HomeController',
			controllerAs: 'vm'
		}).
		otherwise({
			redirectTo: '/home'
		});
}