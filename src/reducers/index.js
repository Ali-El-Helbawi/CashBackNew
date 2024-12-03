import {combineReducers} from 'redux';

const userInfoReducer = (state = false, action) => {
  switch (action.type) {
    case 'GET_USER':
      return action.payload.user.PersonalInfosRow;
    case 'POP_USER':
      return false;
    default:
      return state;
  }
};

const accountsReducer = (state = false, action) => {
  switch (action.type) {
    case 'GET_USER':
      return action.payload.user.Accounts;
    case 'UPDATE_ACCOUNTS':
      return action.payload.Accounts;
    case 'POP_USER':
      return false;
    default:
      return state;
  }
};

const defaultAccountReducer = (defaultAccount = 0, action) => {
  switch (action.type) {
    case 'GET_ACCOUNT':
      return action.payload;
    default:
      return defaultAccount;
  }
};

const tokenReducer = (defaultAccount = '', action) => {
  switch (action.type) {
    case 'GET_TOKEN':
      return action.payload;
    default:
      return defaultAccount;
  }
};

const tokenBMReducer = (
  state = {
    key: '',
    enable: false,
    showPopUp: true,
    isSupported: false,
  },
  action,
) => {
  switch (action.type) {
    case 'SET_TOUCH_ID':
      if (action.payload === true) {
        return {...state, showPopUp: false, enable: action.payload};
      }
      return {...state, showPopUp: false, enable: action.payload};
    case 'GET_TOKEN_BM':
      return {...state, key: action.payload};
    case 'IS_SUPPORTED':
      return {...state, isSupported: action.payload};
    case 'RESET':
      return {
        key: '',
        enable: false,
        showPopUp: true,
        isSupported: false,
      };
    default:
      return state;
  }
};

const labelsReducer = (defaultAccount = '', action) => {
  switch (action.type) {
    case 'GET_LABELS':
      console.log('GET_LABELS', action.payload);
      return action.payload;
    default:
      return defaultAccount;
  }
};

const userReducer = (state = false, action) => {
  switch (action.type) {
    case 'GET_USER':
      return action.payload.user.UsersRow;
    case 'POP_USER':
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  defaultAccount: defaultAccountReducer,
  user: userReducer,
  labels: labelsReducer,
  token: tokenReducer,
  tokenBM: tokenBMReducer,
  userInfo: userInfoReducer,
  accounts: accountsReducer,
});
