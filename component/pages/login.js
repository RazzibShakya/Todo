import React, { useState, useContext, useEffect } from 'react';
import { Color } from '../color';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native';
import { Image, Icon, Input, Button } from 'react-native-elements';
import Logo from '../../assets/logo.png';
import Constants from 'expo-constants';
import { URL } from '../config'
let API_KEY = '76aaa01327bb418fa81fca52825bded1';
// import FootballData from 'footballdata-api-v2';
// const footballData = new FootballData(API_KEY);
// let URL = 'http://api.football-data.org/v2/competitions/2021/matches'; //epl
let url = "http://api.football-data.org/v2/matches?status=LIVE"
import Axios from 'axios';
import Toast from 'react-native-simple-toast';
import UserContext from '../../context'

export default class Login extends React.Component {
  static contextType = UserContext;

  componentWillMount() {
    this.context.getisSession();
    if (this.context.isSession.valid) {
      this.props.navigation.navigate('Home');

    }

  };



  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.statusBar} />
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <View style={styles.header}>
              <Image source={Logo} PlaceholderContent={<ActivityIndicator />} style={{ width: 150, height: 80 }} />
            </View>
          </View>
          <View style={styles.form_wrapper}>
            <LoginForm navigate={this.props.navigation.navigate} />
          </View>
        </View>
      </View>
    );
  }
}

const LoginForm = (props) => {

  const { isSession } = useContext(UserContext);

  const [input, setInput] = useState({});
  const [visiblePassword, setVisible] = useState(true);

  useEffect(() => {
    // console.warn(isSession);

  }, [])


  const changeText = ({ value, col }) => {
    setInput({ ...input, [col]: value });
  }

  const clickLogin = () => {
    const payload = { Contact: input.phone, Password: input.password }
    Axios.post(`${URL}/login`, payload).then((response) => {
      console.warn(response);

      const { message, status, token, userdata } = response.data;
      if (status) {
        Toast.show(message, Toast.LONG)
        props.navigate('Home');
        AsyncStorage.setItem('token', JSON.stringify({ token, userdata }));
      } else {
        Toast.show(message, Toast.LONG);
        setInput({ phone: '', password: '' });
      }
    }).catch((err) => {
      console.warn(err);
    })
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 1, flexDirection: 'row', }}>
        {/* <Icon name="lock"/> */}
        <Text style={{ marginLeft: 0, fontSize: 25, fontWeight: 'bold' }}>Employee Login </Text>
      </View>
      <View style={{ flex: 8, alignItems: 'stretch', flexDirection: 'column', width: 300, }}>
        <Input
          inputStyle={{ paddingLeft: 10 }}
          inputContainerStyle={{ backgroundColor: Color.light, padding: 4 }}
          containerStyle={{ marginBottom: 15 }}
          placeholder='Phone '
          leftIcon={{ type: 'font-awesome', color: 'grey', size: 20, name: 'envelope' }}
          keyboardType='number-pad'
          onChangeText={(value) => changeText({ value: value, col: 'phone' })}
        // label="Enter Username"
        />

        <Input
          inputContainerStyle={{ backgroundColor: Color.light, padding: 4 }}
          containerStyle={{ marginBottom: 15 }}
          inputStyle={{ paddingLeft: 10 }}
          placeholder='Password'
          secureTextEntry={visiblePassword}
          rightIcon={
            <TouchableOpacity onPress={() => setVisible(!visiblePassword)
            } >
              <Icon
                name={visiblePassword ? 'eye-slash' : 'eye'}
                color='grey'
                type='font-awesome' />
            </TouchableOpacity>
          }
          leftIcon={{ type: 'font-awesome', color: 'grey', size: 20, name: 'unlock' }}
          onChangeText={(value) => changeText({ value: value, col: 'password' })}

        // label="Enter Password"
        />
        <Button
          title="Login"
          onPress={clickLogin}
          buttonStyle={{ backgroundColor: Color.danger, padding: 14, width: 280, marginLeft: 10 }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: Color.danger,
    height: Constants.statusBarHeight,
    opacity: 1
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    color: Color.danger,
    fontWeight: 'bold'
  },
  wrapper: {
    flexDirection: 'row', flex: 2, paddingTop: 20,
    backgroundColor: Color.danger,
    //  borderBottomColor: 'grey',
    //  borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  form_wrapper: {
    paddingTop: 30,
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
