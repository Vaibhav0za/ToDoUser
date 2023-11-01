
const initialState = {
    token: null,
    username: null,
    userid: null,

  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_TOKEN':
        return {
          ...state,
          token: action.payload,
        };
        case 'SET_USER_NAME':
          return {
            ...state,
            username: action.payload,
          };
          case 'SET_USER_ID':
            return {
              ...state,
              userid: action.payload,
            };
        
      default:
        return state;
    }
    
  };
  
  export default authReducer;
  