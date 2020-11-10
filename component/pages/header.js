import React from 'react';
import { Color } from '../color';
import { View, Dimensions } from 'react-native';
import { Header, Icon, Input, Button } from 'react-native-elements';
import MainContext from '../../context';

export default class Login extends React.Component {
  static contextType = MainContext;
  state = {
    search: false
  }
  onSearchClick = () => {
    this.setState({
      search: !this.state.search
    })
    this.context.fetchTodos()
  }
  componentDidMount = () => {
    //  Toast.showWithGravity('Refreshing Data dsa dsa dsad', Toast.LONG, Toast.CENTER);
  }
  render() {
    const { toggleDrawer, add, goBack, leftIcon, label, type } = this.props;
    console.log(this.context);
    return (
      <View>
        <Header
          placement="left"
          leftComponent={this.state.search ?
            <Icon onPress={this.onSearchClick} name="arrow-back" size={30} color={Color.white} /> :
            <Icon onPress={add ? () => { goBack(); } : toggleDrawer} name={leftIcon} size={30} color={Color.white} />
          }
          centerComponent={this.state.search ?
            <Input
              placeholder={`Search ${label.slice(2, 12).toLowerCase()}`}
              value={this.context.search}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              onChangeText={(text) => {
                this.context.searchFilter(text)
              }} />
            :
            {
              text: label,
              style: { color: 'white', fontSize: 20, fontWeight: 'bold' }
            }}
          backgroundColor={Color.danger}
          rightComponent={!this.state.search && !add && <Icon name="search" size={26} color={Color.white} onPress={this.onSearchClick} />}
        />
        {(!add && !this.props.type) &&
          <View style={{
            top: Dimensions.get('window').height - 100,
            position: 'absolute',
            flexDirection: 'row',
            zIndex: 999999,
            // top: 500,
            right: 30,
            justifyContent: 'flex-end', alignItems: 'flex-end'
          }}>
            <Button
              onPress={() => {
                this.props.navigate('Addform', {
                  title: 'Add new ' + label.slice(2, 10).toLowerCase(),
                });
              }}
              buttonStyle={{ borderRadius: 50, padding: 20, width: 60, backgroundColor: Color.danger, }}
              icon={
                <Icon
                  type="font-awesome"
                  name="plus"
                  size={20}
                  color="white"
                />
              } />
          </View>
        }
      </View>
    );
  }
}
