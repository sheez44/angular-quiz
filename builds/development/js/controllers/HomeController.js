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