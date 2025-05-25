import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeStack from "./HomeStack"
import SearchStack from "./SearchStack"
import ProfileScreen from "../screens/ProfileScreen"
import FavoritesStack from "./FavoritesStack"
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from "../theme/colors"

const Tab = createBottomTabNavigator()

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName

          switch (route.name) {
            case "Home":
              iconName = "home-outline"
              break
            case "Favorites":
              iconName = "heart-outline"
              break
            case "Search":
              iconName = "search-outline"
              break
            case "Profile":
              iconName = "person-outline"
              break
            default:
              iconName = "help-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Favorites" component={FavoritesStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default MainTabs
