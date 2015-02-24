myQuiz.controller('MainController', function($scope, $http) {
	
		$scope.number = 1;

		$scope.loadData = function(number) {
		      $http({
		        url: 'quizdb.json',
		        dataType: 'json',
		        method: 'GET',
		        data: '',
		        headers: {
		          "Content-Type": "application/json"
		        }
		      }).success(function(response) {
		        $scope.question = response.allQuestions[$scope.number].question;
		      }).error(function(error) {
		        $scope.names = [{
		          "Name": "Errrrrrr"
		        }];
		      });
		    };

		$scope.addQuestion = function() {
			$scope.number += 1;
		}

		$scope.$watch('number', function() {
			$scope.loadData();
		});
});