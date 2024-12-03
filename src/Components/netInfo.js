import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Internet from './noInternet';
import NetInfo from '@react-native-community/netinfo';
import {Translate, Font} from '../Helpers';
import {SecondBlue} from '../assets/colors';
const {width} = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.lottieContainer}>
          <Internet width={width} />
        </View>
        <Text style={styles.message}>
          {Translate('NO INTERNET CONNECTION')}
        </Text>
        <Text style={styles.subMessage}>
          {Translate('Please check your internet connection and try again')}
        </Text>
      </View>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  constructor() {
    super();
    this.state = {
      connected: true,
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connected: state.isConnected});
    });
  }
  componentWillUnMount() {
    this.unsubscribe();
  }

  render() {
    if (!this.state.connected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    zIndex: 999,
    top: 0,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    paddingTop: '20%',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    fontFamily: Font,
    fontSize: 20,
    color: SecondBlue,
    textAlign: 'center',
  },
  subMessage: {
    fontFamily: Font,
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
  lottieContainer: {
    width: width,
    height: 300,
  },
});

export default OfflineNotice;
