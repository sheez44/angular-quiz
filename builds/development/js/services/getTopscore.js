(function () {
	angular
		.module('myQuiz')
		.factory('Topscore' , ['$firebaseObject', 'CONSTANTS', 'User', function($firebaseObject, CONSTANTS, User) {
			var ref = new Firebase(CONSTANTS.FIREBASE_URL);
			var userObject = $firebaseObject(ref);

			return {
				getTopscore: function(userid) {
					var ref = new Firebase(CONSTANTS.FIREBASE_URL + 'users/' + userid);
					var userObject = $firebaseObject(ref);

					return userObject.$loaded().then(function() {
						return userObject.topscore;
					}).
					catch(function(error) {
						console.log("error: " + error);
					});
				}, // getTopscore
				saveTopscore: function(correct, userid) {
					var ref = new Firebase(CONSTANTS.FIREBASE_URL + 'users/' + userid);
					var userObject = $firebaseObject(ref);

					ref.update({topscore: correct})

					console.log("topscore successfully updated!")
				}
			};
		}]);
})(); 