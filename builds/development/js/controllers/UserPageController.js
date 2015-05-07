(function () {
	angular
		.module('myQuiz')
		.controller('UserPageController', 
			['User', UserPageController]);

		function UserPageController(User) {

			var vm = this;

			vm.user = User;

			vm.started = function() {
				return User.hasStarted();
			}

			vm.resumeQuiz = function () {
				$location.path('/quiz');
			}

		}
})(); 