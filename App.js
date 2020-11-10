import React from 'react';
import Login from './component/pages/login';
import AddForm from './component/pages/addform';
import Home from './component/index';
import MainContext from './context';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Axios from 'axios';
import Toast from 'react-native-simple-toast';
import { URL } from './component/config';
import { AsyncStorage } from 'react-native';


const appNavigation = createStackNavigator({
  Login: Login,
  Home: Home,
  Addform: AddForm
}, { headerMode: "none" });

class Main extends React.Component {
  state = {
    message: '',
    scroll_loading: false,
    users: [],
    isAdmin: false,
    todos: [],
    incomeAccount: [],
    expenseAccount: [],
    allAccount: [],
    isSession: {},
    search: '',
    dataSource: []
  }

  fetchAccounts = (type) => {
    if (!type) {
      Axios.get(`${URL}/getaccount`)
        .then((response) => {
          this.setState({ allAccount: response.data })
        })
        .catch((err) => {
          Toast.show(err, Toast.LONG);
        })
    } else {
      Axios.get(`${URL}/getaccount/${type}`)
        .then((response) => {
          if (type === 'income') {
            this.setState({ incomeAccount: response.data })
          } else {
            this.setState({ expenseAccount: response.data })

          }
        })
        .catch((err) => {
          Toast.show(err, Toast.LONG);
        })
    }
  }

  fetchTodos = () => {
    Axios.get(`${URL}/getalltodo`)
      .then((response) => {
        this.setState({ todos: response.data, dataSource: response.data })
      })
      .catch((err) => {
        Toast.show(err, Toast.LONG);
      })
  }

  updateTodos = async (type, id) => {
    const todotype = { todotype: type };
    await Axios.put(`${URL}/updatetodotype/${id}`, todotype).then((response) => {
      const { message, status } = response.data;
      if (status) {
        Toast.show(message, Toast.LONG);
        // setPopMessagebox(false)
        this.fetchTodos();
      } else {
        Toast.show(message, Toast.LONG);
      }


    }).catch((err) => {
      Toast.show(err, Toast.LONG);
    })
  }



  loadMore = (pageNum, size) => {
    this.fetchTodos(pageNum, size);
  }

  fetchUsers = async () => {
    await Axios.get(`${URL}/getusers`).then((response) => {
      this.setState({ users: response.data });
    })
      .catch((err) => {
        Toast.show(err, Toast.LONG);
      })
  }

  getisAdmin = async () => {
    await AsyncStorage.getItem('token', (err, result) => {
      const session = JSON.parse(result);
      if (session.userdata.Usertype === 'Admin') {
        this.setState({ isAdmin: true })
      }
    }).catch((err) => {
      console.warn(err);

    })
  }

  getisSession = async () => {
    const session = await AsyncStorage.getItem('token');
    const result = JSON.parse(session);
    if (result.token) {
      // console.warn(true);
      this.setState({ isSession: { valid: true, data: result } })
    } else {
      this.setState({ isSession: { valid: false } })
    }
  }

  searchFilter = (text) => {
    const newData = this.state.dataSource.filter((item) => {
      const ItemData = item.Title ? item.Title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return ItemData.indexOf(textData) > -1;
    })
    this.setState({
      todos: newData,
      search: text,
    });
  }

  render() {
    var contextValue = {
      todos: this.state.todos,
      fetchTodos: this.fetchTodos,
      loadMore: this.loadMore,
      scroll_loading: this.state.scroll_loading,
      fetchUsers: this.fetchUsers,
      listUsers: this.state.users,
      isAdmin: this.state.isAdmin,
      getisAdmin: this.getisAdmin,
      incomeAccount: this.state.incomeAccount,
      expenseAccount: this.state.expenseAccount,
      allAccount: this.state.allAccount,
      fetchAccounts: this.fetchAccounts,
      getisSession: this.getisSession,
      isSession: this.state.isSession,
      searchFilter: this.searchFilter,
      search: this.state.search,
      updateTodos: this.updateTodos

    }
    return (
      <MainContext.Provider value={contextValue}>
        {this.state.message.length > 0 &&
          Toast.show(this.state.message, Toast.LONG)
        }
        <Nav />
      </MainContext.Provider>
    );
  }
}
const Nav = createAppContainer(appNavigation);
export default Main;