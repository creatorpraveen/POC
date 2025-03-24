import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ImageItem from '../components/ImageItem';

const {width: screenWidth} = Dimensions.get('window');

const GRID_SIZE = 3;
const CELL_SIZE = screenWidth / GRID_SIZE;

const data = [
  {id: '1', src: require('../assets/images/1.jpeg'), width: 1, height: 1},
  {id: '3', src: require('../assets/images/3.jpg'), width: 1, height: 1},
  {id: '4', src: require('../assets/images/4.jpg'), width: 1, height: 1},
  {id: '5', src: require('../assets/images/5.jpg'), width: 1, height: 1},
  {id: '6', src: require('../assets/images/6.jpg'), width: 1, height: 1},
  {id: '7', src: require('../assets/images/7.jpg'), width: 1, height: 1},
  {id: '8', src: require('../assets/images/8.jpg'), width: 1, height: 1},
  {id: '9', src: require('../assets/images/9.jpg'), width: 1, height: 1},
  {id: '10', src: require('../assets/images/10.jpg'), width: 1, height: 1},
];

const GridScreen = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        numColumns={GRID_SIZE}
        columnWrapperStyle={styles.gridContainer}
        renderItem={({item}) => <ImageItem item={item} editMode={editMode} />}
        contentContainerStyle={styles.contentContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.edit}
        onPress={() => setEditMode(!editMode)}>
        <Text style={styles.editText}>{editMode ? 'Done' : 'Edit'}</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  gridContainer: {
    width: CELL_SIZE * GRID_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: 2,
    // marginBottom: 2,
  },
  contentContainer: {
    // padding: 2,
  },
  edit: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: 'red',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    zIndex: 9,
  },
  editText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 500,
  },
});

export default GridScreen;
