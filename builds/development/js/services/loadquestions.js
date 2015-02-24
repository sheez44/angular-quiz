myQuiz.factory('loadQuestions', function($http) {

	var questions = { content: null};

	$http.get('quizdb.json').
		success(function(data) {
			questions = data;
		}).
		error(function(data, status) {
			console.log(data + status);
		});

	return questions;

});