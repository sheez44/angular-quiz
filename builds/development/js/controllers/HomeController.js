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