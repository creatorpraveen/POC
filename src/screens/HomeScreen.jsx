import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const handlePress = screen => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('Post')}>
        <Text style={styles.buttonText}>Post Grid</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('Remover')}>
        <Text style={styles.buttonText}>Background Remover</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('Testing')}>
        <Text style={styles.buttonText}>Testing</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress('Testing2')}>
        <Text style={styles.buttonText}>Testing 2</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'black',
    borderRadius: 12,
    width: '90%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default HomeScreen;
