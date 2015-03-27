(function () {

	angular
		.module('myQuiz')
		.controller('HomeController', ['$scope', '$location', 'User', HomeController]);

	function HomeController($scope, $location, User) {

		$scope.test = "Login to start the quiz";

		$scope.user;
		$scope.name;

		function startQuiz (name) {
			setUserName(name);
			return $location.path('/quiz');
		}

		function setUserName(name) {
			User.name = name;
		}

		
		function onKeyDown(event, name) {
			console.log(event);
			if (event.keyCode === 13 && $scope.name.length > 2) {
				startQuiz(name);
			} 
		}


		$scope.startQuiz = startQuiz;
		$scope.onKeyDown = onKeyDown;
	};

})(); 
