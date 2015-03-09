(function () {
	
	angular
		.module('myQuiz')
		.config(config);

	function config($routeProvider) {
		$routeProvider.
			when('/quiz', {
				templateUrl: 'partials/quiz.html',
				controller: 'QuizController'
			}).
			when('/endofquiz', {
				templateUrl: 'partials/endofquiz.html',
				controller: 'EoquizController'
			}).
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
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