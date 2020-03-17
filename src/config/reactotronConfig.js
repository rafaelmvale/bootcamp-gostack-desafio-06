import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure()
  //Com USB
  //const tron = Reactotron.configure({host: 'ip da maquina'})
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
