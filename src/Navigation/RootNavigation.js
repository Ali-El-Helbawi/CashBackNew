import * as React from 'react';

export const navigationRef = React.createRef();
export const routeNameRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function back() {
  navigationRef.current?.goBack();
}

export function push(name, params) {
  navigationRef.current?.push(name, params);
}
