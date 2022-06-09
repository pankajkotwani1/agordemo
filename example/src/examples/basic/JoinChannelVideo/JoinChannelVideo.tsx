import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, { RtcLocalView, RtcRemoteView } from 'react-native-agora';
import CallService from '../../../../src/services/CallService';
import Item from '../../../components/Item';
import { usePIPMode } from '../../../context/useModal';

const config = require('../../../config/agora.config.json');

let _engine: RtcEngine;

const JoinChannelVideo = ({ navigation }) => {
  const [channelId, setChannelId] = useState<string>(config.channelId);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [switchCamera, setSwitchCamera] = useState<boolean>(true);
  const [switchRender, setSwitchRender] = useState<boolean>(true);
  const [remoteUid, setRemoteUid] = useState<number[]>(CallService._remoteUid);
  const [is_host, setIsHost] = useState<boolean>(CallService._isHost);
  const [isRenderTextureView, setIsRenderTextureView] =
    useState<boolean>(false);

  const { setShowPopup, show } = usePIPMode();

  useEffect(() => {
    show ? null : CallService._initEngine();

    const setAgoraInstance = async () => {
      _engine = await CallService._initEngine();
      if (_engine) {
        _addListeners(_engine);
      }
    };

    setAgoraInstance();
    const showPip = () => {
      setShowPopup(true);
    };

    const subscribe = navigation?.addListener('blur', () => showPip());

    BackHandler.addEventListener('hardwareBackPress', () => showPip());
    return () => {
      subscribe();
      BackHandler.removeEventListener('hardwareBackPress', () => null);
    };
  }, []);

  const _addListeners = (_engine: RtcEngine) => {
    _engine?.addListener('Warning', (warningCode) => {
      console.log('Warning', warningCode);
    });
    _engine?.addListener('Error', (errorCode) => {
      console.log('Error', errorCode);
    });

    _engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      setIsJoined(true);
    });
    _engine?.addListener('LeaveChannel', (stats) => {
      console.log('LeaveChannel', stats);
      setIsJoined(false);
      CallService._remoteUid = [];
      setRemoteUid([]);
    });
    _engine?.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      CallService._remoteUid = [...remoteUid, uid];
      setRemoteUid([...remoteUid, uid]);
    });
    _engine?.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      CallService._remoteUid = remoteUid?.filter((value) => value !== uid);
      setRemoteUid(remoteUid?.filter((value) => value !== uid));
    });
    _engine?.addListener('RejoinChannelSuccess', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // setRemoteUid([...remoteUid, uid]);
    });
  };

  const _switchCamera = () => {
    console.log('_engine', _engine);
    _engine
      ?.switchCamera()
      .then(() => {
        setSwitchCamera(!switchCamera);
      })
      .catch((err) => {
        console.warn('switchCamera', err);
      });
  };

  const _switchRender = () => {
    setSwitchRender(!switchRender);
    CallService._remoteUid = CallService._remoteUid?.reverse();
  };

  const _switchRenderView = (value: boolean) => {
    setIsRenderTextureView(value);
  };

  const _renderVideo = () => {
    return (
      <View style={styles.container}>
        {/* {isRenderTextureView ? (
          <RtcLocalView.TextureView style={styles.local} />
        ) : (
          <RtcLocalView.SurfaceView style={styles.local} />
        )} */}

        {is_host && <RtcLocalView.SurfaceView style={styles.local} />}

        {!is_host &&
          remoteUid &&
          remoteUid?.length > 0 &&
          remoteUid?.map((value) => (
            <RtcRemoteView.SurfaceView
              style={styles.local}
              uid={value}
              zOrderMediaOverlay={true}
            />
          ))}

        {/* {remoteUid !== undefined && (
          <ScrollView horizontal={true} style={styles.remoteContainer}>
            {remoteUid?.map((value, index) => (
              <TouchableOpacity
                key={index}
                style={show ? styles.remotePip : styles.remote}
                onPress={() => _switchRender()}
              >
                {isRenderTextureView ? (
                  <RtcRemoteView.TextureView
                    style={styles.container}
                    uid={value}
                  />
                ) : (
                  <RtcRemoteView.SurfaceView
                    style={styles.container}
                    uid={value}
                    zOrderMediaOverlay={true}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )} */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {show ? null : (
        <>
          <View style={styles.top}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setChannelId(text)}
              placeholder={'Channel ID'}
              value={channelId}
            />
            <Button
              onPress={
                isJoined ? CallService._leaveChannel : CallService._joinChannel
              }
              title={`${isJoined ? 'Leave' : 'Join'} channel`}
              color={'black'}
            />
          </View>
          {Platform.OS === 'android' && (
            <Item
              title={'Rendered By TextureView (Default SurfaceView):'}
              isShowSwitch
              onSwitchValueChange={_switchRenderView}
            />
          )}
        </>
      )}
      {_renderVideo()}
      <View style={styles.float}>
        <Button
          onPress={() => _switchCamera()}
          title={`Camera ${switchCamera ? 'front' : 'rear'}`}
          color={'black'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  float: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  top: {
    width: '100%',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    color: 'black',
  },
  local: {
    flex: 1,
  },
  remoteContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  remote: {
    width: 200,
    height: 200,
  },
  remotePip: {
    width: 100,
    height: 100,
    // position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  pipMode: {
    height: 350,
    width: 200,
  },
});

export default JoinChannelVideo;
