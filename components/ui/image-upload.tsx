import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { Image } from '~/components/ui/image';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFetch } from '~/hooks/useFetch';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { cn } from '~/lib/utils';
import BasicModal from './basic-modal';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  existingImageUrl?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface ImageSaveResponse {
  putPreSignedUrl: string;
  publicUrl: string;
}

export default function ImageUpload({
  onImageSelected,
  existingImageUrl,
  className,
  placeholder = "Add photo",
  disabled = false,
}: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(existingImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const $fetch = useFetch();

  useEffect(() => {
    setSelectedImage(existingImageUrl || null);
  }, [existingImageUrl]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need camera roll permissions to upload photos.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const generateImageKey = () => {
    return `recipe-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  };

  const uploadToPreSignedUrl = async (preSignedUrl: string, imageUri: string) => {
    try {
      const blob = await fetch(imageUri).then(res => res.blob());

      await fetch(preSignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': blob.type || 'image/jpeg',
        },
      });

      return true;
    } catch (error) {
      console.error('Error uploading to pre-signed URL:', error);
      throw error;
    }
  };

  const handleImageSelection = async (imageUri: string) => {
    try {
      setIsUploading(true);

      // Generate unique key for the image
      const imageKey = generateImageKey();

      // Get pre-signed URL from backend
      const preSignedResponse = await $fetch<ImageSaveResponse>(
        `${API_ENDPOINTS_PREFIX.spring}/images/pre-signed-url?key=${imageKey}&duration=5`
      );


      if (!preSignedResponse) {
        throw new Error('Failed to get pre-signed URL');
      }

      // Upload image to S3
      await uploadToPreSignedUrl(preSignedResponse.putPreSignedUrl, imageUri);

      // Update local state and notify parent
      setSelectedImage(preSignedResponse.publicUrl);
      onImageSelected(preSignedResponse.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert(
        'Upload Error',
        'Failed to upload image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const pickImageFromLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        exif: false,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      // Web doesn't support camera, fallback to library
      await pickImageFromLibrary();
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'We need camera permissions to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
        exif: false,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageSelected('');
  };

  if (selectedImage) {
    console.log(selectedImage);

    return (
      <View className={cn('relative', className)}>
        <Image
          source={{ uri: selectedImage }}
          alt="recipe image"
          className="w-full rounded-lg aspect-square"
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />

        {!disabled && (
          <>
            <TouchableOpacity
              onPress={removeImage}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
            >
              <X size={16} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePhoto}
              className="absolute bottom-2 right-2 bg-black/50 rounded-full p-2"
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </>
        )}

        {isUploading && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center rounded-lg">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-2">Uploading...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={disabled ? undefined : () => setIsModalOpen(true)}
        disabled={disabled || isUploading}
        className={cn(
          'w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-50',
          disabled && 'opacity-50',
          className
        )}
      >
        {isUploading ? (
          <View className="items-center">
            <ActivityIndicator size="large" color={THEME.light.colors.primary} />
            <Text className="text-gray-500 mt-2">Uploading...</Text>
          </View>
        ) : (
          <View className="items-center">
            <ImageIcon size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2 text-center">{placeholder}</Text>
            <Text className="text-gray-400 text-sm mt-1">Tap to add photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <BasicModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <View>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-lg font-semibold'>Add Photo</Text>
            <TouchableOpacity onPress={() => setIsModalOpen(false)}>
              <X size={24} color='#000' />
            </TouchableOpacity>
          </View>

          <View className='gap-4'>
            <Text className='text-sm text-gray-600 text-center mb-2'>
              How would you like to add your photo?
            </Text>

            <TouchableOpacity
              onPress={() => {
                pickImageFromLibrary();
                setIsModalOpen(false);
              }}
              className='w-full border-2 border-primary rounded-xl p-4 bg-primary/5'
            >
              <View className='flex-row items-center'>
                <View className='w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4'>
                  <ImageIcon size={24} color='#F97316' />
                </View>
                <View className='flex-1'>
                  <Text className='font-semibold text-lg'>Choose from Library</Text>
                  <Text className='text-gray-600 text-sm'>
                    Select a photo from your device gallery
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                takePhoto();
                setIsModalOpen(false);
              }}
              className='w-full border border-gray-300 rounded-xl p-4'
            >
              <View className='flex-row items-center'>
                <View className='w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4'>
                  <Camera size={24} color='#6B7280' />
                </View>
                <View className='flex-1'>
                  <Text className='font-semibold text-lg'>Take Photo</Text>
                  <Text className='text-gray-600 text-sm'>
                    Use your camera to capture a new photo
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BasicModal>
    </>
  );
} 