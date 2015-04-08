(function () {
	
	angular
		.module('myQuiz')
		.config(config)
		.run(['$rootScope', '$location', function ($rootScope, $location) {
			$rootScope.$on('$routeChangeError', function(event, next, previous, error) {
				if(error === 'AUTH_REQUIRED') {
					$rootScope.message = 'Sorry, you must log in to acces that page';
					$location.path('/login');
				}
			});
		}]);

	function config($routeProvider) {
		$routeProvider.
			when('/quiz', {
				templateUrl: 'partials/quiz.html',
				controller: 'QuizController',
				controllerAs: 'quiz',
				resolve: {
					currentAuth: function(Auth) { // checks whether the user is authenticated (has acces) to view this page
						return Auth.requireAuth();
					}
				}
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
