var myQuiz = angular.module('myQuiz', []);
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