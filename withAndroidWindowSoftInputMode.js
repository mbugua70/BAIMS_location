// withAndroidWindowSoftInputMode.js
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidWindowSoftInputMode(config) {
  return withAndroidManifest(config, (config) => {
    // Find the MainActivity entry in AndroidManifest
    const mainActivity = config.modResults.manifest.application[0].activity.find(
      (activity) =>
        activity['$']['android:name'] === '.MainActivity' ||
        activity['$']['android:name'] === 'com.yourapp.MainActivity'
    );

    if (mainActivity) {
      // Add or overwrite the windowSoftInputMode attribute
      mainActivity['$']['android:windowSoftInputMode'] = 'adjustNothing';
    }

    return config;
  });
};
