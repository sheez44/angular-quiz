(function () {

	angular
		.module('myQuiz')
		.controller('HomeController', ['$scope', '$location', 'User', 'fireTest', HomeController]);

	function HomeController($scope, $location, User, fireTest) {

		// var ref = new Firebase("https://angularquiz.firebaseio.com/");

		// $scope.profile = $firebaseObject(ref);

		// $scope.profile.$loaded().then(function() {
		// 	// $scope.profile.Users.test = "test";
		// 	// $scope.profile.$save();
		// 	console.log($scope.profile);
		// });

		$scope.testUser = "Guest " + Math.round(Math.random() * 100);

		$scope.messages = fireTest;

		$scope.addMessage = function() {
			$scope.messages.$add({
				from: $scope.user,
				content: $scope.message,
				timestamp: Firebase.ServerValue.TIMESTAMP
			});

			$scope.message = '';
		};

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
