myQuiz.controller('HomeController', function($scope, $location) {

	$scope.test = "Click the button to start the quiz";

	function startQuiz () {
		return $location.path('/quiz');
	}

	$scope.startQuiz = startQuiz;

});