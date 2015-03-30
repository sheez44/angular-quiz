(function () {
	angular
		.module("myQuiz")
		.factory("fireTest", ["$firebaseArray",

		function($firebaseArray) {
			var randomRoomId = Math.round(Math.random() * 10000000);
			var ref = new Firebase("https://angularquiz.firebaseio.com/Users/" + randomRoomId);

			return $firebaseArray;
		}
		]);
})(); 