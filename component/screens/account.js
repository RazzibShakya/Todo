
import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Color } from '../../component/color';
import { Icon, Avatar, Badge, ListItem, Overlay, Button } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import Headers from '../../component/pages/header';
import UserContext from '../../context';
import Moment from 'moment';
import Moments from 'react-moment';

import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
export default class Account extends Component {
  state = {}
  render() {
    return (
      <View style={{ flex: 1, zIndex: 0 }}>
        <Headers params="MY_ACCOUNT" navigate={this.props.navigation.navigate} toggleDrawer={this.props.navigation.toggleDrawer} label="MY ACCOUNTS" leftIcon="account-balance" />
        <TabNavigator screenProps={{ rootnavigation: this.props.navigation.navigate }} />
      </View>
    );
  }
}

const Home = (props) => {
  const { fetchAccounts, allAccount } = useContext(UserContext);

  useEffect(() => {
    fetchAccounts();

  }, [])

  return (
    <DisplayItems account={allAccount.accounts} total={allAccount.total} type='all' totalincomes={allAccount.totalincomes} totalexpenses={allAccount.totalexpenses} navigation={props.screenProps.rootnavigation} />

  )
}
const Income = (props) => {
  const { fetchAccounts, incomeAccount } = useContext(UserContext);
  useEffect(() => {
    fetchAccounts('income');

  }, [])

  return (
    <DisplayItems account={incomeAccount.accounts} total={incomeAccount.totalincomes} type='income' navigation={props.screenProps.rootnavigation} />

  )
}

const Expenses = (props) => {
  const { fetchAccounts, expenseAccount } = useContext(UserContext);
  useEffect(() => {
    fetchAccounts('expense');
  }, [])


  return (
    <DisplayItems account={expenseAccount.accounts} total={expenseAccount.totalexpenses} type='expenses' navigation={props.screenProps.rootnavigation} />

  )
}

const DisplayItems = (props) => {
  const todaysDate = Moment().format('YYYY-MM-DD');


  const [onLongPress, setLongPress] = useState({ press: false, id: '' });
  const [popMessageBox, setPopMessagebox] = useState(false);

  const clickOk = (type) => {
    const todotype = { todotype: type };
    Axios.put(`${URL}/upCurrentdatetodotype/${onLongPress.id}`, todotype).then((response) => {
      const { message, status } = response.data;
      if (status) {
        Toast.show(message, Toast.LONG);
        setPopMessagebox(false)
        fetchTodos();

        fetchTodos('critical')

      } else {
        Toast.show(message, Toast.LONG);
      }


    }).catch((err) => {
      Toast.show(err, Toast.LONG);
    })
  }

  return (
    <View>
      <ScrollView showsHorizontalScrollIndicator={false} >
        {
          (props.type === 'expenses' || props.type === 'income') &&
          <View style={{ backgroundColor: props.type === 'expenses' ? 'darkred' : 'green', padding: 10, marginTop: 5, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Total: {props.total}</Text>

          </View>
        }
        {
          props.type === 'all' &&
          <View style={{ backgroundColor: props.totalincomes > props.totalexpenses ? 'green' : 'red', padding: 10, marginTop: 5, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{props.totalincomes > props.totalexpenses ? 'Total Income:' : 'Total Expenses:'} {props.total}</Text>

          </View>
        }
        {
          props.account ?

            props.account &&

            props.account.map((value, index) => (
              <ListItem
                key={index}

                subtitle={<View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <Text style={{ marginRight: 10, color: 'grey', fontSize: 14 }}>Rs. {value.Amount}</Text>
                    {value.Type === 'income' &&
                      <Text style={{ marginRight: 10, color: 'green', fontSize: 10, borderWidth: 1, paddingHorizontal: 5, paddingVertical: 2, textAlign: 'center', backgroundColor: '#ececec' }}>{value.Type}</Text>
                    }
                    {value.Type === 'expense' &&
                      <Text style={{ marginRight: 10, color: 'red', fontSize: 10, borderWidth: 1, paddingHorizontal: 5, paddingVertical: 2, textAlign: 'center', backgroundColor: '#ececec' }}>{value.Type}</Text>
                    }
                    {value.Type === 'normal' &&
                      <Text style={{ marginRight: 10, color: 'red', fontSize: 10, borderWidth: 1, paddingHorizontal: 5, paddingVertical: 2, textAlign: 'center', backgroundColor: '#ececec' }}>{value.Type}</Text>
                    }

                  </View>
                  {/* <Text>{Moment(value.Currentdate).format('YYYY-MM-DD')}</Text> */}
                  <Text style={{fontSize:12,color:'grey'}}><Moments fromNow element={Text}>{value.Currentdate}</Moments></Text>

                </View>}
                title={value.Title}
                leftAvatar={
                  <Avatar
                    rounded
                    size='small'
                    icon={{ name: 'bank', type: 'font-awesome', size: 25, color: 'grey' }}
                  />}
                rightElement={
                  onLongPress.press && onLongPress.id == value._id &&
                  <View style={{ flexDirection: 'row' }}>
                    {(Moment(value.Currentdate).format('YYYY-MM-DD') === todaysDate) &&
                      <>
                        <Button
                          icon={{ name: 'edit', type: 'font-awesome', size: 22 }}
                          type='clear'
                          onPress={() => {
                            props.navigation('Addform', {
                              title: 'Update Account',
                              account: value
                            });
                          }} />

                      </>
                    }

                  </View>
                }
                bottomDivider
                onLongPress={() => {
                  setLongPress({ press: true, id: value._id })
                  setTimeout(() => {
                    setLongPress({ press: false, id: value._id })
                  }, 10000)
                }}
              />
            )
            )
            :
            <View>
              <ActivityIndicator size='large' color='grey' style={{ marginTop: 200 }} />
              <Text style={{ textAlign: 'center' }}>Cannot find any data</Text>

            </View>
        }
        <Overlay
          isVisible={popMessageBox}
          animated
          animationType='slide'
          height='12%'
          containerStyle={{ padding: 10 }}>
          <Text style={{ textAlign: 'left', fontSize: 17 }}>Did you Complete this task?</Text>
          <View style={{ flexDirection: 'row-reverse' }}>

            <Button
              title='No'
              type='clear'
              titleStyle={{ color: 'red', marginRight: 5 }}
              onPress={() => setPopMessagebox(false)} />
            <Button
              title='Yes'
              type='clear'
              onPress={() => clickOk('completed')} />
          </View>

        </Overlay>
      </ScrollView>

    </View>

  )
}




const MySwitchTabs = createMaterialTopTabNavigator({
  All: {
    screen: Home,
  },
  Income: {
    screen: Income,
  },
  Expenses: {
    screen: Expenses,
  }
}, {
  tabBarOptions: {
    indicatorStyle: { borderWidth: 1, borderColor: Color.danger },
    labelStyle: {
      fontSize: 14,
      color: Color.danger,
      fontWeight: 'bold',
      //   textTransform: 'capitalize'
    },
    style: {
      backgroundColor: 'white',
    },
  }
});

var TabNavigator = createAppContainer(MySwitchTabs);

