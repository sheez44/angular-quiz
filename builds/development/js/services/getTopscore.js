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
						return angular.forEach(userObject, function(key, value) {
							if(value == 'topscore') {
								return value[key];
							} 
						});
					}).
					catch(function(error) {
						console.log("error: " + error);
					});
				}, // getTopscore
				saveTopscore: function() {
					ref.update({ topscore: User.totalCorrect });
				}
			};
		}]);
})(); 