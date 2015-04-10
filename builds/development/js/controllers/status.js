(function () {
	angular
		.module('myQuiz')
		.controller('StatusController', ['$location', 'Auth', StatusController]);

		function StatusController($location, Auth) {

			var vm = this

			vm.logout = function() {
				Auth.logout();
				$location.path('/');
			} // logout

		} // StatusController

})(); 