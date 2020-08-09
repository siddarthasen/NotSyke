const {generateRoomID} = require('./groups');
class User {
    constructor(name) {
      this.name = name;
      this.points = 0;
      this.answer = '';
      this.id = generateRoomID().toString(); //used for checking which user was picked 
      this.done = false; //used to check whether all parties have answered
    }
  };

module.exports = User;