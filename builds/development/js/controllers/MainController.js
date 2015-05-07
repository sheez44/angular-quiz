(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["$location", "CONSTANTS", 'User', 'Auth', 'QuestionService', MainController]);

	function MainController($location, CONSTANTS, User, Auth, QuestionService) {	
		
		var vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = User;	 

		vm.logout = function() {

			Auth.logout();
			$location.path('/login')
		}
	};

})();

