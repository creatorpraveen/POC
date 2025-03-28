import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width: screenWidth} = Dimensions.get('window');

const GRID_COLUMNS = 3;
const GRID_CELL_SIZE = screenWidth / GRID_COLUMNS;
const MAX_SIZE_WIDTH = GRID_CELL_SIZE * GRID_COLUMNS;
const MAX_SIZE_HEIGHT = GRID_CELL_SIZE * 2;

const hasNullBetweenNumbers = grid => {
  let list = [];

  for (let i = 0; i < grid.length; i++) {
    const status = grid[i].some(x => x === Number(x));
    if (status) {
      list.push(status);
    } else {
      break;
    }
  }

  let newList = [];

  for (let i = 0; i < list.length - 2; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      newList.push(grid[i][j]);
    }
  }

  return check(newList);
};

function check(arr) {
  let foundNumber = false;
  let hasNullInBetween = false;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null) {
      if (foundNumber) hasNullInBetween = true;
    } else {
      if (hasNullInBetween) return true;
      foundNumber = true;
    }
  }

  return false;
}

// Generating grid pre-defined data and empty data
const generateGrid = items => {
  let grid = Array.from({length: items.length * 2}, () =>
    Array(GRID_COLUMNS).fill(null),
  );
  let layout = [];
  let maxHeight = 0;

  items.forEach((item, index) => {
    let width = item.width || 1;
    let height = item.height || 1;
    let positionFound = false;

    for (let y = 0; !positionFound; y++) {
      for (let x = 0; x <= GRID_COLUMNS - width; x++) {
        let fits = true;

        // Check if the item fits in the current slot
        for (let h = 0; h < height; h++) {
          for (let w = 0; w < width; w++) {
            if (grid[y + h]?.[x + w] !== null) {
              fits = false;
              break;
            }
          }
          if (!fits) break;
        }

        if (fits) {
          // Place the item in the grid
          for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
              grid[y + h][x + w] = index;
            }
          }
          layout.push({image: item.image, x, y, width, height, index});

          // Update max height
          maxHeight = Math.max(maxHeight, y + height);
          positionFound = true;
          break;
        }
      }
    }
  });

  const hasEmptySpace = hasNullBetweenNumbers(grid);

  return {layout, gridHeight: maxHeight * GRID_CELL_SIZE, hasEmptySpace};
};

const GridItem = ({item, onResize, index, isEditable}) => {
  const myWidth = useSharedValue(item.width * GRID_CELL_SIZE);
  const myHeight = useSharedValue(item.height * GRID_CELL_SIZE);
  const initialWidth = useSharedValue(myWidth.value);
  const initialHeight = useSharedValue(myHeight.value);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      initialWidth.value = myWidth.value;
      initialHeight.value = myHeight.value;
    })
    .onUpdate(event => {
      myWidth.value = Math.min(
        MAX_SIZE_WIDTH,
        Math.max(GRID_CELL_SIZE, initialWidth.value + event.translationX),
      );
      myHeight.value = Math.min(
        MAX_SIZE_HEIGHT,
        Math.max(GRID_CELL_SIZE, initialHeight.value + event.translationY),
      );
      runOnJS(onResize)(
        index,
        myWidth.value / GRID_CELL_SIZE,
        myHeight.value / GRID_CELL_SIZE,
      );
    })
    .onEnd(() => {
      myWidth.value =
        Math.round(myWidth.value / GRID_CELL_SIZE) * GRID_CELL_SIZE;
      myHeight.value =
        Math.round(myHeight.value / GRID_CELL_SIZE) * GRID_CELL_SIZE;
      runOnJS(onResize)(
        index,
        myWidth.value / GRID_CELL_SIZE,
        myHeight.value / GRID_CELL_SIZE,
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(myWidth.value, {duration: 100}),
    height: withTiming(myHeight.value, {duration: 100}),
    left: withTiming(item.x * GRID_CELL_SIZE, {duration: 500}),
    top: withTiming(item.y * GRID_CELL_SIZE, {duration: 500}),
  }));

  //   const animatedStyle = useAnimatedStyle(() => ({
  //     width: myWidth.value,
  //     height: myHeight.value,
  //   }));

  return (
    <Animated.View
      style={[
        styles.gridItem,
        animatedStyle,
        // {
        //   left: item.x * GRID_CELL_SIZE,
        //   top: item.y * GRID_CELL_SIZE,
        // },
      ]}>
      <Image
        source={item?.image}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          flex: 1,
        }}
      />
      {isEditable && (
        <GestureDetector gesture={panGesture}>
          <View style={styles.draggerContainer}>
            <Animated.View style={styles.tri} />
          </View>
        </GestureDetector>
      )}
      {/* <Text style={{color: 'white'}}>{index + 1}</Text> */}
    </Animated.View>
  );
};

const DenseGrid = ({items, setItems}) => {
  const [isEmptySpace, setIsEmptySpace] = useState(false);
  const [{layout, gridHeight, hasEmptySpace}, setLayoutData] = useState(
    generateGrid(items),
  );
  const [isEditable, setIsEditable] = useState(false);

  const handleResize = (index, newWidth, newHeight) => {
    const updatedItems = items.map((item, i) =>
      i === index ? {...item, width: newWidth, height: newHeight} : item,
    );
    const newLayoutData = generateGrid(updatedItems);
    setItems(updatedItems);
    setLayoutData(newLayoutData);
    setIsEmptySpace(newLayoutData.hasEmptySpace);
  };

  const handleDone = () => {
    if (isEmptySpace) {
      Alert.alert('Warning', 'There are empty spaces in the grid!', [
        {text: 'OK'},
      ]);
    } else {
      setIsEditable(!isEditable);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={layout}
        extraData={layout}
        renderItem={({item, index}) => (
          <GridItem
            item={item}
            onResize={handleResize}
            index={index}
            isEditable={isEditable}
          />
        )}
        keyExtractor={item => item.index.toString()}
        contentContainerStyle={[styles.grid, {height: gridHeight, flexGrow: 1}]}
        bounces={false}
      />
      <TouchableOpacity
        onPress={handleDone}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <Text style={{color: 'white'}}>{isEditable ? 'Done' : 'Edit'}</Text> */}
        <Icon name={isEditable ? 'check' : 'pencil'} size={28} color="white" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const GridItemDraggable = () => {
  // const [items, setItems] = useState(
  //   new Array(10).fill(null).map(() => ({width: 1, height: 1})),
  // );

  const [items, setItems] = useState([
    {width: 1, height: 1, image: require('../assets/images/1.jpeg')},
    {width: 1, height: 1, image: require('../assets/images/2.jpeg')},
    {width: 1, height: 1, image: require('../assets/images/3.jpg')},
    {width: 1, height: 1, image: require('../assets/images/4.jpg')},
    {width: 1, height: 1, image: require('../assets/images/5.jpg')},
    {width: 1, height: 1, image: require('../assets/images/6.jpg')},
    {width: 1, height: 1, image: require('../assets/images/7.jpg')},
    {width: 1, height: 1, image: require('../assets/images/8.jpg')},
    {width: 1, height: 1, image: require('../assets/images/9.jpg')},
    {width: 1, height: 1, image: require('../assets/images/10.jpg')},
    {width: 1, height: 1, image: require('../assets/images/11.jpeg')},
    {width: 1, height: 1, image: require('../assets/images/12.jpeg')},
    {width: 1, height: 1, image: require('../assets/images/13.jpeg')},
    {width: 1, height: 1, image: require('../assets/images/14.jpeg')},
    {width: 1, height: 1, image: require('../assets/images/15.jpeg')},
  ]);

  return (
    <View style={styles.container}>
      <DenseGrid items={items} setItems={setItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    position: 'relative',
    width: GRID_COLUMNS * GRID_CELL_SIZE,
  },
  gridItem: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  draggerContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  tri: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255,255,255,0.5)',
    transform: [{rotate: '180deg'}],
    borderRightWidth: GRID_CELL_SIZE / 2.5,
    borderTopWidth: GRID_CELL_SIZE / 2.5,
  },
});

export default GridItemDraggable;
