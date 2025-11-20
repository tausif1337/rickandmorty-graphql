# 📱 React Native GraphQL App - Beginner's Guide

Welcome! This is a **SIMPLE** React Native app that shows characters from the TV show "Rick and Morty". 

**✨ SIMPLIFIED FOR ABSOLUTE BEGINNERS:**
- ✅ Uses only basic React concepts (useState, Context)
- ✅ No complex reactive variables or advanced patterns
- ✅ Every line of code is explained with comments
- ✅ Clean, easy-to-follow code structure
- ✅ Step-by-step explanations throughout

Even if you've never programmed before, this guide will help you understand how everything works!

## 🎯 What This App Does

This app lets you:
- **Browse characters** from Rick and Morty
- **Navigate** between pages of characters (Previous/Next buttons)
- **View character details** including name, image, status, and species

## 📚 Table of Contents

1. [What You Need to Know First](#what-you-need-to-know-first)
2. [How to Run the App](#how-to-run-the-app)
3. [Understanding the Project Structure](#understanding-the-project-structure)
4. [How Everything Works Together](#how-everything-works-together)
5. [Key Concepts Explained](#key-concepts-explained)
6. [File-by-File Breakdown](#file-by-file-breakdown)

---

## 🎓 What You Need to Know First

### Basic Programming Terms (Don't Worry, It's Simple!)

- **Component**: A piece of code that shows something on the screen (like a button or a list)
- **Function**: A block of code that does a specific job (like "change page")
- **Variable**: A storage box that holds data (like a person's name or a number)
- **Import**: Borrowing code from another file (like borrowing a tool from a friend)
- **Export**: Making code available for other files to use (like lending a tool to a friend)

### What is React Native?

React Native is a tool that lets you build mobile apps (for iPhone and Android) using JavaScript. Instead of learning two different languages for iPhone and Android, you write code once and it works on both!

### What is GraphQL?

GraphQL is a way to ask a server (a computer on the internet) for data. Think of it like ordering at a restaurant - you tell the waiter exactly what you want, and they bring back only that (not extra stuff you don't need).

---

## 🚀 How to Run the App

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download and install Node.js (this gives you the tools to run the app)

### Step 2: Install Dependencies

Open your terminal (command prompt) and run:

```bash
npm install
```

This downloads all the tools and libraries the app needs (like React Native, Apollo Client, etc.).

### Step 3: Start the App

```bash
npm start
```

This starts the app. You'll see a QR code. You can:
- Scan it with the Expo Go app on your phone
- Press `i` to open in iPhone simulator
- Press `a` to open in Android emulator
- Press `w` to open in web browser

---

## 📁 Understanding the Project Structure

```
graph-ql/
├── App.tsx                    # Main entry point (the "home" of the app)
├── index.ts                   # Starts the app
├── package.json               # List of tools the app needs
├── config/
│   └── apolloClient.ts       # Connection to the internet/server
├── context/
│   └── AppContext.tsx        # Global storage (current page, etc.)
├── components/
│   └── CharacterList.tsx     # The main screen users see
└── queries/
    └── characters.ts         # Questions we ask the server
```

### What Each Folder Does

- **`config/`**: Settings and connections (like connecting to the internet)
- **`context/`**: Global storage that all components can access
- **`components/`**: Reusable pieces of the screen (like buttons, lists, etc.)
- **`queries/`**: Questions we ask the server to get data

---

## 🔄 How Everything Works Together

Here's the flow of how the app works:

```
1. App.tsx starts
   ↓
2. Sets up ApolloProvider (connects to server)
   ↓
3. Sets up AppProvider (creates global storage)
   ↓
4. Shows CharacterList component
   ↓
5. CharacterList asks server for characters
   ↓
6. Server sends back character data
   ↓
7. CharacterList displays characters on screen
   ↓
8. User interacts (changes pages)
   ↓
9. App updates and shows new data
```

### Visual Flow

```
┌─────────────────┐
│   App.tsx       │  ← Starts everything
│                 │
│  ┌───────────┐  │
│  │Apollo     │  │  ← Connects to server
│  │Provider   │  │
│  │           │  │
│  │ ┌────────┐│  │
│  │ │App     ││  │  ← Stores current page
│  │ │Provider││  │
│  │ │        ││  │
│  │ │ ┌─────┐││  │
│  │ │ │Char │││  │  ← Shows characters on screen
│  │ │ │List │││  │
│  │ │ └─────┘││  │
│  │ └────────┘│  │
│  └───────────┘  │
└─────────────────┘
```

---

## 🧠 Key Concepts Explained

### 1. Components

A component is like a building block. You combine many components to build a screen.

**Example:**
```javascript
// A simple component that shows text
function WelcomeMessage() {
  return <Text>Hello!</Text>;
}
```

### 2. Props

Props are like instructions you give to a component.

**Example:**
```javascript
// Component that accepts a "name" prop
function Greeting({ name }) {
  return <Text>Hello, {name}!</Text>;
}

// Use it with a prop
<Greeting name="Sarah" />  // Shows: "Hello, Sarah!"
```

### 3. State

State is data that can change. When state changes, the screen updates automatically.

**Example:**
```javascript
// State that stores a number
const [count, setCount] = useState(0);

// When you call setCount(5), the screen updates to show 5
```

### 4. Hooks

Hooks are special functions that give components special powers (like storing data, connecting to servers, etc.).

**Common Hooks:**
- `useState`: Store data that can change
- `useContext`: Access global storage
- `useQuery`: Ask server for data

### 5. Context

Context is like a shared notebook that all components can read and write to. Instead of passing data through many components, you store it in one place.

**Example:**
```javascript
// Get data from context
const { currentPage, setCurrentPage } = useAppContext();
```

### 6. GraphQL Query

A GraphQL query is like a question you ask the server. You specify exactly what data you want.

**Example:**
```graphql
query GetCharacters {
  characters {
    name
    image
  }
}
```

This asks: "Give me characters with their names and images."

### 7. Safe Areas

Safe areas ensure your content doesn't get hidden behind phone features like notches, status bars, or home indicators.

**The Problem:**
Modern phones have:
- **Notches**: The black bar at the top (iPhone X and newer)
- **Status Bar**: Time, battery, signal at the top
- **Home Indicator**: The bar at the bottom (newer iPhones)

Without safe areas, your content could be hidden behind these!

**The Solution:**
- `SafeAreaProvider`: Sets up the safe area system (wrap your entire app)
- `SafeAreaView`: A container that automatically adds padding to avoid these areas

**Example:**
```javascript
<SafeAreaProvider>
  <SafeAreaView edges={["top", "bottom"]}>
    {/* Your content - automatically avoids notch and home indicator */}
  </SafeAreaView>
</SafeAreaProvider>
```

**edges={["top", "bottom"]}** means:
- Add padding at the top (avoid notch/status bar)
- Add padding at the bottom (avoid home indicator)
- Don't add padding on left/right (we want full width)

---

## 📄 File-by-File Breakdown

### 1. `App.tsx` - The Main Entry Point

**What it does:** Sets up the app and wraps everything in providers.

**Key parts:**
- `SafeAreaProvider`: Sets up safe area detection (must be outermost wrapper)
- `ApolloProvider`: Gives all components the ability to talk to the server
- `AppProvider`: Gives all components access to global storage
- `SafeAreaView`: Ensures content doesn't go under notch/status bar/home indicator
- `CharacterList`: The actual screen users see

**Think of it as:** The foundation of a house - everything else sits on top of it.

**Safe Area Setup:**
The app uses a two-layer safe area system:
1. `SafeAreaProvider` (outermost) - Enables safe area detection
2. `SafeAreaView` (around content) - Applies safe area padding with `edges={["top", "bottom"]}`

---

### 2. `config/apolloClient.ts` - Internet Connection

**What it does:** Creates a connection to the Rick and Morty GraphQL server.

**Key parts:**
- `client`: The connection to the server
- `currentPageVar`: Storage for current page number (using Apollo reactive variables)

**Think of it as:** A phone that can call the server to ask for data.

---

### 3. `context/AppContext.tsx` - Global Storage

**What it does:** Creates a global storage system that all components can access.

**Key parts:**
- `AppProvider`: Wraps the app and provides data to all components
- `useAppContext()`: Hook to access the data from any component
- Stores: current page number
- Provides: function to update the current page

**Think of it as:** A shared notebook that everyone in the app can read and write to.

---

### 4. `components/CharacterList.tsx` - The Main Screen

**What it does:** Shows the list of characters and handles user interactions.

**Key parts:**
- `useQuery()`: Asks the server for character data
- `useAppContext()`: Gets current page data
- `FlatList`: Scrollable list of characters
- `TouchableOpacity`: Buttons (Previous, Next)
- Displays character cards with image, name, status, and species

**Think of it as:** The main page of a website - it's what users actually see and interact with.

---

### 5. `queries/characters.ts` - Questions for the Server

**What it does:** Defines the GraphQL query (the question we ask the server).

**Key parts:**
- `GET_CHARACTERS_PAGINATED`: The query that asks for characters
- Parameters: `page` (which page to fetch)
- Returns: character list with pagination info, name, image, status, species

**Think of it as:** A form you fill out to order food at a restaurant.

---

## 🎨 How User Interactions Work

### When User Clicks Next Button:

1. User clicks "Next"
2. `onPress` calls `setCurrentPage(currentPage + 1)`
3. Context updates the page number
4. `useQuery` automatically runs again with new page number
5. Server returns characters for the new page
6. Screen updates to show new characters

### When User Clicks Previous Button:

1. User clicks "Previous"
2. `onPress` calls `setCurrentPage(info.prev)` (uses previous page from API)
3. Context updates the page number
4. `useQuery` automatically runs again with new page number
5. Server returns characters for the previous page
6. Screen updates to show previous characters

---

## 🐛 Common Questions

### Q: What if the app doesn't start?

**A:** Make sure you:
1. Installed Node.js
2. Ran `npm install`
3. Have an internet connection (the app needs to connect to the server)

### Q: What if I see an error?

**A:** 
- Check the terminal for error messages
- Make sure all files are saved
- Try running `npm install` again

### Q: How do I change the number of pages?

**A:** In `CharacterList.tsx`, find this line:
```javascript
const maxPages = 2;
```
Change `2` to whatever number you want.

### Q: How do I change the server URL?

**A:** In `config/apolloClient.ts`, find this line:
```javascript
uri: "https://rickandmortyapi.com/graphql",
```
Change it to your server's address.

---

## 📖 Learning Resources

### For Complete Beginners:

1. **JavaScript Basics**: [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
2. **React Basics**: [React Official Tutorial](https://react.dev/learn)
3. **React Native Basics**: [React Native Docs](https://reactnative.dev/docs/getting-started)

### For This Project:

1. **Apollo Client**: [Apollo Client Docs](https://www.apollographql.com/docs/react/)
2. **GraphQL**: [GraphQL Official Docs](https://graphql.org/learn/)
3. **React Context**: [React Context Docs](https://react.dev/reference/react/useContext)

---

## 🎉 Congratulations!

You now understand how this React Native GraphQL app works! The code is heavily commented, so you can read through each file to learn more.

**Next Steps:**
1. Try changing the colors in the styles
2. Add a new feature (like sorting characters)
3. Experiment with the code and see what happens!

**Remember:** Programming is about experimenting and learning from mistakes. Don't be afraid to try things!

---

## 📝 Summary

This app demonstrates:
- ✅ React Native components
- ✅ GraphQL queries with Apollo Client
- ✅ Global state management with Context API
- ✅ User interactions (pagination)
- ✅ Loading and error states
- ✅ TypeScript for type safety
- ✅ Apollo reactive variables for state management

Everything is explained in simple terms with lots of comments. Happy coding! 🚀
