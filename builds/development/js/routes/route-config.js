angular
	.module('myQuiz')
	.config(config);

function config($routeProvider) {
	$routeProvider.
		when('/quiz', {
			templateUrl: 'partials/quiz.html',
			controller: 'QuizController'
		}).
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'HomeController',
			controllerAs: 'vm'
		}).
		otherwise({
			redirectTo: '/home'
		});
}