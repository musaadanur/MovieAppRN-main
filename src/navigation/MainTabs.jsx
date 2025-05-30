import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import SearchStack from "./SearchStack";
import ProfileScreen from "../screens/ProfileScreen";
import FavoritesStack from "./FavoritesStack";
import colors from "../theme/colors";

import HomeIcon from "../assets/home.svg";
import SearchIcon from "../assets/search.svg";
import ProfileIcon from "../assets/profile.svg";
import FavoriteIcon from "../assets/favorite.svg";

const Tab = createBottomTabNavigator();

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
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ color }) => {
          let IconComponent;

          switch (route.name) {
            case "Home":
              IconComponent = HomeIcon;
              break;
            case "Favorites":
              IconComponent = FavoriteIcon;
              break;
            case "Search":
              IconComponent = SearchIcon;
              break;
            case "Profile":
              IconComponent = ProfileIcon;
              break;
            default:
              IconComponent = HomeIcon;
          }

          return <IconComponent width={24} height={24} fill={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Favorites" component={FavoritesStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
