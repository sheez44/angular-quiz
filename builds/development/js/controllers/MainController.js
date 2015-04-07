(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", 'User', '$rootScope', 'Auth', MainController]);

	function MainController(CONSTANTS, User, $rootScope, Auth) {	
		
		vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 

	};

})();

