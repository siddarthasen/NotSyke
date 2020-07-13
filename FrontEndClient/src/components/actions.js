export const sendLogIn = (type, name, room, endpoint, socket, io) => async dispatch => {
    const response = {}
    socket.emit('join', {type: type, name: name, room: room});
    socket.on('waiting-info', (response) => {
        console.log(response)
        dispatch({type: 'RET_LOGIN_INFO', payload: response})
      })
      
}

export const startGame = (room, socket, callback) => async dispatch => {
    socket.emit('start_game', {room: room})
    socket.on('start', (response) => {
        dispatch({type: 'START_GAME', payload: response.start})
        if(callback)
        {
            callback(response.start)
        }
    })
    
}
