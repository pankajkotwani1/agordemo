/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PIPPopup from './context/Modal';
import { PIPProvider } from './context/ModalProvider';
import { usePIPMode } from './context/useModal';
import Advanced from './examples/advanced';
import Basic from './examples/basic';

const Stack = createStackNavigator();

const DATA = [Basic, Advanced];

const App = () => {
  return (
    <PIPProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'APIExample'} component={Home} />
          {DATA.map((value) =>
            // @ts-ignore
            value.data.map(({ name, component }) => (
              <Stack.Screen name={name} component={component} />
            ))
          )}
        </Stack.Navigator>
        <PIPPopup />
      </NavigationContainer>
    </PIPProvider>
  );
};

// @ts-ignore
const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        // @ts-ignore
        sections={DATA}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

// @ts-ignore
const Item = ({ item, navigation }) => {
  const { setShowPopup, show } = usePIPMode();

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          if (show && item.name === 'JoinChannelVideo') {
            setShowPopup(false);
          }
          navigation.navigate(item.name);
        }}
      >
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    fontSize: 24,
    color: 'white',
    backgroundColor: 'grey',
  },
  item: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    color: 'black',
  },
});

export default App;
