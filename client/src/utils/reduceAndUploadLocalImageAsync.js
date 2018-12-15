import shrinkImageAsync from './shrinkImageAsync';
import uploadImageAsync from './uploadImageAsync';

async function reduceAndUploadLocalImageAsync(
  uri,
  storagePath,
  onProgressUpdated,
) {
  if (!uri || uri === '')
    throw new Error('reduceAndUploadLocalImageAsync: Empty Local URL provided');

  const { uri: reducedImageUri } = await shrinkImageAsync(uri);
  try {
    const downloadURL = await uploadImageAsync(
      reducedImageUri,
      storagePath,
      onProgressUpdated,
    );
    return downloadURL;
  } catch ({ code, message }) {
    console.warn('ProfileImage: Error: ', message);
    alert(message);
  }
}

export default reduceAndUploadLocalImageAsync;
