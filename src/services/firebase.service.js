import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  sendEmailVerification,
  applyActionCode,
  deleteUser,
} from 'firebase/auth'
import Vue from 'vue'

export default class FirebaseService {
  static signIn = async (email, password) => {
    const { user } = await signInWithEmailAndPassword(getAuth(), email, password)
    return user
  }

  static signOut = async () => {
    await signOut(getAuth())
    Vue.$cookies.remove('accessToken')
  }

  static createUserWithEmailAndPassword = async (email, password) => {
    await createUserWithEmailAndPassword(getAuth(), email, password)
  }

  static sendValidationEmail = async () => {
    await sendEmailVerification(getAuth().currentUser)
  }

  static verifyEmail = async code => {
    const auth = getAuth()
    await applyActionCode(auth, code)
  }

  static deleteSignedUser = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    await deleteUser(user)
  }
}