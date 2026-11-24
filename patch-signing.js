// Makes every CI build sign the debug APK with the SAME key (ci-debug.keystore,
// committed in this repo), instead of a random one each run. Without this, Android
// sees each build as "a different app" and refuses to install it over the last one.
const fs = require('fs');
const path = 'android/app/build.gradle';
let g = fs.readFileSync(path, 'utf8');

if (!g.includes('signingConfigs')) {
  g = g.replace(
    /android \{/,
    'android {\n' +
    '    signingConfigs {\n' +
    '        debug {\n' +
    "            storeFile file('../../ci-debug.keystore')\n" +
    "            storePassword 'android'\n" +
    "            keyAlias 'androiddebugkey'\n" +
    "            keyPassword 'android'\n" +
    '        }\n' +
    '    }'
  );
  g = g.replace(
    /buildTypes \{/,
    'buildTypes {\n' +
    '        debug {\n' +
    '            signingConfig signingConfigs.debug\n' +
    '        }'
  );
  fs.writeFileSync(path, g);
  console.log('Patched android/app/build.gradle to sign debug builds with ci-debug.keystore.');
} else {
  console.log('build.gradle already has a signingConfigs block, leaving it as-is.');
}
