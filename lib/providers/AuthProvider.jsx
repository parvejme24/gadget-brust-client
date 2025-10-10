"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, googleProvider } from '@/firebase.config'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  updateProfile,
  signOut,
} from 'firebase/auth'

const AuthContext = createContext(null)

export function useFirebaseAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Firebase is available
    if (!auth) {
      console.warn('Firebase Auth is not available. Authentication features will be disabled.');
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase Auth is not available. Please configure your Firebase credentials.')
    }
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  }

  const loginWithEmail = async (email, password) => {
    if (!auth) {
      throw new Error('Firebase Auth is not available. Please configure your Firebase credentials.')
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  const registerWithEmail = async (email, password, displayName, photoURL) => {
    if (!auth) {
      throw new Error('Firebase Auth is not available. Please configure your Firebase credentials.')
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName || photoURL) {
      await updateProfile(cred.user, { displayName: displayName || null, photoURL: photoURL || null })
    }
    return cred.user
  }

  const changePassword = async (newPassword) => {
    if (!auth) {
      throw new Error('Firebase Auth is not available. Please configure your Firebase credentials.')
    }
    if (!auth.currentUser) throw new Error('No authenticated user')
    await updatePassword(auth.currentUser, newPassword)
    return true
  }

  const updateUserProfile = async ({ displayName, photoURL }) => {
    if (!auth) {
      throw new Error('Firebase Auth is not available. Please configure your Firebase credentials.')
    }
    if (!auth.currentUser) throw new Error('No authenticated user')
    await updateProfile(auth.currentUser, { displayName: displayName ?? auth.currentUser.displayName, photoURL: photoURL ?? auth.currentUser.photoURL })
    // reflect local state immediately
    setUser({ ...auth.currentUser })
    return auth.currentUser
  }

  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not available. Please configure your Firebase credentials.')
    }
    await signOut(auth)
  }

  const value = useMemo(() => ({
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    changePassword,
    updateUserProfile,
    logout,
  }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
