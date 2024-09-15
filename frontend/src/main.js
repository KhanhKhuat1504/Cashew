import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App'; // No need for .tsx extension in the import
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react'
import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";


// Import your publishable key from environment variables
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

ReactDOM.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
    </ClerkProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
