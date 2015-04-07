(function () {
	
	angular
		.module('myQuiz')
		.controller('RegistrationController', ['$rootScope', '$scope', '$location', 'Auth', RegController]);

	function RegController($rootScope, $scope, $location, Auth) {

		$rootScope.currentUser = "afcart1";

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

	}

})(); 

// 3:55