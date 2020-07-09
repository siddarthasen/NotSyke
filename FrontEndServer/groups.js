const users = [];


//function that i saw in the tutorial. just use some of the elements since we r using a hasmap to store the info
//bascailly here just add the user to the hashamp. create a key if the it is crrator otherise scan throguh the keys to
//find the room
const addUser = ({id, name, room}) =>
{
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();


  const check = users.find((user) => user.room === room && user.name === name)
  if(check)
  {
    return {error: 'Username taken'};
  }

  const user = {id, name, room};
  console.log(user)
  users.push(user)
  return {user}
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

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = {addUser, removeUser, getUser, getUsersInRoom};
