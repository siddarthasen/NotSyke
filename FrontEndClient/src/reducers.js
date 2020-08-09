//socket logic will go here (maybe depending on Harry's redux skills)


const initalState = {
    messages: [],
    members: [],
    socket: {},
    roomID: '',
    start: false,
    creator: false,
    loading: false,
    error: ''
}

function reducer(state=initalState, action) {
    switch(action.type){
        case 'RET_LOGIN_INFO':
            return{...state, members: action.payload.members, roomID: action.payload.roomID}
        case 'ERROR_CRED':
            return{...state, error: action.payload}
        case 'SET_SOCKET':
            return{...state, socket: action.payload}
        case 'START_GAME':
            return{...state, start: action.payload, loading: false}
        case 'DISPLAY_QUESTION':
            return{...state, question: action.payload, loading: false}
        case 'SET_CREATOR':
                return{...state, creator: action.payload}
        case 'RESET_USER':
                return{initalState}
        case 'WAITING_PLAYERS':
                return{...state, loading: true}
        case 'PASS_SCREEN':
                return{...state, loading:false}
        default: 
            return{...state}
    }

}
export default reducer