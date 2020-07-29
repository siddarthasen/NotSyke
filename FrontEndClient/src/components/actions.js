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

export const nextQuestion = (room, socket, callback) => async dispatch => {
    socket.emit('ready', {room: room})
    dispatch({type: 'WAITING_PLAYERS'})
    socket.on('next_question', (response) => {
        dispatch({type: 'START_GAME', payload: response.start})
        if(callback)
        {
            callback(response.start)
        }
    })   
}

export const requestPrompt = (room, socket) => async dispatch => {
    socket.emit('requestPrompt', {room: room})
    socket.on('sentPrompt', (response) => {
        dispatch({type: 'DISPLAY_QUESTION', payload: response.question})
    })
}

/* Answer written by the user. */
export const sendAnswer = (room, name, answer, socket) => async dispatch => {
    socket.emit('submitAnswer', {room: room, name: name, answer: answer})
}

/* Best choice answer chosen by the person. */
export const sendChoice = (room, userID, socket) => async dispatch => {
    dispatch({type: 'WAITING_PLAYERS'})
    socket.emit('sendChoice', {room: room, userID: userID})
}
