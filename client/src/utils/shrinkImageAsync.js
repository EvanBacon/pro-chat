import { ImageManipulator } from 'expo';
import Settings from '../constants/Settings';

function reduceImageAsync(uri) {
  return ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: Settings.avatarSize } }],
    {
      compress: 0.5,
    },
  );
}
export default reduceImageAsync;
