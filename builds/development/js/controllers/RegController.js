(function () {
	
	angular
		.module('myQuiz')
		.controller('RegistrationController', ['$scope', '$location', 'Auth', RegController]);

	function RegController($scope, $location, Auth) {

		$scope.login = function () {
			Auth.login($scope.user) // user object contains user.email and user.password
			.then(function(user) {
				console.log(user);
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

	}

})(); 

// 3:55