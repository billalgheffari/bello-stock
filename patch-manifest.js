// Adds what the barcode-scanning plugin needs to the generated Android manifest:
// camera permission, and a meta-data tag telling Google Play Services to download
// the on-device barcode model. "npx cap add android" regenerates this file fresh
// on every CI run, so it has to be patched again every time, not just once.
const fs = require('fs');
const path = 'android/app/src/main/AndroidManifest.xml';
let m = fs.readFileSync(path, 'utf8');
let changed = false;

if (!m.includes('android.permission.CAMERA')) {
  m = m.replace(
    /<application/,
    '<uses-permission android:name="android.permission.CAMERA" />\n\n    <application'
  );
  changed = true;
}

if (!m.includes('com.google.mlkit.vision.DEPENDENCIES')) {
  m = m.replace(
    /<application([^>]*)>/,
    '<application$1>\n        <meta-data android:name="com.google.mlkit.vision.DEPENDENCIES" android:value="barcode_ui" />'
  );
  changed = true;
}

if (changed) {
  fs.writeFileSync(path, m);
  console.log('Patched AndroidManifest.xml with camera permission + ML Kit barcode meta-data.');
} else {
  console.log('AndroidManifest.xml already has the barcode-scanning permission and meta-data.');
}
