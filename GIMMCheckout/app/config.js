// config.js
import Constants from 'expo-constants';

let localhost = 'localhost';

if (Constants?.expoConfig?.hostUri) {
  localhost = Constants.expoConfig.hostUri.split(':')[0];
} else if (Constants?.manifest?.debuggerHost) {
  localhost = Constants.manifest.debuggerHost.split(':')[0];
}

export const API_BASE_URL = __DEV__
  ? `http://${localhost}:5000`
  : 'https://your-production-api.com'; // Replace with your real prod URL
