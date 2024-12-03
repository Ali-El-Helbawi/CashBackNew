import React, {useState, createContext} from 'react';
const DataContext = createContext([{}, () => {}]);
const DataProvider = props => {
  const [page, setPage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [userAccounts, setUserAccounts] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [subPage, setSubPage] = useState('');
  const [fcmToken, setFCMToken] = useState('');
  const [notifications, setNotifications] = useState([]);

  return (
    <DataContext.Provider
      value={{
        page,
        setPage,
        userInfo,
        setUserInfo,
        isLogin,
        setIsLogin,
        userAccounts,
        setUserAccounts,
        fcmToken,
        setFCMToken,
        notifications,
        setNotifications,
        subPage,
        setSubPage,
        showHeader,
        setShowHeader,
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export {DataContext, DataProvider};
