const GetUser = user => ({
  type: 'GET_USER',
  payload: user,
});
const UpdatedAccounts = userID => {
  return {
    type: 'UPDATE_ACCOUNTS',
    payload: userID,
  };
};

const GetAccount = account => ({
  type: 'GET_ACCOUNT',
  payload: account,
});

const GetToken = account => ({
  type: 'GET_TOKEN',
  payload: account,
});

const GetTokenBM = TOKEN => ({
  type: 'GET_TOKEN_BM',
  payload: TOKEN,
});

const SetTouchID = State => ({
  type: 'SET_TOUCH_ID',
  payload: State,
});
const IsSupported = State => ({
  type: 'IS_SUPPORTED',
  payload: State,
});

const GetLabels = LABELS => ({
  type: 'GET_LABELS',
  payload: LABELS,
});

const PopUser = () => ({
  type: 'POP_USER',
});

const ResetBMT = () => ({
  type: 'RESET',
});

export {
  SetTouchID,
  GetLabels,
  GetTokenBM,
  PopUser,
  GetUser,
  GetAccount,
  GetToken,
  IsSupported,
  ResetBMT,
  UpdatedAccounts,
};
