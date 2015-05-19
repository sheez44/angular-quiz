(function() {

  angular
    .module('myQuiz')
    .factory('QuestionService', ['$http', '$q',
      function($http, $q) {

        return {

          getQuestion: function(number) {

            var def = $q.defer();

            $http.get("quizdb.json")
              .success(function(data) {
                // resolve the data by returning the question, choices and correctanswer in an object
                def.resolve({
                  totalQuestions: data.allQuestions.length,
                  question: data.allQuestions[number].question,
                  choices: data.allQuestions[number].choices,
                  correctAnswer: data.allQuestions[number].correctAnswer,
                  index: number
                });
              })
              .error(function() {
                def.reject("failed to retrieve questions");
              });
            return def.promise;
          },

          getAllQuestions: function() {
            var def = $q.defer();

            $http.get("quizdb.json")
              .success(function(data) {
                // resolve the data by returning the question, choices and correctanswer in an object
                def.resolve(
                  data.allQuestions
                );
              })
              .error(function() {
                def.reject("failed to retrieve questions");
              });
            return def.promise;
          },

          getIndexQuestion: function(qNumber, answer) {
            return $http.get("quizdb.json")
              .then(function(response) {
                return response.data.allQuestions[qNumber].choices.indexOf(answer);
              }, function(response) {
                return $q.reject(response.data);
              });
          },
          getCorrectAnswer: function(index) {
            return $http.get('quizdb.json')
              .then(function(response) {
                  return response.data.allQuestions[index].correctAnswer;
                },
                function(response) {
                  return $q.reject(response.data);
                });
          }
        };

      }
    ]);

})();