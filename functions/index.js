const functions = require('firebase-functions');
const admin = require('firebase-admin');
const max_limit = 10;
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

exports.webhook = functions.https.onRequest((request, response) => {

        console.log("parameters: ", request.body.result.parameters);
        let params  = request.body.result.parameters;
        let numbers = params.numbers;

        console.log(request.body.result.action);
        switch(request.body.result.action){
          case 'sum':
              numbers = numbers.reduce(sum,0);
              send();
            break;
          case 'subtract':
              numbers = numbers.reduce(subtract);
              send();
            break;
          case 'multiply':
              numbers = numbers.reduce(multiply);
              send();
            break;
          case 'divide':
              numbers = numbers.reduce(divide);
              send();
            break;
          case 'test_basic_addition':
              numbers1 = getRandomInt(0,max_limit)
              numbers2 = getRandomInt(0,max_limit)
              response.send({
                  speech:
                      `what is the result of sum ${numbers1} to ${numbers2}?`,
                  followupEvent: {
                      name: "test_mode_addition",
                      parameters: {
                          "numbers1": numbers1,
			  "numbers2": numbers2
                      }
                  },
                  contextOut: [
  		  {
  		     name: "test_mode_addition-followup",
    		     lifespan: 1,
    		     parameters: {
                         "numbers1": numbers1,
                         "numbers2": numbers2, 
    		     }
 		 }
		],
              });
            break;
          case 'test_mode_addition.test_mode_addition-result':
              var result = parseInt(params.result);
	      var numbers1 = parseInt(params.numbers1);
	      var numbers2 = parseInt(params.numbers2);
              var sumres = sum(numbers1,numbers2);
              if (result === sumres){
	         response.send({
                    speech:
                       "Correct! Do you want to go to the next question?"
                 });
              }else{
                 response.send({
                    speech:
                       "Incorrect! Do you want to go to the next question?"
                 });}
            break;
          case 'test_mode_addition.next_question':
              response.send({
                  followupEvent: {
                      name: "init_test_addition",
                  }
              });
            break;
        }
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        function sum(x, y){return x + y}
        function subtract(x, y){return x - y}
        function multiply(x, y){return x * y}
        function divide(x, y){return x / y}
        function send(){
          response.send({
                  speech:
                      "The result is " + numbers
              });}
    });
