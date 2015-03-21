(function () {
	
	angular
		.module('myQuiz')
		.config(config);

	function config($routeProvider) {
		$routeProvider.
			when('/quiz', {
				templateUrl: 'partials/quiz.html',
				controller: 'QuizController',
				controllerAs: 'quiz'
			}).
			when('/endofquiz', {
				templateUrl: 'partials/endofquiz.html',
				controller: 'EoquizController'
			}).
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController',
				controllerAs: 'vm',
				resolve: function (User) {
					$scope.user = User.name;
				}
			}).
			when('/', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
			}).
			otherwise({
				redirectTo: '/home'
			});
	}

})(); 