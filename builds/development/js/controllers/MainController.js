(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", 'User', MainController]);

	function MainController(CONSTANTS, User) {	
		
		vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 
	};

})();

