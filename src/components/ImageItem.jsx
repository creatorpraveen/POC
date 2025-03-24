import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const {width: screenWidth} = Dimensions.get('window');

const GRID_SIZE = 3;
const CELL_SIZE_WIDTH = screenWidth / GRID_SIZE;
const CELL_SIZE_HEIGHT = screenWidth / GRID_SIZE;
const MAX_SIZE_WIDTH = CELL_SIZE_WIDTH * GRID_SIZE;
const MAX_SIZE_HEIGHT = CELL_SIZE_HEIGHT * 2;

const ImageItem = ({item, editMode}) => {
  const myWidth = useSharedValue(CELL_SIZE_WIDTH);
  const myHeight = useSharedValue(CELL_SIZE_HEIGHT);
  const initialWidth = useSharedValue(CELL_SIZE_WIDTH);
  const initialHeight = useSharedValue(CELL_SIZE_HEIGHT);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      initialWidth.value = myWidth.value;
      initialHeight.value = myHeight.value;
    })
    .onUpdate(event => {
      myWidth.value = Math.min(
        MAX_SIZE_WIDTH,
        Math.max(CELL_SIZE_WIDTH, initialWidth.value + event.translationX),
      );
      myHeight.value = Math.min(
        MAX_SIZE_HEIGHT,
        Math.max(CELL_SIZE_HEIGHT, initialHeight.value + event.translationY),
      );
    })
    .onEnd(() => {
      myWidth.value =
        Math.round(myWidth.value / CELL_SIZE_WIDTH) * CELL_SIZE_WIDTH;
      myHeight.value =
        Math.round(myHeight.value / CELL_SIZE_HEIGHT) * CELL_SIZE_HEIGHT;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: myWidth.value,
    height: myHeight.value,
  }));

  return (
    <Animated.View style={[styles.post, animatedStyle]}>
      {editMode && (
        <GestureDetector gesture={panGesture}>
          <View style={styles.draggerContainer}>
            <View style={styles.dragger} />
          </View>
        </GestureDetector>
      )}
      <Image source={item?.src} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  post: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  draggerContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
    elevation: 10,
  },
  dragger: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
  },
});

export default ImageItem;

// fix decresing size instant issue - complete
// fix equal gapping issue - complete
// fix header editable action - complete
// make resizing smooth - complete
// add bouncy and non bouncy version - complete
