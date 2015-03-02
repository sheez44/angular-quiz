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
	        $scope.correctAnswer = response.allQuestions[$scope.number].correctAnswer;
	      }).error(function(error) {
	        $scope.names = [{
	          "Name": "Errrrrrr"
	        }];
	      });
	    };

	$scope.correctAnswers = 0;
	var incorrectAnswers = 0;
	var correctAnswersList = [];
	var incorrectAnswersList = [];    

	function addQuestion() {
		if ($scope.number < 9) {
			var answer = choiceSelection.userAnswers.pop();
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
			alert("You answered: " + $scope.correctAnswers + "correctly");
		}
	} // private;

	$scope.isSelected = false;

	var choiceSelection = {
		userAnswers: [],
		setSelection: function(choice) {
			choiceSelection.userAnswers.push(choice);
			choiceSelection.is
		},
		isSelected: function() {
			if(that.isSelected) {
				return true;
			}
		},
		hasAnsweredOnce: function() {
			if($scope.number !== 0) {
				return true;
			}
		},
		hasMadeAChoice: function() {
			if (choiceSelection.userAnswers.length === 0) {
				return true;
			}
		}
	};

	console.log(choiceSelection);

	$scope.addQuestion = addQuestion; // make the addQuestion public to the view

	$scope.hasMadeAChoice = choiceSelection.hasMadeAChoice;

	$scope.hasAnswers = choiceSelection.hasAnsweredOnce;

	$scope.setSelection = choiceSelection.setSelected;

	$scope.isSelected = choiceSelection.isSelected;

	

	$scope.$watch('number', function() {
		$scope.loadQuizData();
	});	




};	