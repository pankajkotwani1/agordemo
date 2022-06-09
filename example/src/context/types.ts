import type { ViewStyle } from 'react-native';

export interface PIPProps {
  show?: boolean;
  setShowPopup?: (val: boolean) => void;
  innerContent?: string;
  setInnerContent?: (val: string) => void;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  onCloseIconPress?: () => void;
  closeIcon?: boolean;
  childrenView?: any;
}
