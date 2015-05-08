(function () {
	angular
		.module('myQuiz')
		.controller('UserPageController', 
			['User', '$location', UserPageController]);

		function UserPageController(User, $location) {

			var vm = this;

			vm.user = User;

			vm.hasStarted = function() {
				return User.hasStarted;
			}

			vm.resumeQuiz = function () {
				$location.path('/quiz');
			}

		}
})(); 