import { auth, googleProvider } from '@/firebase.config'
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updatePassword,
  updateProfile,
  signOut
} from 'firebase/auth'
import api from '../api'

// Firebase Auth + Backend Integration Service
export const firebaseAuthService = {
  // Google Login with Backend Sync
  loginWithGoogle: async () => {
    try {
      // Firebase Google Auth
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Create user data for backend
      const userData = {
        fullName: user.displayName || '',
        email: user.email,
        password: '', // No password for Google users
        profileImage: user.photoURL || ''
      }
      
      // Try to login/register with backend
      let backendResponse
      try {
        // Try login first
        backendResponse = await api.post('/login', {
          email: user.email,
          password: '' // Empty password for Google users
        })
      } catch (loginError) {
        // If login fails, try to register
        backendResponse = await api.post('/register', userData)
      }
      
      return {
        user: backendResponse.data.user,
        token: backendResponse.data.token,
        refreshToken: backendResponse.data.refreshToken
      }
    } catch (error) {
      throw new Error(error.message || 'Google login failed')
    }
  },

  // Email/Password Login with Backend Sync
  loginWithEmail: async (email, password) => {
    try {
      // Firebase Email Auth
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user
      
      // Login with backend using existing endpoint
      const backendResponse = await api.post('/login', {
        email: user.email,
        password: password
      })
      
      return {
        user: backendResponse.data.user,
        token: backendResponse.data.token,
        refreshToken: backendResponse.data.refreshToken
      }
    } catch (error) {
      throw new Error(error.message || 'Email login failed')
    }
  },

  // Email/Password Register with Backend Sync
  registerWithEmail: async (email, password, fullName, photoURL) => {
    try {
      // Firebase Email Register
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user
      
      // Update Firebase profile
      if (fullName || photoURL) {
        await updateProfile(user, { 
          displayName: fullName || null, 
          photoURL: photoURL || null 
        })
      }
      
      // Register with backend using existing endpoint
      const registerData = {
        fullName: fullName || user.displayName || '',
        email: user.email,
        password: password,
        profileImage: photoURL || user.photoURL || ''
      }
      
      console.log('Registering with data:', registerData)
      const backendResponse = await api.post('/register', registerData)
      
      return {
        user: backendResponse.data.user,
        token: backendResponse.data.token,
        refreshToken: backendResponse.data.refreshToken
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
  },

  // Change Password (Firebase only)
  changePassword: async (newPassword) => {
    try {
      if (!auth.currentUser) throw new Error('No authenticated user')
      await updatePassword(auth.currentUser, newPassword)
      return true
    } catch (error) {
      throw new Error(error.message || 'Password change failed')
    }
  },

  // Update Profile (Firebase + Backend)
  updateProfile: async (profileData) => {
    try {
      if (!auth.currentUser) throw new Error('No authenticated user')
      
      // Update Firebase profile
      await updateProfile(auth.currentUser, {
        displayName: profileData.fullName || auth.currentUser.displayName,
        photoURL: profileData.profileImage?.url || auth.currentUser.photoURL
      })
      
      // Update backend profile using existing endpoint
      const backendResponse = await api.put('/profile', {
        fullName: profileData.fullName,
        profileImage: profileData.profileImage?.url || profileData.profileImage || ''
      })
      
      return backendResponse.data.user
    } catch (error) {
      throw new Error(error.message || 'Profile update failed')
    }
  },

  // Logout (Firebase + Backend)
  logout: async () => {
    try {
      // Backend logout
      await api.post('/logout')
      
      // Firebase logout
      await signOut(auth)
      
      return true
    } catch (error) {
      // Even if backend fails, still logout from Firebase
      await signOut(auth)
      throw new Error(error.message || 'Logout failed')
    }
  }
}
