import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import MasonryList from 'react-native-masonry-list';
import ImageItem from '../components/ImageItem';
import GridItem from '../components/GridItem';

const {width: screenWidth} = Dimensions.get('window');
const CELL_SIZE = 100; // Default cell size

const data = [
  {id: '1', src: require('../assets/images/1.jpeg'), width: 1, height: 1},
  {id: '2', src: require('../assets/images/2.jpeg'), width: 2, height: 1},
  {id: '3', src: require('../assets/images/3.jpg'), width: 3, height: 2},
  {id: '4', src: require('../assets/images/4.jpg'), width: 3, height: 3},
  {id: '5', src: require('../assets/images/5.jpg'), width: 2, height: 1},
  {id: '6', src: require('../assets/images/6.jpg'), width: 1, height: 2},
];

const TestingScreen = () => {
  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState(data);

  // Convert local images to valid URIs
  const formattedData = items.map(item => ({
    id: item.id,
    uri: item.src, // Convert require() to URI
    width: item.width * CELL_SIZE,
    height: item.height * CELL_SIZE,
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setEditMode(!editMode)}
        style={styles.button}>
        <Text style={styles.buttonText}>{editMode ? 'Done' : 'Edit'}</Text>
      </TouchableOpacity>

      <MasonryList
        images={formattedData}
        renderIndividualHeader={data => (
          <GridItem item={data} editMode={editMode} />
        )}
        columns={3} // Max 3 columns
        spacing={0} // No gap between items
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fafafa'},
  button: {
    padding: 10,
    alignSelf: 'center',
    backgroundColor: 'blue',
    marginVertical: 10,
  },
  buttonText: {color: 'white', fontWeight: 'bold'},
});

export default TestingScreen;
