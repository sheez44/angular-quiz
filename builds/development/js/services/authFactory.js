(function () {
	angular
		.module("myQuiz")
		.factory("Auth", ["$firebaseAuth", "$location", "$rootScope", function($firebaseAuth, $location, $rootScope) {
			var ref = new Firebase("https://angularquiz.firebaseio.com/");

			return {
				createUser: function(email, password) {
					ref.createUser({
						email: email,
						password: password
					}, function(error, userData) {
						if(error) {
							console.log("Error creating user: ", error);
						} else {
							console.log("Succesfully created an account with uid: " + userData.uid);
						}
					});
				},
				loginUser: function(email, password) {
					ref.authWithPassword({
						email: email,
						password: password
					}, function(error, authData) {
						if(error) {
							console.log("Login failed! " + error);
						} else {
							$location.path('#/quiz')
						}
					});
				}
			}
	}]);
})(); 