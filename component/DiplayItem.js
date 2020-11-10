import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Icon, Avatar, Button, ListItem, Overlay } from 'react-native-elements';
import Axios from 'axios';
import { URL } from './config';
import Toast from 'react-native-simple-toast';
import Moments from 'react-moment';


export const DisplayItems = (props) => {

    const [onLongPress, setLongPress] = useState({ press: false, id: '' });
    const [popMessageBox, setPopMessagebox] = useState(false);
    const { todos, updateTodos } = props;

    return (
        <View>
            <ScrollView showsHorizontalScrollIndicator={false} >
                {
                    props.todos.length > 0 ?
                        props.todos.length > 0 &&


                        todos.map((value, index) => (
                            <ListItem
                                key={index}

                                subtitle={<View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                        <Text style={{ marginRight: 10, color: 'grey', fontSize: 14 }}>{value.Assignedto}</Text>
                                        {value.Type === 'critical' &&
                                            <Text style={{ marginRight: 10, color: 'red', fontSize: 12 }}>{value.Type}</Text>
                                        }
                                        {value.Type === 'completed' &&
                                            <Text style={{ marginRight: 10, color: 'green', fontSize: 12 }}>{value.Type}</Text>
                                        }
                                        {value.Type === 'normal' &&
                                            <Text style={{ marginRight: 10, color: 'orange', fontSize: 12 }}>{value.Type}</Text>
                                        }

                                    </View>
                                    <Text style={{ fontSize: 12, color: 'grey' }}><Moments fromNow element={Text}>{value.Currentdate}</Moments></Text>
                                </View>}
                                title={value.Title}
                                leftAvatar={
                                    <Avatar
                                        rounded
                                        size='small'
                                        icon={{ name: 'tasks', type: 'font-awesome', size: 25, color: 'grey' }}
                                    />}
                                rightElement={
                                    onLongPress.press && onLongPress.id == value._id &&
                                    <View style={{ flexDirection: 'row' }}>
                                        {(value.Type === 'critical' || value.Type === 'normal') &&
                                            <>
                                                <Button
                                                    icon={{ name: 'edit', type: 'font-awesome', size: 22 }}
                                                    type='clear'
                                                    onPress={() => {
                                                        props.navigation('Addform', {
                                                            title: 'Update Todos',
                                                            todos: value
                                                        });
                                                    }} />
                                                < Button
                                                    icon={{ name: 'check-circle', type: 'font-awesome', size: 22, color: 'green' }}
                                                    type='clear'
                                                    onPress={() => setPopMessagebox(true)}
                                                />
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
                            onPress={() => {
                                updateTodos('completed', onLongPress.id);
                                setPopMessagebox(false);
                            }} />
                    </View>

                </Overlay>
            </ScrollView>

        </View>

    )
}

export const CriticalDisplayItems = (props) => {

    const [onLongPress, setLongPress] = useState({ press: false, id: '' });
    const [popMessageBox, setPopMessagebox] = useState(false);
    const { fetchTodos, type, todos } = props;


    return (
        <View>
            <ScrollView showsHorizontalScrollIndicator={false} >
                {
                    props.todos.length > 0 ?
                        props.todos.length > 0 &&
                        todos.map((value, index) => (
                            value.Type === 'critical' &&
                            <ListItem
                                key={index}

                                subtitle={<View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                        <Text style={{ marginRight: 10, color: 'grey', fontSize: 14 }}>{value.Assignedto}</Text>
                                        {value.Type === 'critical' &&
                                            <Text style={{ marginRight: 10, color: 'red', fontSize: 12 }}>{value.Type}</Text>
                                        }
                                        {value.Type === 'completed' &&
                                            <Text style={{ marginRight: 10, color: 'green', fontSize: 12 }}>{value.Type}</Text>
                                        }
                                        {value.Type === 'normal' &&
                                            <Text style={{ marginRight: 10, color: 'orange', fontSize: 12 }}>{value.Type}</Text>
                                        }

                                    </View>
                                    <Text style={{ fontSize: 12, color: 'grey' }}><Moments fromNow element={Text}>{value.Currentdate}</Moments></Text>
                                </View>}
                                title={value.Title}
                                leftAvatar={
                                    <Avatar
                                        rounded
                                        size='small'
                                        icon={{ name: 'tasks', type: 'font-awesome', size: 25, color: 'grey' }}
                                    />}
                                rightElement={
                                    onLongPress.press && onLongPress.id == value._id &&
                                    <View style={{ flexDirection: 'row' }}>
                                        {(value.Type === 'critical' || value.Type === 'normal') &&
                                            <>
                                                <Button
                                                    icon={{ name: 'edit', type: 'font-awesome', size: 22 }}
                                                    type='clear'
                                                    onPress={() => {
                                                        props.navigation('Addform', {
                                                            title: 'Update Todos',
                                                            todos: value
                                                        });
                                                    }} />
                                                < Button
                                                    icon={{ name: 'check-circle', type: 'font-awesome', size: 22, color: 'green' }}
                                                    type='clear'
                                                    onPress={() => setPopMessagebox(true)}
                                                />
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
                            onPress={() => {
                                updateTodos('completed', onLongPress.id);
                                setPopMessagebox(false);
                            }} />
                    </View>

                </Overlay>
            </ScrollView>

        </View>

    )
}

export const CompletedDisplayItems = (props) => {

    const [onLongPress, setLongPress] = useState({ press: false, id: '' });
    const [popMessageBox, setPopMessagebox] = useState(false);
    const { fetchTodos, type, todos } = props;

    const clickOk = (type) => {
        const todotype = { todotype: type };
        Axios.put(`${URL}/updatetodotype/${onLongPress.id}`, todotype).then((response) => {
            const { message, status } = response.data;
            if (status) {
                Toast.show(message, Toast.LONG);
                setPopMessagebox(false)
                fetchTodos();


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
                    props.todos.length > 0 ?
                        props.todos.length > 0 &&


                        todos.map((value, index) => (
                            value.Type === 'completed' &&
                            <ListItem
                                key={index}

                                subtitle={<View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                        <Text style={{ marginRight: 10, color: 'grey', fontSize: 14 }}>{value.Assignedto}</Text>
                                        {value.Type === 'critical' &&
                                            <Text style={{ marginRight: 10, color: 'red', fontSize: 12 }}>{value.Type}</Text>
                                        }
                                        {value.Type === 'completed' &&
                                            <Text style={{ marginRight: 10, color: 'green', fontSize: 12 }}>{value.Type}</Text>
                                        }
                                        {value.Type === 'normal' &&
                                            <Text style={{ marginRight: 10, color: 'orange', fontSize: 12 }}>{value.Type}</Text>
                                        }

                                    </View>
                                    <Text style={{ fontSize: 12, color: 'grey' }}><Moments fromNow element={Text}>{value.Currentdate}</Moments></Text>
                                </View>}
                                title={value.Title}
                                leftAvatar={
                                    <Avatar
                                        rounded
                                        size='small'
                                        icon={{ name: 'tasks', type: 'font-awesome', size: 25, color: 'grey' }}
                                    />}
                                rightElement={
                                    onLongPress.press && onLongPress.id == value._id &&
                                    <View style={{ flexDirection: 'row' }}>
                                        {(value.Type === 'critical' || value.Type === 'normal') &&
                                            <>
                                                <Button
                                                    icon={{ name: 'edit', type: 'font-awesome', size: 22 }}
                                                    type='clear'
                                                    onPress={() => {
                                                        props.navigation('Addform', {
                                                            title: 'Update Todos',
                                                            todos: value
                                                        });
                                                    }} />
                                                < Button
                                                    icon={{ name: 'check-circle', type: 'font-awesome', size: 22, color: 'green' }}
                                                    type='clear'
                                                    onPress={() => setPopMessagebox(true)}
                                                />
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
                            onPress={() => {
                                updateTodos('completed', onLongPress.id);
                                setPopMessagebox(false);
                            }} />
                    </View>

                </Overlay>
            </ScrollView>

        </View>

    )
}


