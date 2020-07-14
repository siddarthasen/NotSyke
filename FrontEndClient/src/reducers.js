//socket logic will go here (maybe depending on Harry's redux skills)


const initalState = {
    messages: [],
    members: [],
    socket: {},
    roomID: '',
    start: false
}

function reducer(state=initalState, action) {
    switch(action.type){
        case 'RET_LOGIN_INFO':
            return{...state, members: action.payload.members, roomID: action.payload.roomID}
        case 'SET_SOCKET':
            return{...state, socket: action.payload}
        case 'START_GAME':
            return{...state, start: action.payload}
        case 'DISPLAY_QUESTION':
            return{...state, question: action.payload}
        default: 
            return{...state}
    }

}
export default reducer