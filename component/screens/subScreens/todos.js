import React, {Component} from 'react';
import {View,FlatList, Item, StyleSheet, ActivityIndicator, Text} from 'react-native';
import { ListItem, Button,Badge, Icon, Avatar} from 'react-native-elements';
import MainContext from '../../../context';
import { Color } from '../../color';
import SwipeView from 'react-native-swipeview';
// for socket
window.navigator.userAgent = 'react-native';
import io from 'socket.io-client';

class TodosList extends Component {
    static contextType = MainContext;
    state = { 
        pageNum: 1,
        size: 6,
        loading: true,
        socket: null,
        notif:0
     }
    componentDidMount = () => {
    //   this.context.fetchTodos(this.state.pageNum, this.state.size);
   
    };
    
    loadMore = ()=> {
      if(this.state.loading){
            this.context.loadMore(this.state.pageNum, this.state.size);
            this.setState({
                pageNum: this.state.pageNum + 1,
                loading: false,
            })
       }
       this.setState({loading: true})
    }
    renderRow =  (item) =>{
        return (
                <SwipeView
                leftOpenValue={400}
                swipeToOpenPercent={1}
                renderLeftView={() => (
                    <View style={{backgroundColor: Color.success,margin: 10, flex:1, borderRadius: 10, alignItems:"center", height: 80}}>
                      <Icon
                         name="check-circle"
                         size={80}
                         color="white"
                       />

                    </View>
                )}
                renderVisibleContent={() => 
                    <ListItem 
                    containerStyle={styles.lists} 
                    leftAvatar={<Avatar title={item.id} rounded size="small"/>}
                    title={ item.title}
                    subtitle={`User Unique Id ${item.userId}`}
                    bottomDivider
                    rightIcon={{name: 'check-circle', color:item.completed?Color.success:''}}
                />
                }
             />
        );
    }
    render() { 
        var todos = this.context.todos;
        return (todos&&
                <View style={{flex: 1, flexDirection: 'column'}}>
    <Text style={{padding: 4, backgroundColor: 'red',fontSize: 30, color: 'white'}}>{this.state.notif}</Text>
                    <FlatList
                        data={todos}
                        renderItem={({ item }) => this.renderRow(item)}
                        keyExtractor={item => item.id}
                        onEndReachedThreshold={0.5}
                        onEndReached={this.loadMore}
                    />
                    {this.context.scroll_loading &&
                        <ActivityIndicator />
                    }
               </View>
               );
    }
}
 
const styles = StyleSheet.create({
    lists: {
        margin: 10,
        height: 100,
    }
})
export default TodosList;