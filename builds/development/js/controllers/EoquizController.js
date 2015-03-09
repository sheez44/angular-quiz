(function () {
	
	angular
		.module('myQuiz')
		.controller('EoquizController', ['$scope', 'Data', EoquizController]);

	function EoquizController($scope, Data) {

		$scope.scores = Data.scores;

	}

})(); 