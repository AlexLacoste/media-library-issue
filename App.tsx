import { StatusBar } from 'expo-status-bar';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Video } from 'expo-av';
import { Image } from 'expo-image';

export default function App() {
  const [videos, setVideos] = useState<(MediaLibrary.Asset & {localUri?: string})[]>([]);
  const [activeVideo, setActiveVideo] = useState<(MediaLibrary.Asset & {localUri?: string})>();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    const getVideos = async () => {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      const videos = await MediaLibrary.getAssetsAsync({
        mediaType: 'video',
        first: 10,
      });
      const videosInfo = await Promise.all(videos.assets.map(async (video) => await MediaLibrary.getAssetInfoAsync(video.id)));
      setVideos(videosInfo);
    };
    getVideos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList horizontal data={videos} renderItem={({ item }) => 
        <TouchableOpacity onPress={() => {setActiveVideo(item)}}>
          <Image source={{ uri: item.uri }} style={{ width: 100, height: 100 }}  />
        </TouchableOpacity>} />
        <Text>{activeVideo?.localUri}</Text>
        {activeVideo && <Video source={{ uri: activeVideo.localUri ?? '' }} style={{ width: 300, height: 300 }} shouldPlay />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
