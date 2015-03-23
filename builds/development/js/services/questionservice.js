(function () {
	
	angular
		.module('myQuiz')
		.factory('QuestionService', ['$http', '$q', function($http, $q) {

			var currentQuestion = 0;

			return {

				getQuestion: function() {	

				var def = $q.defer();

				$http.get("quizdb.json")
					.success(function(data) {
						// resolve the data by returning the question, choices and correctanswer in an object
						def.resolve({
							totalQuestions: data.allQuestions.length,
							question: data.allQuestions[currentQuestion].question,
							choices: data.allQuestions[currentQuestion].choices,
							correctAnswer: data.allQuestions[currentQuestion].correctAnswer
							});
					})
					.error(function() {
						def.reject("failed to retrieve questions");
					});
				return def.promise;	
				},
				getCurrentQuestion: function() {
					return currentQuestion;
				},
				nextQuestion: function() {
					(currentQuestion >= 0) ? currentQuestion += 1 : false; 
				}, 
				prevQuestion: function() {
					(currentQuestion < 0) ? false : currentQuestion -= 1; 
				}
			};
	}]);

})(); 