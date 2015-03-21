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
