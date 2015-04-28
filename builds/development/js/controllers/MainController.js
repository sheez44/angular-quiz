(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", 'User', 'Auth', 'QuestionService', MainController]);

	function MainController(CONSTANTS, User, Auth, QuestionService) {	
		
		var vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 

		vm.logout = Auth.logout;
	};

})();

