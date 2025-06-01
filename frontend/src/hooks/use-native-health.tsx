
import { useState, useEffect } from 'react';
import { NativeServices } from '../services/native-services';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';

interface HealthData {
  steps: number;
  heartRate: number;
  calories: number;
  distance: number;
}

interface NativeHealthState {
  isNative: boolean;
  deviceInfo: any;
  networkStatus: any;
  healthData: HealthData;
  isConnected: boolean;
}

export function useNativeHealth() {
  const [state, setState] = useState<NativeHealthState>({
    isNative: false,
    deviceInfo: null,
    networkStatus: null,
    healthData: {
      steps: 0,
      heartRate: 0,
      calories: 0,
      distance: 0
    },
    isConnected: false
  });

  useEffect(() => {
    checkNativeEnvironment();
    setupListeners();
    
    return () => {
      NativeServices.removeAllListeners();
    };
  }, []);

  const checkNativeEnvironment = async () => {
    try {
      const deviceInfo = await Device.getInfo();
      const networkStatus = await Network.getStatus();
      
      setState(prev => ({
        ...prev,
        isNative: deviceInfo.platform !== 'web',
        deviceInfo,
        networkStatus,
        isConnected: networkStatus.connected
      }));
    } catch (error) {
      console.error('Error checking native environment:', error);
    }
  };

  const setupListeners = () => {
    // App state listener
    NativeServices.addAppStateListener((state) => {
      console.log('App state changed:', state);
    });

    // Network listener
    Network.addListener('networkStatusChange', (status) => {
      setState(prev => ({
        ...prev,
        networkStatus: status,
        isConnected: status.connected
      }));
    });
  };

  const captureHealthPhoto = async () => {
    try {
      await NativeServices.vibrate();
      const photo = await NativeServices.capturePhoto();
      return photo;
    } catch (error) {
      console.error('Error capturing health photo:', error);
      throw error;
    }
  };

  const selectHealthImage = async () => {
    try {
      const image = await NativeServices.selectFromGallery();
      return image;
    } catch (error) {
      console.error('Error selecting health image:', error);
      throw error;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const position = await NativeServices.getCurrentPosition();
      return position;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  };

  const shareHealthData = async (data: any) => {
    try {
      await NativeServices.shareContent(
        'Dados de Saúde',
        `Compartilhando meus dados de saúde: ${JSON.stringify(data)}`,
        'https://healthapp.com'
      );
    } catch (error) {
      console.error('Error sharing health data:', error);
      throw error;
    }
  };

  const saveHealthRecord = async (record: any) => {
    try {
      const fileName = `health-record-${Date.now()}.json`;
      await NativeServices.saveFile(JSON.stringify(record), fileName);
      return fileName;
    } catch (error) {
      console.error('Error saving health record:', error);
      throw error;
    }
  };

  const connectToAppleHealth = async () => {
    // Simulação de conexão com Apple Health
    // Em um app real, você usaria um plugin específico do HealthKit
    try {
      if (state.deviceInfo?.platform === 'ios') {
        await NativeServices.setPreference('apple_health_connected', 'true');
        setState(prev => ({
          ...prev,
          healthData: {
            steps: 8456,
            heartRate: 72,
            calories: 1850,
            distance: 6.2
          }
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting to Apple Health:', error);
      return false;
    }
  };

  const connectToGoogleFit = async () => {
    // Simulação de conexão com Google Fit
    // Em um app real, você usaria a API do Google Fit
    try {
      if (state.deviceInfo?.platform === 'android') {
        await NativeServices.setPreference('google_fit_connected', 'true');
        setState(prev => ({
          ...prev,
          healthData: {
            steps: 7823,
            heartRate: 75,
            calories: 1920,
            distance: 5.8
          }
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
      return false;
    }
  };

  return {
    ...state,
    captureHealthPhoto,
    selectHealthImage,
    getCurrentLocation,
    shareHealthData,
    saveHealthRecord,
    connectToAppleHealth,
    connectToGoogleFit,
    vibrate: NativeServices.vibrate,
    openUrl: NativeServices.openUrl
  };
}
