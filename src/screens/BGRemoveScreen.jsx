import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {Buffer} from 'buffer';

const {width, height} = Dimensions.get('window');

const BASE_URL = 'http://192.168.0.212:8000';
const WELCOME = `${BASE_URL}`;
const REMOVE_BG = `${BASE_URL}/remove-bg`;

const colors = [
  '#fffbe6',
  '#050505',
  '#EBE8DB',
  '#D76C82',
  '#ADB2D4',
  '#C7D9DD',
  '#D5E5D5',
  '#EEF1DA',
  '#C1D8C3',
  '#FFA725',
  '#4D55CC',
  '#E6B2BA',
];

const BGRemoveScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [output, setOutput] = useState(null);
  const [bgColor, setBgColor] = useState(null);
  const [debug, setDubeg] = useState(null);

  const selectImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };

      const response = await launchImageLibrary(options);
      console.log('photo response: ', response);

      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorMessage) {
        console.log('Something went wrong with upload', response.errorMessage);
      } else {
        const photoObj = response?.assets[0];

        if (photoObj) {
          setPhoto(photoObj);
          setOutput(null);
          setIsGenerated(false);
        }
      }
    } catch (error) {
      console.log('Error handling image library', error);
      return null;
    }
  };

  const handleRemoveBackground = async () => {
    if (!photo) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        type: photo.type || 'image/png',
        name: photo.fileName || 'image.png',
      });
      formData.append('width', photo.width);
      formData.append('height', photo.height);

      const response = await axios.post(REMOVE_BG, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer', // Ensure we receive raw binary data
      });

      // Convert binary data to Base64
      const base64Image = `data:image/png;base64,${Buffer.from(
        response.data,
        'binary',
      ).toString('base64')}`;

      setOutput(base64Image);
      setIsGenerated(true);
    } catch (error) {
      console.error(
        'Error removing background:',
        error?.response?.data || error,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhoto(null);
    setIsGenerated(false);
    setBgColor(null);
  };

  const handleBackgroundColor = color => {
    if (color === bgColor) {
      setBgColor(null);
    } else {
      setBgColor(color);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
      <View style={styles.profile}>
        <View
          style={{
            flex: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            borderWidth: 2,
            borderStyle: 'dashed',
            backgroundColor: bgColor,
          }}>
          {photo ? (
            <Image
              source={{
                uri: output ? output : photo?.uri,
              }}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
                flex: 1,
              }}
            />
          ) : (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/3342/3342137.png',
              }}
              style={{width: 50, height: 50}}
            />
          )}

          {photo?.uri && (
            <TouchableOpacity
              onPress={handleReset}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: '20',
                height: '20',
                resizeMode: 'contain',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/2976/2976286.png',
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={{flex: 1, flexDirection: 'row', gap: 6}}>
          <TouchableOpacity
            onPress={selectImage}
            style={[
              styles.box,
              {
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
              },
            ]}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/10537/10537442.png',
              }}
              style={{width: 28, height: 28}}
            />
          </TouchableOpacity>
          <ScrollView
            horizontal
            contentContainerStyle={{gap: 6}}
            showsHorizontalScrollIndicator={false}>
            {colors.map((color, index) => (
              <TouchableOpacity
                onPress={() => handleBackgroundColor(color)}
                key={index}
                style={[
                  styles.box,
                  {
                    backgroundColor: color,
                    borderColor: color === bgColor ? 'red' : 'black',
                  },
                ]}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      {photo?.uri && !isGenerated && (
        <TouchableOpacity
          onPress={handleRemoveBackground}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 12,
            backgroundColor: 'black',
            borderRadius: 12,
            width: width * 0.9,
            alignSelf: 'center',
            height: 48,
            position: 'absolute',
            bottom: 48,
          }}>
          {loading ? (
            <ActivityIndicator size={'small'} color={'white'} />
          ) : (
            <Text style={{color: 'white', fontSize: 18}}>
              🪄 Remove Background
            </Text>
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    borderRadius: 12,
    width: width * 0.9,
    height: width * 0.9,
    marginBottom: 12,
    borderWidth: 4,
    borderColor: 'teal',
    backgroundColor: 'white',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'teal',
    minWidth: width * 0.5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  profile: {
    paddingHorizontal: 12,
    marginHorizontal: 12,
    gap: 12,
    height: width * 1.2,
    backgroundColor: 'white',
  },
  box: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: 'black',
  },
});

export default BGRemoveScreen;
