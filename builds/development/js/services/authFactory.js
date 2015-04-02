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
					}).then(function(regUser) { // When the data is sent to firebase, an object 'regUser' is returned 
						var ref = new Firebase(CONSTANTS.FIREBASE_URL + "users/" + regUser.uid);

					var userInfo = {
							date: Firebase.ServerValue.TIMESTAMP,
							regUser: regUser.uid,
							name: user.name,
							username: user.username,
							email: user.email
						}; // User Info object

						console.log(userInfo);

						ref.set(userInfo, function(error) {
							if(error) {
								console.log("Error: ", error);
							} else {
								console.log("created profile successfully")
							}
						});

						
					}); 
				} // register

			}; // myObject

			return myObject;
	}]);
})(); 