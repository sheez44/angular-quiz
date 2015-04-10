(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", 'User', 'Auth', MainController]);

	function MainController(CONSTANTS, User, Auth) {	
		
		var vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 

	};

})();

