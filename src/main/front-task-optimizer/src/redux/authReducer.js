const initialState = {
    currentUser: null
};

function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                currentUser: null
            };
        default:
            return state;
    }
}

export default authReducer;