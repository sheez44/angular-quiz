myQuiz.controller('MainController', function($scope, $http) {
	
		 $scope.number = 0;


		$scope.loadQuizData = function() {
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
		        $scope.choices = response.allQuestions[$scope.number].choices;
		      }).error(function(error) {
		        $scope.names = [{
		          "Name": "Errrrrrr"
		        }];
		      });
		    };

		function addQuestion() {
			if ($scope.number < 9) {
				console.log($scope.number);
				$scope.number += 1;
			} else {
				$scope.number = 0;
			}

		}
		$scope.addQuestion = addQuestion;

		$scope.$watch('number', function() {
			$scope.loadQuizData();
		});
});