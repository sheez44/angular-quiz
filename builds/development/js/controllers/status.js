(function () {
	angular
		.module('myQuiz')
		.controller('StatusController', ['$scope', '$location', 'Auth', StatusController]);

		function StatusController($scope, $location, Auth) {

			$scope.logout = function() {
				Auth.logout();
				$location.path('/');
			} // logout

		} // StatusController

})(); 