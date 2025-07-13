
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';

export class NativeServices {
  // Camera Services
  static async capturePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      return image;
    } catch (error) {
      console.error('Error capturing photo:', error);
      throw error;
    }
  }

  static async selectFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      return image;
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      throw error;
    }
  }

  // Device Information
  static async getDeviceInfo() {
    try {
      const info = await Device.getInfo();
      return info;
    } catch (error) {
      console.error('Error getting device info:', error);
      throw error;
    }
  }

  // Haptic Feedback
  static async vibrate(style: ImpactStyle = ImpactStyle.Medium) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Error with haptic feedback:', error);
    }
  }

  // Status Bar
  static async setStatusBarStyle(style: Style) {
    try {
      await StatusBar.setStyle({ style });
    } catch (error) {
      console.error('Error setting status bar style:', error);
    }
  }

  // File System
  static async saveFile(data: string, fileName: string) {
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }

  static async readFile(fileName: string) {
    try {
      const result = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      return result.data;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  // Preferences (Storage)
  static async setPreference(key: string, value: string) {
    try {
      await Preferences.set({ key, value });
    } catch (error) {
      console.error('Error setting preference:', error);
      throw error;
    }
  }

  static async getPreference(key: string) {
    try {
      const result = await Preferences.get({ key });
      return result.value;
    } catch (error) {
      console.error('Error getting preference:', error);
      throw error;
    }
  }

  // Share
  static async shareContent(title: string, text: string, url?: string) {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'Compartilhar dados de saúde'
      });
    } catch (error) {
      console.error('Error sharing content:', error);
      throw error;
    }
  }

  // Browser
  static async openUrl(url: string) {
    try {
      await Browser.open({ url });
    } catch (error) {
      console.error('Error opening URL:', error);
      throw error;
    }
  }

  // Network
  static async getNetworkStatus() {
    try {
      const status = await Network.getStatus();
      return status;
    } catch (error) {
      console.error('Error getting network status:', error);
      throw error;
    }
  }

  // Geolocation
  static async getCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates;
    } catch (error) {
      console.error('Error getting current position:', error);
      throw error;
    }
  }

  // App State
  static addAppStateListener(callback: (state: any) => void) {
    App.addListener('appStateChange', callback);
  }

  static removeAllListeners() {
    App.removeAllListeners();
  }
}
