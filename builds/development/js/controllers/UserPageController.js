(function () {
	angular
		.module('myQuiz')
		.controller('UserPageController', 
			['User', '$location', 'Topscore', UserPageController]);

		function UserPageController(User, $location, Topscore) {

			var vm = this;

			vm.user = User;

			var userid = User.user.$id;

			var test = Topscore.getTopscore(userid).then(function(topscore) {
				vm.topscore = topscore;
				console.log(vm.topscore);
			});

			vm.hasStarted = function() {
				return User.hasStarted;
			}

			vm.resumeQuiz = function () {
				$location.path('/quiz');
			}

		}
})(); 