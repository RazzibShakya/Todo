import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native';
import { Color } from '../component/color';
import { Icon, Avatar, Badge, ListItem, Button, Overlay } from 'react-native-elements';
import { createAppContainer, ScrollView } from 'react-navigation';
import Todos from './screens/todos';
import Account from './screens/account';
import Constants from 'expo-constants';
import Headers from './pages/header';
import { URL } from './config';
import UserContext from '../context'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Axios from 'axios';
import Toast from 'react-native-simple-toast';

const coustoDrawerComponent = (props) => {
  const { isSession, isAdmin, getisAdmin, getisSession } = useContext(UserContext);
  const [popMessageBox, setPopMessagebox] = useState(false);


  useEffect(() => {
    getisSession();
    console.warn(isSession.data.userdata);

    getisAdmin();

  }, [])

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ height: 170, backgroundColor: Color.danger, justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 50, paddingLeft: 10 }}>
        <Avatar
          rounded
          size="large"
          source={{
            uri:
              'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          }}
        />
        <Text style={{ color: Color.white, fontSize: 17, marginLeft: 8, fontWeight: 'bold' }}>{isSession.data.userdata.Username}</Text>

        <View style={{ flex: 1, flexDirection: 'row', padding: 9, alignItems: 'space-between' }}>
          <Text style={{ color: Color.white, fontSize: 15, flex: 3 }}>{isSession.data.userdata.Contact}</Text>
          <Badge status="standard" value={isSession.data.userdata.Usertype} />
        </View>
      </View>
      <DrawerItems screenProps={{ isAdmin: isAdmin }} {...props} labelStyle={{ color: Color.danger, fontSize: 17 }} />
      <ListItem
        title="Settings"
        leftIcon={{ name: "settings-applications" }}
        topDivider
     
        bottomDivider
      />
      <ListItem
        title="Logout"
        leftIcon={{ name: "exit-to-app" }}
        topDivider
        onPress={() =>setPopMessagebox(true)
        }
        bottomDivider
      />

      <Overlay
        isVisible={popMessageBox}
        animated
        animationType='slide'
        height='12%'
        containerStyle={{ padding: 10 }}>
        <Text style={{ textAlign: 'left', fontSize: 17 }}>Ares you sure that you want to logout?</Text>
        <View style={{ flexDirection: 'row-reverse' }}>

          <Button
            title='No'
            type='clear'
            titleStyle={{ color: 'red', marginRight: 5 }}
            onPress={() => setPopMessagebox(false)} />
          <Button
            title='Yes'
            type='clear'
            onPress={() => {
              AsyncStorage.clear();
              props.navigation.navigate('Login');
              setPopMessagebox(false);
            }} />
        </View>

      </Overlay>
    </View>
  )
}
const Members = (props) => {
  const { fetchUsers, listUsers, isAdmin, getisAdmin } = useContext(UserContext);
  const [popMessageBox, setPopMessagebox] = useState(false);
  const [manipulateId, setManipulateId] = useState('');
  const [user, setUserData] = useState({});




  const manipulateUser = ({ id, type }) => {
    if (type === 'update') {
      // console.warn(id);
      props.navigation.navigate('Addform', {
        title: 'Update Members ',
        type: 'members',
        data: id
      });
    } else if (type === 'delete') {
      console.warn(id);
      Axios.put(`${URL}/deleteuser/${id}`).then((response) => {
        const { message, status } = response.data;
        console.warn(message);
        if (status) {
          fetchUsers();
          setPopMessagebox(false);

          Toast.show(message, Toast.LONG);
        }
      }).then((error) => {
        console.warn(error);
      })

    } else {
      console.warn('Type not given');
    }
  }


  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <Headers navigate={props.navigation.navigate} toggleDrawer={props.navigation.toggleDrawer} label="All Members" leftIcon="check-circle" params="ALL_MEMB" type='members' />


      <ScrollView showsHorizontalScrollIndicator={false} >
        {
          listUsers.length > 0 ?
            listUsers.length > 0 &&
            listUsers.map((value, index) => (
              <View>
                <ListItem
                  key={index}
                  subtitle={
                    <View  >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='phone' type='font-awesome' size={14} color='green' />
                        <Text style={{ fontSize: 12, color: 'grey', marginLeft: 5 }}>{value.Contact}</Text>
                      </View>

                      <Text style={{ fontSize: 12, color: 'red' }}>{value.Usertype}</Text>
                    </View>}
                  title={<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='user' type='font-awesome' size={15} color='grey' />
                    <Text style={{ fontSize: 15, color: 'black', marginLeft: 5 }}>{value.Username}</Text>
                  </View>}
                  leftAvatar={
                    <Avatar
                      rounded
                      size='small'
                      icon={{ name: 'user', type: 'font-awesome', size: 25, color: 'grey' }}
                    />}
                  rightElement={
                    isAdmin &&
                    <View style={{ flexDirection: 'row' }}>
                      <Button
                        icon={{ name: 'edit', type: 'font-awesome', size: 20 }}
                        type='clear'
                        onPress={() => {
                          manipulateUser({ id: value, type: 'update' })

                        }} />
                      <Button
                        icon={{ name: 'trash', type: 'font-awesome', size: 18, color: 'red' }}
                        type='clear'
                        onPress={() => {
                          setPopMessagebox(true);
                          setManipulateId(value._id)
                        }} />

                    </View>}
                  bottomDivider />

              </View>
            )
            )
            :
            <ActivityIndicator size='large' color='grey' style={{ marginTop: 200 }} />
        }
      </ScrollView>
      <Overlay
        isVisible={popMessageBox}
        animated
        animationType='slide'
        height='12%'
        containerStyle={{ padding: 10 }}>
        <Text style={{ textAlign: 'left', fontSize: 17 }}>Do you want to delete this member?</Text>
        <View style={{ flexDirection: 'row-reverse' }}>

          <Button
            title='No'
            type='clear'
            titleStyle={{ color: 'red', marginRight: 5 }}
            onPress={() => setPopMessagebox(false)} />
          <Button
            title='Yes'
            type='clear'
            onPress={() => manipulateUser({ id: manipulateId, type: 'delete' })
            } />
        </View>

      </Overlay>
      <Button
        onPress={() => {
          props.navigation.navigate('Addform', {
            title: 'Add new Members ',
            type: 'members'
          });
        }}

        buttonStyle={{ borderRadius: 50, padding: 20, width: 60, backgroundColor: Color.danger, position: 'absolute', bottom: 70, right: 30 }}
        icon={
          <Icon
            type="font-awesome"
            name="plus"
            size={20}
            color="white"
          />
        }
      />

    </View>
  )
}
const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: Todos,
    navigationOptions: {
      drawerLabel: 'My Todos',
      drawerIcon: () => (
        <Icon name="check-circle" color={Color.danger} />
      )
    }
  },
  Account: {
    screen: Account,
    navigationOptions: {
      drawerLabel: 'My Accounts',
      drawerIcon: () => (
        <Icon name="account-balance" color={Color.danger} />
      )
    }
  },
  Members: {
    screen: Members,
    navigationOptions: {
      drawerLabel: 'My Members',
      drawerIcon: () => (
        <Icon name="account-box" color={Color.danger} />
      )
    }
  },
}, {
  contentComponent: coustoDrawerComponent,
  contentOptions: {
    drawerLabel: {}
  }
});

export default createAppContainer(MyDrawerNavigator);