(function () {
	angular
		.module("myQuiz")
		.factory("Auth", ["$firebaseAuth", 
			"$firebase", "$location", "$routeParams", "CONSTANTS", function($firebaseAuth, 
				$firebase, routeParams, $location, CONSTANTS) {
			
			var ref = new Firebase(CONSTANTS.FIREBASE_URL);
			var auth = $firebaseAuth(ref);

			var myObject = {
				login: function(user) {
					return auth.$authWithPassword({
						email: user.email,
						password: user.password
					});
				}, // login

				register: function(user) {
					return auth.$createUser({
						email: user.email,
						password: user.password
					});
				} // register

			}; // myObject

			return myObject;
	}]);
})(); 