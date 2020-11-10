import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Color } from '../color';
import { Icon, Avatar, Button, ListItem, Overlay } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import Headers from '../pages/header';
import TodosScreen from './subScreens/todos';
import UserContext from '../../context'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Axios from 'axios';
import { URL } from '../config';
import Toast from 'react-native-simple-toast';
import Moments from 'react-moment';
import { DisplayItems, CriticalDisplayItems, CompletedDisplayItems } from '../DiplayItem'
export default class Todos extends Component {
  render() {
    return (
      <View style={{ flex: 1, zIndex: 0 }}>
        <Headers navigate={this.props.navigation.navigate} toggleDrawer={this.props.navigation.toggleDrawer} label="MY TODOS" leftIcon="check-circle" params="MY_TODOS" />
        <TabNavigator screenProps={{ rootnavigation: this.props.navigation.navigate }} />
      </View>
    );
  }
}

const AllTodos = (props) => {
  const { fetchTodos, todos, getisAdmin, updateTodos } = useContext(UserContext);
  useEffect(() => {
    getisAdmin();
    fetchTodos();
    console.warn(todos);
  }, [])

  return (
    <DisplayItems todos={todos} navigation={props.screenProps.rootnavigation} updateTodos={updateTodos} />
  )
}

const Critical = (props) => {

  const { todos, isAdmin, updateTodos } = useContext(UserContext);



  return (
    <CriticalDisplayItems todos={todos} navigation={props.screenProps.rootnavigation} updateTodos={updateTodos} />
  )
}

const Completed = (props) => {

  const { todos, updateTodos } = useContext(UserContext);

  return (
    <CompletedDisplayItems todos={todos} type='completed' navigation={props.screenProps.rootnavigation} updateTodos={updateTodos} />
  )
}





const MySwitchTabs = createMaterialTopTabNavigator({
  Todos: {
    screen: AllTodos,

  },
  Critical: {
    screen: Critical,
  },
  Completed: {
    screen: Completed,
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