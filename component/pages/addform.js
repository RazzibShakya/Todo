import React, { useContext, useEffect, useState } from 'react';
import { Color } from '../color';
import { StyleSheet, Text, View, CheckBox, ActivityIndicator, Picker } from 'react-native';
import { Image, Input, Button } from 'react-native-elements';
import Headers from './header';
import Constants from 'expo-constants';
import Axios from 'axios';
import Toast from 'react-native-simple-toast';
import { URL } from '../config'
import UserContext from '../../context'
export default class Login extends React.Component {
  static contextType = UserContext;

  state = {
  }
  onChange = (data) => {
    this.setState(data);
  }
  onSubmitTodo = () => {
    const payload = { Title: this.state.title, Type: this.state.check ? 'critical' : 'normal', Assignedto: this.state.assigne }
    console.warn(payload);

    Axios.post(`${URL}/registertodo`, payload).then((response) => {
      Toast.show(response.data.message, Toast.LONG)
      this.setState({ assigne: '', title: '', check: false });

    }).catch((err) => {
      Toast.show(err, Toast.LONG)
    })

  }


  changeCheck = () => {
    console.log('hit');

    this.setState({ check: !this.state.check })
  }


  render() {
    const type = this.props.navigation.getParam('type', '');
    const data = this.props.navigation.getParam('data', '');
    const todo = this.props.navigation.getParam('todos', '');
    const account = this.props.navigation.getParam('account', '');



    return (
      <View style={{ flex: 1 }}>
        <Headers goBack={this.props.navigation.goBack} add={true} navigate={this.props.navigation.navigate} label={this.props.navigation.getParam('title', 'Add New')} leftIcon="arrow-back" />
        <View style={styles.form_wrapper}>
          {type === 'members' ?
            <AddMembers data={data}
              navigation={this.props.navigation}
            />
            :
            <AddForm
              navigation={this.props.navigation}
              params={this.props.navigation.getParam('title', '')}
              todos={todo}
              account={account}
            />
          }


        </View>
      </View>
    );
  }
}
const AddForm = (props) => {
  const { todos, account } = props;
  const { listUsers, isAdmin, getisAdmin, fetchAccounts, fetchTodos } = useContext(UserContext);
  const [state, setState] = useState(todos ? todos : account)
  const [check, setCheck] = useState(state.Type === 'critical' ? true : false)


  const onChange = ({ col, value }) => {
    setState({ ...state, [col]: value })
  }

  const onSubmitTodo = (type) => {
    const payload = { Title: state.Title, Type: check ? 'critical' : 'normal', Assignedto: state.Assignedto }
    console.warn(payload);
    if (type === 'add') {
      Axios.post(`${URL}/registertodo`, payload).then((response) => {
        setState({ Assignedto: '', Title: '', check: false });
        Toast.show(response.data.message, Toast.LONG)
        fetchTodos();
        fetchTodos('critical');

        props.navigation.goBack();

      }).catch((err) => {
        console.warn(err);

      })
    } else {

      Axios.put(`${URL}/updatetodo/${state._id}`, payload).then((response) => {
        setState({ Assignedto: '', Title: '', check: false });
        Toast.show(response.data.message, Toast.LONG)
        fetchTodos();
        fetchTodos('critical');

        props.navigation.goBack();

      }).catch((err) => {
        console.warn(err);

      })

    }
  }


  const onSubmitAccount = (type) => {
    const data = { Title: state.Title, Amount: state.Amount, Type: state.Type };
    if (type === 'add') {
      Axios.post(`${URL}/registeraccount`, data).then((response) => {
        Toast.show(response.data.message, Toast.LONG)
        setState({ amount: '', acTitle: '', Type: '' });
        fetchAccounts('income');
        fetchAccounts('expense');
        fetchAccounts();
        props.navigation.goBack();
      }).catch((err) => {
        Toast.show(err, Toast.LONG)
      })
    } else {
      Axios.put(`${URL}/updateaccount/${state._id}`, data).then((response) => {
        Toast.show(response.data.message, Toast.LONG)
        fetchAccounts('income');
        fetchAccounts('expense');
        fetchAccounts();
        props.navigation.goBack();
      }).catch((err) => {
        Toast.show(err, Toast.LONG)
      })
    }
  }


  useEffect(() => {
    console.warn(listUsers);
    console.warn(state);

  }, [])

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {(props.params === 'Add new  todos' || props.params === 'Update Todos') ?
        <View >
          <Input
            inputStyle={{ paddingLeft: 10 }}
            inputContainerStyle={{ backgroundColor: Color.light, borderBottomWidth: 0 }}
            containerStyle={{ marginBottom: 15 }}
            placeholder='Enter todo title'
            // label="Todo Title"
            value={state.Title}
            onChangeText={(text) => onChange({ col: 'Title', value: text })}
          />
          <Picker
            selectedValue={state.Assignedto}
            style={{ borderRadius: 1, marginLeft: 10, marginBottom: 10, width: 350, backgroundColor: Color.light }}
            onValueChange={(itemValue, itemIndex) => onChange({ col: 'Assignedto', value: itemValue })}>
            <Picker.Item label="Choose assigne" value="" />
            {
              listUsers.map((value, index) => (
                <Picker.Item label={value.Username} value={value.Username} />
              ))
            }
          </Picker>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 }}>
            <CheckBox
              title='Critical Task'
              style={{ marginLeft: 15 }}
              checked={check}
              value={check}
              onValueChange={() => setCheck(!check)}
            />
            <Text style={{ fontSize: 16 }}>Critical Task</Text>
          </View>
          <Button
            title={props.params === 'Update Todos' ? "Update Todo" : 'Add Todo'}
            onPress={() => props.params === 'Update Todos' ? onSubmitTodo('update') : onSubmitTodo('add')}
            disabled={state.Title && state.Assignedto ? false : true}
            buttonStyle={{ backgroundColor: Color.danger, padding: 10, width: 90, marginLeft: 10 }}
          />
        </View>
        :
        <View style={{ flex: 1 }}>
          <Input
            inputStyle={{ paddingLeft: 10 }}
            inputContainerStyle={{ backgroundColor: Color.light, padding: 4, borderBottomWidth: 0 }}
            containerStyle={{ marginBottom: 15 }}
            onChangeText={(text) => onChange({ col: 'Title', value: text })}
            placeholder='Enter Title'
            value={state.Title}
          // label="Todo Title"
          />
          <Input
            inputStyle={{ paddingLeft: 10 }}
            inputContainerStyle={{ backgroundColor: Color.light, padding: 4, borderBottomWidth: 0 }}
            containerStyle={{ marginBottom: 15 }}
            onChangeText={(text) => onChange({ col: 'Amount', value: text })}
            placeholder='Enter Amount'
            keyboardType='number-pad'
            value={state.Amount ? `${state.Amount}` : state.Amount}
          // label="Todo Title"
          />

          <Picker
            selectedValue={state.Type}
            style={{ borderRadius: 1, marginLeft: 10, marginBottom: 10, width: 350, backgroundColor: Color.light }}
            onValueChange={(itemValue, itemIndex) => onChange({ col: 'Type', value: itemValue })}>
            <Picker.Item label="Choose Type" value="" />
            <Picker.Item label="Income" value="income" />
            <Picker.Item label="Expense" value="expense" />
          </Picker>
          <Button
            title={props.params === 'Update Account' ? 'Update Account' : 'Add Account'}
            onPress={() => props.params === 'Update Account' ? onSubmitAccount('update') : onSubmitAccount('add')}
            disabled={state.Title && state.Amount ? false : true}
            buttonStyle={{ backgroundColor: Color.danger, padding: 10, width: 90, marginLeft: 10 }}
          />
        </View>
      }
    </View >
  )
}

const AddMembers = (props) => {
  const { data } = props;
  const { fetchUsers } = useContext(UserContext);


  const [state, setState] = useState({})

  const onChangeText = ({ value, col }) => {
    setState({ ...state, [col]: value });
  }

  useEffect(() => {
    if (data) {
      setState(data)
    }
  }, [])

  const onClick = ({ type }) => {
    switch (type) {
      case 'update':
        console.warn('update');
        console.warn(state._id);
        const payload = { Username: state.Username, Contact: state.Contact, Usertype: state.Usertype };
        Axios.put(`${URL}/updateuser/${state._id}`, payload).then((resp) => {
          const { status, message } = resp.data;
          if (status) {
            Toast.show(message, Toast.LONG);
            fetchUsers();
            props.navigation.goBack();
          }
        }).catch((err) => {
          Toast.show(err, Toast.LONG)
        })

        break;
      case 'add':
        console.warn(type);
        const data = { Username: state.Username, Contact: state.Contact, Usertype: state.Usertype, Password: state.Password };
        Axios.post(`${URL}/registeruser`, data).then((resp) => {
          const { status, message } = resp.data;
          if (status) {
            Toast.show(message, Toast.LONG);
            fetchUsers();
            props.navigation.goBack();
          }
        }).catch((err) => {
          Toast.show(err, Toast.LONG)
        })

        break;
      default:
        console.warn('default');
    }
  }
  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Input
        placeholder='Please Enter the Name'
        label='Full Name'
        labelStyle={styles.labelStyle}
        value={state.Username}
        onChangeText={(text) => onChangeText({ value: text, col: 'Username' })}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        leftIcon={{ name: 'user', type: 'font-awesome', size: 20, color: 'grey' }}
        leftIconContainerStyle={styles.leftIconStyle}

      />
      <Input
        placeholder='Please Enter the Phone Number'
        label='Phone Number'
        labelStyle={styles.labelStyle}
        value={data ? `${state.Contact}` : state.Contact}
        keyboardType='number-pad'
        onChangeText={(text) => onChangeText({ value: text, col: 'Contact' })}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        leftIcon={{ name: 'phone', type: 'font-awesome', size: 20, color: 'grey' }}
        leftIconContainerStyle={styles.leftIconStyle}

      />

      <Input
        placeholder='Member Type'
        label='Type'
        labelStyle={styles.labelStyle}
        value={state.Usertype}
        onChangeText={(text) => onChangeText({ value: text, col: 'Usertype' })}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        leftIcon={{ name: 'group', type: 'font-awesome', size: 18, color: 'grey' }}
        leftIconContainerStyle={styles.leftIconStyle}

      />
      {
        !data &&
        <Input
          placeholder='Please Enter the Password for the member'
          label='Password'
          labelStyle={styles.labelStyle}
          secureTextEntry={true}
          onChangeText={(text) => onChangeText({ value: text, col: 'Password' })}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
          leftIcon={{ name: 'lock', type: 'font-awesome', size: 20, color: 'grey' }}
          leftIconContainerStyle={styles.leftIconStyle}

        />
      }
      {
        data ?
          <Button
            title='Update Members'
            type='outline'
            titleStyle={{color:'grey'}}
            buttonStyle={{padding:10,borderColor:'grey',marginTop:20}}
            onPress={() => onClick({ type: 'update' })} />
          :
          <Button
            title='Add Members'
            titleStyle={{color:'grey'}}
            buttonStyle={{padding:10,borderColor:'grey',marginTop:20}}
            type='outline'
            onPress={() => onClick({ type: 'add' })} />
      }

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
  },
  inputStyle: {
    fontSize: 15
  },
  containerStyle: {
    marginTop: 10
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  containerStyle: {
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
    borderColor: 'lightgrey',
    borderRadius: 5
  },
  labelStyle: {
    fontSize: 12
  },
  leftIconStyle: {
    marginLeft: 2,
    marginRight: 5
  }
});
