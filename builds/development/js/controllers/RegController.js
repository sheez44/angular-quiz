(function () {
	
	angular
		.module('myQuiz')
		.controller('RegistrationController', ['User', '$scope', '$location', 'Auth', RegController]);

	function RegController(User, $scope, $location, Auth) {

		$scope.user = User;

		$scope.login = function () {
			Auth.login($scope.user) // user object contains user.email and user.password
			.then(function(user) {
				$location.path('/quiz');
			}).catch(function(error) {
				$scope.message = error.message;
			});
		} // login

		$scope.register = function() {
			Auth.register($scope.user)
			.then(function(user) {
				Auth.login($scope.user);
				$location.path('/quiz');
			}).catch(function(error) {
				$scope.message = error.message;
			});
		} // register

		$scope.resumeQuiz = function () {
			$location.path('/quiz');
		}

	}

})(); 

// 3:55