export const sendLogIn = (type, name, room, socket, history) => async dispatch => {
    try{
    const response = {}
    socket.emit('join', {type: type, name: name, room: room});
    socket.on('user-info', (response) => {
        console.log(response)
        dispatch({type: 'SET_USER_INFO', payload: response})
        history.push('/Waiting', {type: type, name: name, room: room})
    })
    socket.on('waiting-info', (response) => {
        console.log(response)
        dispatch({type: 'RET_LOGIN_INFO', payload: response})
        dispatch({type: 'SET_USER', payload: name})
      })
    socket.on('error1', (response) => {
        console.log(response.error)
        dispatch({type: 'ERROR_CRED', payload: response.error})
      })
    }
    catch(err){
        history.push('/')
    }
      
}

export const startGame = (room, socket, history, callback) => async dispatch => {
    try{
    socket.emit('start_game', {room: room, disconnect: false})
    socket.on('start', (response) => {
        dispatch({type: 'START_GAME', payload: response.start})
        if(callback)
        {
            callback(response.start)
        }
    })   
    }
    catch(err){
        history.push('/')
    }
}

export const nextQuestion = (room, socket, history, name, callback) => async dispatch => {
    try{
    socket.emit('ready', {room: room, disconnect: false, name: name});
    dispatch({type: 'WAITING_PLAYERS'});
    socket.on('next_question', (response) => {
        dispatch({type: 'START_GAME', payload: response.start})
        if(callback)
        {
            callback(response.start)
        }
    })  
    }
    catch(err){
        history.push('/')
    } 
}

export const requestPrompt = (room, socket, history) => async dispatch => {
    try{
    socket.emit('requestPrompt', {room: room})
    socket.on('sentPrompt', (response) => {
        dispatch({type: 'DISPLAY_QUESTION', payload: response.question})
    })
}
catch(err){
    history.push('/')
}
}

/* Answer written by the user. */
export const submitAnswer = (room, name, answer, socket, question) => async dispatch => {

    dispatch({type: 'SET_ANSWER_QUESTION', payload: {question: question, answer: answer}})
    socket.emit('submitAnswer', {room: room, name: name, answer: answer, disconnect: false});
}

/* Best choice answer chosen by the person. */
export const chooseAnswer = (room, userID, socket) => async dispatch => {
    dispatch({type: 'WAITING_PLAYERS'});
    socket.emit('chooseAnswer', {room: room, userID: userID, disconnect: false});
}
