# Expo OTA Updates - Step-by-Step Guide

This guide walks you through implementing and using Over-The-Air (OTA) updates in your Expo React Native application using EAS Update.

---

## Table of Contents

1. [What Are OTA Updates?](#what-are-ota-updates)
2. [Prerequisites](#prerequisites)
3. [Implementation Steps](#implementation-steps)
4. [Configuration Explained](#configuration-explained)
5. [Building Your App](#building-your-app)
6. [Publishing Updates](#publishing-updates)
7. [Testing Updates](#testing-updates)
8. [Update Channels](#update-channels)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## What Are OTA Updates?

Over-The-Air (OTA) updates allow you to push JavaScript and asset updates to your app without going through the App Store or Play Store review process. This means:

- ✅ **Fast Updates**: Deploy bug fixes and new features instantly
- ✅ **No Store Review**: Skip the 1-3 day review process
- ✅ **Targeted Updates**: Send updates to specific user groups via channels
- ✅ **Rollback Capability**: Easily revert to previous versions if needed

**Important Limitations:**
- ❌ Cannot change native code (requires new build)
- ❌ Cannot change app version or build number
- ❌ Cannot change app icons or splash screens
- ❌ Cannot add new native dependencies

---

## Prerequisites

Before starting, ensure you have:

1. ✅ **Expo Account**: Sign up at [expo.dev](https://expo.dev)
2. ✅ **EAS CLI Installed**: `npm install -g eas-cli`
3. ✅ **EAS Account Linked**: Run `eas login`
4. ✅ **Project Configured**: Your project should have `app.json` and `eas.json`

---

## Implementation Steps

### Step 1: Install expo-updates Package

Install the `expo-updates` package which handles OTA updates:

```bash
npx expo install expo-updates
```

This installs the latest compatible version for your Expo SDK.

**What this does:**
- Adds `expo-updates` to your `package.json`
- Provides APIs to check for and download updates
- Enables update functionality in production builds

---

### Step 2: Configure app.json

The following configuration has already been added to your `app.json`:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "enabled": true,
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "plugins": [
      "expo-updates"
    ]
  }
}
```

**Configuration Breakdown:**

- **`runtimeVersion`**: Determines which updates an app can receive
  - `"policy": "appVersion"` means updates are tied to your app version (1.0.0)
  - Apps with different versions won't receive each other's updates
  
- **`updates.enabled`**: Enables OTA updates (set to `false` to disable)
  
- **`updates.fallbackToCacheTimeout`**: Time in milliseconds to wait before falling back to cached bundle
  - `0` means immediate fallback (recommended for most apps)
  
- **`updates.url`**: Your EAS Update server URL (automatically generated from project ID)
  
- **`plugins`**: Includes the `expo-updates` plugin for native configuration

---

### Step 3: Configure eas.json

The following update configuration has been added to your `eas.json`:

```json
{
  "update": {
    "url": "https://u.expo.dev/YOUR_PROJECT_ID"
  },
  "build": {
    "development": {
      "channel": "development"
    },
    "preview": {
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

**Configuration Breakdown:**

- **`update.url`**: Same URL as in `app.json` (your EAS Update endpoint)

- **`build.*.channel`**: Defines which update channel each build profile uses
  - `development`: For development builds
  - `preview`: For internal testing builds
  - `production`: For production builds

**Update Channels:**
- Channels allow you to send different updates to different builds
- A build checks for updates on its assigned channel
- You can publish updates to specific channels

---

### Step 4: Add Update Check in App.tsx

The following code has been added to your `App.tsx` to automatically check for updates:

```typescript
import * as Updates from "expo-updates";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    async function checkForUpdates() {
      // Skip update check in development
      if (__DEV__) return;
      
      try {
        // Check if an update is available
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          // Download the update
          await Updates.fetchUpdateAsync();
          // Reload the app with the new update
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log("Error checking for updates", error);
      }
    }

    checkForUpdates();
  }, []);

  // ... rest of your app
}
```

**What this does:**
- Checks for updates when the app starts (only in production)
- Downloads updates automatically if available
- Reloads the app to apply the update
- Handles errors gracefully

**Update Flow:**
1. App launches → `checkForUpdates()` runs
2. Checks EAS Update server for new updates on the app's channel
3. If update found → downloads it in the background
4. App reloads → new JavaScript bundle is used

---

## Configuration Explained

### Runtime Version Policy

Your app uses `"policy": "appVersion"`, which means:

- Updates are scoped to the app version (e.g., `1.0.0`)
- If you change the version to `1.1.0`, you need a new build
- All apps with version `1.0.0` will receive the same updates

**Alternative Policies:**

```json
// Use app version (current)
"runtimeVersion": {
  "policy": "appVersion"
}

// Use a custom string
"runtimeVersion": {
  "policy": "nativeVersion"
}

// Use a custom value
"runtimeVersion": "1.0.0"
```

---

## Building Your App

### Step 5: Create a Production Build

Before you can use OTA updates, you need to create a production build that includes the update functionality:

#### For iOS:

```bash
eas build --platform ios --profile production
```

#### For Android:

```bash
eas build --platform android --profile production
```

**What happens:**
- EAS creates a build with update functionality enabled
- The build is configured to check the `production` channel
- You'll get a download link or it can be submitted to stores

**Build Profiles:**
- `production`: For App Store/Play Store releases
- `preview`: For internal testing (TestFlight, Internal Testing)
- `development`: For development builds with dev client

---

### Step 6: Install the Build

1. **iOS**: Install via TestFlight or direct download link
2. **Android**: Install the APK/AAB file

**Important:** 
- The first build won't have any updates yet
- After publishing updates, users will receive them on next app launch

---

## Publishing Updates

### Step 7: Make Code Changes

Make any JavaScript/TypeScript changes you want to push:

```typescript
// Example: Update a component
export default function CharacterList() {
  return (
    <View>
      <Text>Updated via OTA!</Text>
    </View>
  );
}
```

**What you can update:**
- ✅ JavaScript/TypeScript code
- ✅ React components
- ✅ Styles and layouts
- ✅ Assets (images, fonts, etc.)
- ✅ GraphQL queries
- ✅ Business logic

**What you cannot update:**
- ❌ Native code changes
- ❌ New native dependencies
- ❌ App version number
- ❌ Native configuration

---

### Step 8: Publish the Update

Publish your changes to the appropriate channel:

```bash
# Publish to production channel
eas update --channel production

# Publish to preview channel
eas update --channel preview

# Publish to development channel
eas update --channel development
```

**What happens:**
- EAS bundles your JavaScript and assets
- Uploads to the EAS Update server
- Associates with the specified channel
- Apps on that channel will receive it on next launch

**Update Message:**
You can add a message to describe the update:

```bash
eas update --channel production --message "Fixed character loading bug"
```

---

### Step 9: Verify Update Published

Check your updates in the Expo dashboard:

1. Go to [expo.dev](https://expo.dev)
2. Select your project
3. Navigate to "Updates" section
4. You'll see all published updates with:
   - Channel name
   - Runtime version
   - Publish date
   - Update message

---

## Testing Updates

### Step 10: Test the Update Flow

1. **Install the production build** on a device/simulator

2. **Open the app** - it will check for updates automatically

3. **Publish a test update:**
   ```bash
   eas update --channel production --message "Test update"
   ```

4. **Close and reopen the app** - the update should be downloaded and applied

5. **Verify changes** - your code changes should be visible

**Testing Tips:**
- Use a test channel for testing updates
- Add console logs to verify update flow
- Test on both iOS and Android
- Test with slow network to see download behavior

---

## Update Channels

### Understanding Channels

Channels allow you to send different updates to different user groups:

```
┌─────────────────────────────────────────┐
│  Production Channel                     │
│  - All production users                 │
│  - Stable, tested updates               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Preview Channel                        │
│  - Internal testers                     │
│  - Beta features                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Development Channel                    │
│  - Developers only                      │
│  - Experimental features                │
└─────────────────────────────────────────┘
```

### Channel Strategy

**Recommended Setup:**

1. **Development Channel**
   - For development builds
   - Frequent updates during development
   - Experimental features

2. **Preview Channel**
   - For TestFlight/Internal Testing
   - Pre-release testing
   - Staged rollouts

3. **Production Channel**
   - For App Store/Play Store builds
   - Stable, tested updates
   - Gradual rollouts

### Publishing to Multiple Channels

You can publish the same update to multiple channels:

```bash
# Publish to preview first
eas update --channel preview --message "New feature"

# Test in preview, then promote to production
eas update --channel production --message "New feature"
```

---

## Best Practices

### 1. Version Management

- **Keep versions consistent**: Use semantic versioning (1.0.0, 1.1.0, etc.)
- **Update version for native changes**: When you change native code, bump version and create new build
- **Document version changes**: Keep a changelog

### 2. Update Strategy

- **Test before production**: Always test updates in preview channel first
- **Gradual rollouts**: Start with a small percentage of users
- **Monitor errors**: Watch for crashes or errors after updates
- **Rollback plan**: Keep previous update available for quick rollback

### 3. Update Messages

Always include descriptive messages:

```bash
# Good
eas update --channel production --message "Fixed crash on character detail screen"

# Bad
eas update --channel production --message "update"
```

### 4. Error Handling

Your update check should handle errors gracefully:

```typescript
try {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }
} catch (error) {
  // Log error but don't crash the app
  console.error("Update check failed:", error);
  // App continues with existing bundle
}
```

### 5. User Experience

- **Silent updates**: Updates download and apply automatically (current implementation)
- **Optional: Show progress**: For large updates, you might want to show a progress indicator
- **Optional: Ask permission**: For critical updates, you might want to ask user before reloading

### 6. Testing Checklist

Before publishing to production:

- [ ] Test update flow in preview channel
- [ ] Verify update downloads correctly
- [ ] Test on both iOS and Android
- [ ] Test with slow network connection
- [ ] Verify no crashes after update
- [ ] Check that all features work correctly
- [ ] Test rollback if needed

---

## Troubleshooting

### Update Not Appearing

**Problem:** Published update but app doesn't receive it

**Solutions:**
1. **Check channel match**: Ensure build channel matches update channel
2. **Check runtime version**: Update and build must have same runtime version
3. **Wait a moment**: Updates may take a few seconds to propagate
4. **Force close app**: Close and reopen the app (updates check on launch)
5. **Check EAS dashboard**: Verify update was published successfully

### Update Check Failing

**Problem:** `checkForUpdateAsync()` throws an error

**Solutions:**
1. **Check network**: Ensure device has internet connection
2. **Check EAS project ID**: Verify `app.json` has correct project ID
3. **Check build type**: Updates only work in production builds, not in development
4. **Check logs**: Look for specific error messages in console

### App Crashes After Update

**Problem:** App crashes after applying update

**Solutions:**
1. **Check for breaking changes**: Ensure update doesn't break existing functionality
2. **Test in preview first**: Always test updates before production
3. **Rollback update**: Publish a previous working version
4. **Check native dependencies**: Ensure you didn't try to add new native code

### Update Takes Too Long

**Problem:** Update download is slow

**Solutions:**
1. **Optimize bundle size**: Reduce JavaScript bundle size
2. **Optimize assets**: Compress images and assets
3. **Show progress**: Implement progress indicator for better UX
4. **Background download**: Updates download in background, app continues working

### Development vs Production

**Important:** Updates only work in production builds, not in development mode.

- **Development mode** (`expo start`): Updates are disabled (as per code: `if (__DEV__) return;`)
- **Production builds**: Updates are enabled and checked automatically

---

## Advanced Usage

### Manual Update Check

You can add a manual "Check for Updates" button:

```typescript
import * as Updates from "expo-updates";

function SettingsScreen() {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      setUpdateAvailable(update.isAvailable);
      
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error("Update check failed:", error);
    }
  };

  return (
    <View>
      <Button title="Check for Updates" onPress={checkForUpdates} />
      {updateAvailable && <Text>Update available!</Text>}
    </View>
  );
}
```

### Update Progress Indicator

Show download progress for large updates:

```typescript
import * as Updates from "expo-updates";

const [progress, setProgress] = React.useState(0);

const downloadUpdate = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      // Note: expo-updates doesn't provide progress callback in current API
      // This is a placeholder for future implementation
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.error("Update failed:", error);
  }
};
```

### Staged Rollouts

Use branches for staged rollouts:

```bash
# Publish to 10% of users
eas update --channel production --branch rollout-10

# Publish to 50% of users
eas update --channel production --branch rollout-50

# Publish to 100% of users
eas update --channel production --branch rollout-100
```

---

## Summary

### Quick Reference

**Install:**
```bash
npx expo install expo-updates
```

**Build:**
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

**Publish Update:**
```bash
eas update --channel production --message "Your update message"
```

**Check Status:**
- Visit [expo.dev](https://expo.dev) → Your Project → Updates

### What's Already Done

✅ `app.json` configured with updates settings  
✅ `eas.json` configured with update channels  
✅ `App.tsx` includes automatic update check  
✅ Update URL configured with your project ID  

### What You Need to Do

1. ✅ Install `expo-updates` package
2. ✅ Create production builds
3. ✅ Publish updates when ready
4. ✅ Test update flow

---

## Additional Resources

- [Expo Updates Documentation](https://docs.expo.dev/versions/latest/sdk/updates/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Forums](https://forums.expo.dev/)

---

**Need Help?** Check the troubleshooting section or visit the Expo documentation for more details.

