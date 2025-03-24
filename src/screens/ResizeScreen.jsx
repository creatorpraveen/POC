import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
  Image,
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
} from 'react-native-reanimated';

const {width: screenWidth} = Dimensions.get('window');

const GRID_COLUMNS = 3;
const GRID_CELL_SIZE = screenWidth / GRID_COLUMNS;
const MAX_SIZE_WIDTH = GRID_CELL_SIZE * GRID_COLUMNS;
const MAX_SIZE_HEIGHT = GRID_CELL_SIZE * 2;

const generateGrid = items => {
  let occupied = Array(GRID_COLUMNS).fill(0);
  let layout = [];
  let maxHeight = 0;

  items.forEach((item, index) => {
    let width = item.width || 1;
    let height = item.height || 1;
    let positionFound = false;

    for (let y = 0; !positionFound; y++) {
      for (let x = 0; x <= GRID_COLUMNS - width; x++) {
        let fits = true;
        for (let w = 0; w < width; w++) {
          if (occupied[x + w] > y) {
            fits = false;
            break;
          }
        }

        if (fits) {
          layout.push({x, y, width, height, index});
          for (let w = 0; w < width; w++) {
            occupied[x + w] = y + height;
          }
          maxHeight = Math.max(maxHeight, y + height);
          positionFound = true;
          break;
        }
      }
    }
  });

  return {layout, gridHeight: maxHeight * GRID_CELL_SIZE};
};

const GridItem = ({item, onResize, index}) => {
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
        item.index,
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
        item.index,
        myWidth.value / GRID_CELL_SIZE,
        myHeight.value / GRID_CELL_SIZE,
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: myWidth.value,
    height: myHeight.value,
  }));

  return (
    <Animated.View
      style={[
        styles.gridItem,
        animatedStyle,
        {
          left: item.x * GRID_CELL_SIZE,
          top: item.y * GRID_CELL_SIZE,
        },
      ]}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.draggerContainer}>
            <View style={styles.dragger} />
          </View>
        </GestureDetector>
        <Text style={{color: 'white'}}>{index + 1}</Text>
      </View>
    </Animated.View>
  );
};

const DenseGrid = ({items, setItems}) => {
  const [{layout, gridHeight}, setLayoutData] = useState(generateGrid(items));

  const handleResize = (index, newWidth, newHeight) => {
    const updatedItems = items.map((item, i) =>
      i === index ? {...item, width: newWidth, height: newHeight} : item,
    );
    setItems(updatedItems);
    setLayoutData(generateGrid(updatedItems));
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <FlatList
        data={layout}
        extraData={layout}
        renderItem={({item, index}) => (
          <GridItem item={item} onResize={handleResize} index={index} />
        )}
        keyExtractor={item => item.index.toString()}
        contentContainerStyle={[styles.grid, {height: gridHeight}]}
        bounces={false}
        // scrollEnabled={false}
      />
      <View style={{height: 30}} />
    </GestureHandlerRootView>
  );
};

const ResizeScreen = () => {
  const [items, setItems] = useState(
    new Array(10).fill(null).map(() => ({width: 1, height: 1})),
  );

  return (
    <View style={styles.container}>
      <DenseGrid items={items} setItems={setItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingHorizontal: 20,
  },
  grid: {
    position: 'relative',
    width: GRID_COLUMNS * GRID_CELL_SIZE,
    // minHeight: GRID_CELL_SIZE * 10,
  },
  gridItem: {
    position: 'absolute',
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderColor: 'white',
  },
  draggerContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
    elevation: 10,
  },
  dragger: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
  },
});

export default ResizeScreen;
