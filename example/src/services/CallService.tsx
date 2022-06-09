import { PermissionsAndroid, Platform } from 'react-native';
import RtcEngine, {
  CameraCaptureOutputPreference,
  CameraDirection,
  ChannelProfile,
  ClientRole,
  RtcEngineContext,
} from 'react-native-agora';

const config = require('../../src/config/agora.config.json');

let _engine: RtcEngine;
let remoteUid: number[] = [];
let is_host: boolean = false;

const CallService = {
  _remoteUid: remoteUid,
  _isHost: is_host,
  _initEngine: async (callBack?: () => void) => {
    _engine = await RtcEngine.createWithContext(
      new RtcEngineContext(config.appId)
    );

    callBack?.();
    await _engine.setVideoEncoderConfiguration({
      dimensions: { width: 1280, height: 720 },
      frameRate: 30,
    });

    if (is_host) {
      await _engine.setCameraCapturerConfiguration({
        preference: CameraCaptureOutputPreference.Auto,
        cameraDirection: CameraDirection.Rear,
      });
    }

    const Role = is_host ? ClientRole.Broadcaster : ClientRole.Audience;
    await _engine.setClientRole(Role);

    await _engine.muteLocalAudioStream(is_host ? false : true);

    await _engine.enableVideo();
    await _engine.startPreview();
    await _engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await _engine.setClientRole(ClientRole.Broadcaster);

    return _engine;
  },

  _joinChannel: async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
    await _engine?.joinChannel(
      config.token,
      config.channelId,
      null,
      config.uid
    );
  },

  _leaveChannel: async () => {
    await _engine?.leaveChannel();
  },
};

export default CallService;
