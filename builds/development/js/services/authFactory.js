(function () {
	angular
		.module("myQuiz")
		.factory("Auth", ["$firebaseAuth", 
			"$firebaseObject", "$rootScope", "$location", "$routeParams", "CONSTANTS", "User", function($firebaseAuth, 
				$firebaseObject, routeParams, $rootScope, $location, CONSTANTS, User) {

			var ref = new Firebase(CONSTANTS.FIREBASE_URL);
			var auth = $firebaseAuth(ref);

			auth.$onAuth(function(authUser) {
				if (authUser) {
					var ref = new Firebase(CONSTANTS.FIREBASE_URL + "users/" + authUser.uid);
					var userObject = $firebaseObject(ref); // returns authUser.uid object with all the registered information (date, username etc)
					User.user = userObject;
				} else {
					User.user = {}; // if no user is not logged in, this value becomes empty  
				}
			});

			var myObject = {
				login: function(user) {
					return auth.$authWithPassword({
						email: user.email,
						password: user.password
					});
				}, // login

				logout: function(user) {
					return auth.$unauth();
				}, // logout

				register: function(user) {
					return auth.$createUser({
						email: user.email,
						password: user.password
					}).then(function(regUser) { // When the data is sent to firebase, an object 'regUser' is returned 
						var ref = new Firebase(CONSTANTS.FIREBASE_URL + "users/" + regUser.uid);

					var userInfo = {
							date: Firebase.ServerValue.TIMESTAMP,
							regUser: regUser.uid,
							name: user.name,
							username: user.username,
							email: user.email
						}; // User Info object

						ref.set(userInfo, function(error) {
							if(error) {
								console.log("Error: ", error);
							} else {
								console.log("created profile successfully")
							}
						});

						
					}); 
				}, // register

				requireAuth: function() {
					return auth.$requireAuth();
				}, // require Authentication

				waitForAuth: function() {
					return auth.$waitForAuth();
				} // Wait until the user is authenticated

			}; // myObject

			return myObject;
	}]);
})(); 