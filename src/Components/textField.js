import React, {Component} from 'react';
import {I18nManager} from 'react-native';
import {OutlinedTextField} from 'react-native-material-textfield';

export default class TextField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <OutlinedTextField
        label={this?.props?.label ?? 'From Account'}
        keyboardType={this?.props?.keyboardType ?? 'default'}
        ref={this.props.ref}
        tintColor={'#2F5CCA'}
        labelOffset={I18nManager.isRTL ? {x0: -10, x1: 20} : {x0: 10, x1: -20}}
        style={[
          this.props.labelStyle,
          {paddingLeft: 10},
          [this.props.light && {color: 'darkgrey'}],
        ]}
        renderLeftAccessory={this.props.icon}
        {...this.props}
      />
    );
  }
}
