//socket logic will go here (maybe depending on Harry's redux skills)


const initalState = {
    signIn: false,
    messages: [],
    members: []
}

function reducer(state=initalState, action) {
    switch(action.type){
        case "CHECK_LOGIN":
            return{...state, signIn: action.payload}
        default: 
            return{...state}
    }

}
export default reducer