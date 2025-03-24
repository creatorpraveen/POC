import React, {useState} from 'react';
import {View, StyleSheet, FlatList, Dimensions, Text} from 'react-native';
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

const {width: screenWidth} = Dimensions.get('window');

const GRID_COLUMNS = 3;
const GRID_CELL_SIZE = screenWidth / GRID_COLUMNS;
const MAX_SIZE_WIDTH = GRID_CELL_SIZE * GRID_COLUMNS;
const MAX_SIZE_HEIGHT = GRID_CELL_SIZE * 2;

// Generating grid pre-defined data and empty data
const generateGrid = items => {
  let grid = Array.from({length: 50}, () => Array(GRID_COLUMNS).fill(null));
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
          layout.push({x, y, width, height, index});

          // Update max height
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
    width: withTiming(myWidth.value, {duration: 150}),
    height: withTiming(myHeight.value, {duration: 150}),
    left: withTiming(item.x * GRID_CELL_SIZE, {duration: 250}),
    top: withTiming(item.y * GRID_CELL_SIZE, {duration: 250}),
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
      <GestureDetector gesture={panGesture}>
        <View style={styles.draggerContainer}>
          <Animated.View style={styles.tri} />
        </View>
      </GestureDetector>
      <Text style={{color: 'white'}}>{index + 1}</Text>
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
        contentContainerStyle={[styles.grid, {height: gridHeight, flexGrow: 1}]}
        bounces={false}
      />
    </GestureHandlerRootView>
  );
};

const Testing = () => {
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

export default Testing;

// SETTINGS
// [
//   {
//     title: 'screens',
//     data: [
//       {id: 1, name: 'Change Business', screen: 'BusinessScreen'},
//       {id: 1, name: 'Tax', screen: 'TaxScreen'},
//       {id: 1, name: 'Payment Method', screen: 'PaymentScreen'},
//       {id: 1, name: 'Terms & Conditions', screen: 'TermsScreen'},
//       {id: 1, name: 'Signature', screen: 'SignatureScreen'},
//     ],
//   },
//   {
//     title: 'toggles',
//     data: [
//       {id: 1, name: 'Paid stamp on device', default: true},
//       {id: 1, name: 'Approved stamp on estimate', default: true},
//       {id: 1, name: 'Place signature below total', default: false},
//       {id: 1, name: 'Business logo watermark', default: false},
//       {id: 1, name: 'Auto save for invoice edits', default: true},
//       {id: 1, name: 'item line number in invoice', default: true},
//     ],
//   },
//   {
//     title: 'modals',
//     data: [
//       {id: 1, name: 'Due Terms', default: '7 Days'},
//       {id: 1, name: 'Default Currency', default: 'INR'},
//       {id: 1, name: 'Number Format', default: '10,00,000.00'},
//       {id: 1, name: 'Date Format', default: '31/01/01'},
//     ],
//   },
// ];
