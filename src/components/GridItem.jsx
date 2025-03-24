import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const {width: screenWidth} = Dimensions.get('window');
const CELL_SIZE = 100;

const GridItem = ({item, editMode}) => {
  const boxWidth = useSharedValue(item.width * CELL_SIZE);
  const boxHeight = useSharedValue(item.height * CELL_SIZE);
  const initialWidth = useSharedValue(CELL_SIZE);
  const initialHeight = useSharedValue(CELL_SIZE);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      initialWidth.value = myWidth.value;
      initialHeight.value = myHeight.value;
    })
    .onUpdate(e => {
      boxWidth.value = withSpring(
        Math.max(CELL_SIZE, e.translationX + item.width * CELL_SIZE),
      );
      boxHeight.value = withSpring(
        Math.max(CELL_SIZE, e.translationY + item.height * CELL_SIZE),
      );
    })
    .onEnd(() => {
      boxWidth.value = Math.round(boxWidth.value / CELL_SIZE) * CELL_SIZE;
      boxHeight.value = Math.round(boxHeight.value / CELL_SIZE) * CELL_SIZE;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <Image source={require('../assets/images/1.jpeg')} style={styles.image} />
      {editMode && (
        <GestureDetector gesture={panGesture}>
          <View style={styles.dragger} />
        </GestureDetector>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {overflow: 'hidden', borderWidth: 1, borderColor: 'blue'},
  image: {width: '100%', height: '100%', resizeMode: 'cover'},
  dragger: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    backgroundColor: 'red',
  },
});

export default GridItem;
