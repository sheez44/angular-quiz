var myQuiz = angular.module('myQuiz', ['ngRoute', 'ngAnimate']);

myQuiz.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/quiz', {
				templateUrl: 'partials/quiz.html',
				controller: 'QuizController'
			}).
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController'
			}).
			otherwise({
				redirectTo: '/home'
			});
	}]);