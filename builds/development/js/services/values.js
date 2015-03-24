(function () {
	
	angular
		.module('myQuiz')
		// Ask for username which will displayed during quiz
		.value("User", {
			name: ""
		})
		.value("CurrentQuestion", {
			question: 0
		})
})(); 