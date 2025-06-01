
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.healthapp.mobile',
  appName: 'Health Tracker',
  webDir: 'frontend/dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#10b981",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#10b981"
    },
    Camera: {
      permissions: {
        camera: "This app needs camera access to capture photos for health tracking",
        photos: "This app needs photo library access to select images for health records"
      }
    },
    Geolocation: {
      permissions: {
        location: "This app needs location access to track outdoor activities"
      }
    }
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'Health Tracker'
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
