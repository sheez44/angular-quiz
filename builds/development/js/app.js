angular
	.module('myQuiz', [
		'ngRoute', 
		'ngAnimate'
	]);
	

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
		when('/', {
			templateUrl: 'partials/home.html',
			controller: 'HomeController',
			controllerAs: 'vm'
		}).
		otherwise({
			redirectTo: '/home'
		});
}
angular
	.module('myQuiz')
	.controller('HomeController', HomeController);

function HomeController($scope, $location) {

	$scope.test = "Enter your name to start the quiz";

	function startQuiz () {
		return $location.path('/quiz');
	}

	$scope.startQuiz = startQuiz;

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

function QuizController ($scope, $http, $animate) {

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
	        $scope.correctAnswer = response.allQuestions[$scope.number].correctAnswer;
	      }).error(function(error) {
	        $scope.names = [{
	          "Name": "Errrrrrr"
	        }];
	      });
	    };

	$scope.correctAnswers = 0;
	var incorrectAnswers = 0;
	var correctAnswersList = [];
	var incorrectAnswersList = [];    

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
			alert("You answered: " + $scope.correctAnswers + "correctly");
		}
	} // private;



	var choiceSelection = {
		userAnswers: [],
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
		},
		hasMadeAChoice: function() {
			if (choiceSelection.userAnswers.length === 0) {
				return true;
			}
		}
	};

	$scope.addQuestion = addQuestion; // make the addQuestion public to the view

	$scope.hasMadeAChoice = choiceSelection.hasMadeAChoice;

	$scope.hasAnswers = choiceSelection.hasAnsweredOnce;

	$scope.setSelection = choiceSelection.setSelection;

	$scope.isActive = choiceSelection.isActive;

	

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