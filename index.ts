/**
 * index.ts - The Very First File That Runs
 * 
 * This is the entry point of the app - the first file that runs when the app starts.
 * Think of it like the "on" button for your app.
 * 
 * WHAT THIS FILE DOES:
 * Registers the App component so React Native knows what to show on the screen.
 * 
 * You don't need to modify this file - it just tells the system to start your app!
 */

// Import the function that registers our app
import { registerRootComponent } from 'expo';

// Import our main App component (the one we created in App.tsx)
import App from './App';

/**
 * registerRootComponent - Starts the App
 * 
 * This function:
 * 1. Tells React Native that "App" is the main component
 * 2. Makes sure everything works whether you're using:
 *    - Expo Go (testing app on your phone)
 *    - A native build (actual app installed on your phone)
 * 
 * Think of it like telling the phone: "Hey, when you start, show the App component!"
 */
registerRootComponent(App);
