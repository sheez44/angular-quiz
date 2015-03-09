angular
	.module('myQuiz')
	.controller('QuizController', ['$scope','$http', '$animate', 'Data', '$location', QuizController]);

function QuizController ($scope, $http, $animate, Data, $location) {

	$scope.number = Data.number;

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
	        $scope.correctAnswer = response.allQuestions[$scope.number].correctAnswer;
	      }).error(function(error) {
	        $scope.names = [{
	          "Name": "Errrrrrr"
	        }];
	      });
	    };

	$scope.correctAnswers = Data.correctAnswers;
	var incorrectAnswers = Data.incorrectAnswers;
	var correctAnswersList = Data.correctAnswersList;
	var incorrectAnswersList = Data.incorrectAnswersList;    

	function addQuestion() {
		if ($scope.number < 9) {
			var answer = choiceSelection.userAnswers.pop();
			$scope.selected = undefined;
			if (answer === $scope.correctAnswer) {
				$scope.correctAnswers += 1;
				correctAnswersList.push(answer);
				choiceSelection.userAnswer = [];
			} else {
				incorrectAnswers += 1;
				incorrectAnswersList.push(answer);
				choiceSelection.userAnswer = [];
			}
			$scope.number += 1;
		} else {
			$location.path('/endofquiz');
		}
	} // private;

	var choiceSelection = {

		setSelection: function(choice) {
			choiceSelection.userAnswers.push(choice);
			$scope.selected = choice;
		},
		isActive: function(choice) {
			return $scope.selected === choice;
		},
		hasAnsweredOnce: function() {
			if($scope.number !== 0) {
				return true;
			}
		}

	}



	$scope.addQuestion = addQuestion; // make the addQuestion public to the view

	$scope.hasMadeAChoice = Data.hasMadeAChoice;

	$scope.setSelection = choiceSelection.setSelection;

	$scope.isActive = choiceSelection.isActive;

	$scope.hasAnsweredOnce = choiceSelection.hasAnsweredOnce;

	$scope.$watch('number', function() {
		$scope.loadQuizData();
	});	

};	