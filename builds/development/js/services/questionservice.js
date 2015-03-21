(function () {
	
	angular
		.module('myQuiz')
		.factory('QuestionService', ['$http', '$q', function($http, $q) {

			var currentNumber = 0;

			return {

				getQuestion: function() {	

				var def = $q.defer();

				$http.get("quizdb.json")
					.success(function(data) {
						def.resolve(data.allQuestions[currentNumber]);
					})
					.error(function() {
						def.reject("failed to retrieve questions");
					});
				return def.promise;	
				},
				getCurrentNumber: function() {
					return currentNumber;
				},
				nextQuestion: function() {
					currentNumber += 1;
				}
			};
	}]);

})(); 