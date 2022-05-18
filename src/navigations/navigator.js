import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";

import Home from '../screens/Home';
import Search from '../screens/Search';
import NextDay from '../screens/NextDay';
import Wishlist from '../screens/Wishlist';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'Home'}
        >
            <Stack.Screen
                name="Home"
                component={Home}
                initialParams={{ city: "" }}
            />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="NextDay" component={NextDay} />
            <Stack.Screen name="Wishlist" component={Wishlist} />
        </Stack.Navigator>
    )
}

export default StackNavigator;