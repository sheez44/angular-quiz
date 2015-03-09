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
