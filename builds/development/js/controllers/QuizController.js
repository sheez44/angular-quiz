angular
	.module('myQuiz')
	.controller('QuizController', QuizController);

function QuizController ($scope, $http) {

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
	} // private;

	var choiceSelection = {
		isSelected: false,
		userAnswers: [],
		setSelection: function(choice) {
			this.userAnwers.push(choice);
		},
		isSelection: function() {
			if(this.isSelected === true) {
				return true;
			}
		}
	}

	$scope.setSelection = choiceSelection.setSelection;

	$scope.isSelection = choiceSelection.isSelection;

	$scope.addQuestion = addQuestion; // make the addQuestion public to the view

	$scope.$watch('number', function() {
		$scope.loadQuizData();
	});	

};	