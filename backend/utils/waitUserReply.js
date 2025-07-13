const { ask, waitForAnswer } = require('../services/websocketService');

 module.exports = function waitUserReply (sid, question) {
   return new Promise((resolve) => {
     waitForAnswer(sid, resolve);   // register resolver first
     ask(sid, question);            // then broadcast the question
   });
 };
