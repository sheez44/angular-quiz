(function () {
	
	angular
    	.module('myQuiz')
  		.directive('quiz', function() {
  			return {
  				restrict: 'E',
  				scope: {
  					quiz: '='
  				},
  				templateUrl: 'js/directives/thequiz.html'
  			}
  	});

})(); 