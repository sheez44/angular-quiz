(function () {
	
	angular
		.module('myQuiz')
		.controller('RegistrationController', ['User', '$location', 'Auth', RegController]);

	function RegController(User, $location, Auth) {

		var vm = this;

		vm.user = User;

		vm.login = function () {
			Auth.login(vm.user) // user object contains user.email and user.password
			.then(function(user) {
				$location.path('/');
			}).catch(function(error) {
				vm.message = error.message;
			});
		} // login

		vm.register = function() {
			Auth.register(vm.user)
			.then(function(user) {
				Auth.login(vm.user);
				$location.path('/');
			}).catch(function(error) {
				vm.message = error.message;
			});
		} // register

		vm.resumeQuiz = function () {
			$location.path('/quiz');
		}

	}

})(); 

// 3:55