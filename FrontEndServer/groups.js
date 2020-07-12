const users = [];

/* Created User class. @Sid*/
class User {
  constructor(id, name, room) {
    this.id = id;
    this.name = name;
    this.room = room;
  }
}


/* Function that i saw in the tutorial. just use some of the elements since we r using a hasmap to store the info
bascailly here just add the user to the hashamp. create a key if the it is crrator otherise scan throguh the keys to
find the room. */
const addUser = ({id, name, room}) =>
{
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  /* Error Check for bad room. @Sid*/
  const checkRoom = users.find(each => each === room);
  if (!checkRoom) {
    return { error: 'Room does not exist.' };
  }

  const checkUser = users.find((user) => user.room === room && user.name === name)
  if (checkUser)
  {
    return {error: 'Username taken'};
  }

  const user = new User(id, name, room);
  console.log(user)
  users.push(user)
  return {user}
}

const generateRoomID = () => {
  return Math.random().toString(36).slice(2)
  // var ans = ''
  // for (var i = 5; i > 0; i--) { 
  //     console.log(Math.floor(Math.random()).toString())
  //       ans.concat(Math.floor(Math.random()).toString()); 
  // } 
  // console.log(ans)
  // console.log("here")
}

//removed user from the arry. but we need it for the hashmap
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if(index !== -1)
  {
    return users.splice(index, 1)[0];
  }
}
const getUser = (id) => user.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

// const generateRoomCode;

module.exports = {addUser, removeUser, getUser, getUsersInRoom, generateRoomID};
