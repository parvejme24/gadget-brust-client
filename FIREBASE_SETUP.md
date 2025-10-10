# Firebase Setup Guide

This guide will help you set up Firebase authentication for your Gadget Brust application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "gadget-brust")
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the authentication methods you want to use:
   - Email/Password
   - Google (recommended)

## Step 3: Get Your Firebase Configuration

1. In your Firebase project, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname (e.g., "gadget-brust-web")
5. Copy the Firebase configuration object

## Step 4: Create Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Replace the placeholder values with your actual Firebase configuration values.

## Step 5: Configure Google Authentication (Optional)

If you want to enable Google sign-in:

1. In Firebase Console, go to Authentication > Sign-in method
2. Click on "Google" provider
3. Toggle "Enable"
4. Add your project's support email
5. Save the changes

## Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Check the browser console for any Firebase warnings
3. Try to access authentication features in your app

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

This error occurs when Firebase configuration is missing or incorrect. Make sure:

1. Your `.env.local` file exists in the project root
2. All environment variables are properly set
3. The API key and other credentials are correct
4. You've restarted your development server after adding environment variables

### Error: "Firebase Auth is not available"

This is a fallback message when Firebase is not properly configured. The app will still work, but authentication features will be disabled.

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- All environment variables starting with `NEXT_PUBLIC_` are exposed to the client-side
- Make sure your Firebase project has proper security rules

## Production Deployment

When deploying to production:

1. Set the environment variables in your hosting platform
2. Update the `NEXT_PUBLIC_API_URL` to your production API URL
3. Configure authorized domains in Firebase Console
4. Set up proper security rules for your Firebase project

## Example Firebase Configuration

Your Firebase configuration should look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "gadget-brust.firebaseapp.com",
  projectId: "gadget-brust",
  storageBucket: "gadget-brust.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Need Help?

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify your Firebase project is properly set up
3. Make sure all environment variables are correctly formatted
4. Restart your development server after making changes

