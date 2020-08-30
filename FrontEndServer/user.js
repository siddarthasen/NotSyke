const {generateRoomID} = require('./groups');
class User {
    constructor(name, socket_id) {
      this.name = name;
      this.points = 0;
      this.answer = null;
      this.id = generateRoomID().toString(); //used for checking which user was picked
      this.done = false; //used to check whether all parties have answered
      this.socket_id = socket_id
      this.waiting = false
    }
  };

module.exports = User;
