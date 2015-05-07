(function () {
	
	angular
		.module('myQuiz')
		.config(config)
		.run(['$rootScope', '$location', function ($rootScope, $location) {
			$rootScope.$on('$routeChangeError', function(event, next, previous, error) {
				if(error === 'AUTH_REQUIRED') { // Whenever an unauthenticated user tries to acces the quiz
					$rootScope.message = 'Sorry, you must log in to acces the quiz'; // this error gets displayed
					$location.path('/');
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
				controller: 'EoquizController',
				controllerAs: 'eo',
				resolve: {
					app: function(User, $q, $location, $rootScope) {
						var defer = $q.defer();
						if(User.quizStatus === true) {
							defer.reject();
							$location.path('/');
						} else {
							return defer.resolve();
						}
						return defer.promise; 
					}
				}
			}).
			when('/login', {
				templateUrl: 'partials/home.html',
				controller: 'RegistrationController',
				controllerAs: 'reg',
			}).
			when('/register', {
				templateUrl: 'partials/register.html',
				controller: 'RegistrationController',
				controllerAs: 'reg'
			}).
			when('/user-page', {
				templateUrl: 'partials/user-page.html',
				controller: 'UserPageController',
				controllerAs: 'user'
			}).
			otherwise({
				redirectTo: '/login'
			});
	}

})(); 
