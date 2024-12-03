import {Alert} from 'react-native';

export const handleDealPress = props => {
  props.navigation.navigate('Deal', {props: props});
  Alert.alert(JSON.stringify(props?.item?.name ?? ''));
};
