import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Add your screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
