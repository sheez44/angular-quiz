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
			when('/', {
				templateUrl: 'partials/home.html',
				controller: 'RegistrationController'
			}).
			when('/register', {
				templateUrl: 'partials/register.html',
				controller: 'RegistrationController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}

})(); 