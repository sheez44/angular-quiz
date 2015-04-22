(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", 'User', 'Auth', '$rootScope', MainController]);

	function MainController(CONSTANTS, User, Auth, $rootScope) {	
		
		var vm = this;


		vm.errorMessage;

		$rootScope.$on('$routeChangeError', function() {
			vm.errorMessage = "You are not allowed to view this part of the website!";
		});

		
		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 

		vm.logout = Auth.logout;
	};

})();

