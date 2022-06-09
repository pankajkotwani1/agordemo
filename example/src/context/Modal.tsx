import React, { useRef } from 'react';
import { Animated, PanResponder, Text, TouchableOpacity } from 'react-native';
import JoinChannelVideo from '../examples/basic/JoinChannelVideo/JoinChannelVideo';
import { usePIPMode } from './useModal';

// Render Popup with content
const PIPPopup = () => {
  const { show, setShowPopup } = usePIPMode();

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        undefined
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return show ? (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        position: 'absolute',
        bottom: 90,
        right: 120,
      }}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        disabled
        style={{
          flex: 1,
          height: 350,
          width: 200,
          backgroundColor: '#6C63FF',
        }}
      >
        <>
          <JoinChannelVideo />
          <Text
            style={{ color: 'white' }}
            onPress={() => {
              setShowPopup(false);
            }}
          >
            CLOSE
          </Text>
        </>
      </TouchableOpacity>
    </Animated.View>
  ) : (
    <></>
  );
};

export default PIPPopup;
