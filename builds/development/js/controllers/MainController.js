(function() {

	angular
		.module('myQuiz')
		.controller('MainController', ["CONSTANTS", "$cookies", "$cookieStore", MainController]);

	function MainController(CONSTANTS, $cookies, $cookieStore) {	
		
		vm = this;

		vm.title = CONSTANTS.TITLE;

		vm.user = $cookies.userName;
			 
	};

})();

