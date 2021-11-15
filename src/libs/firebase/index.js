import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDV6fuPZcXo4sYTbaPvGved0e5ewTaBGqk',
  authDomain: 'industry-logger.firebaseapp.com',
  projectId: 'industry-logger',
  storageBucket: 'industry-logger.appspot.com',
  messagingSenderId: '910560229527',
  appId: '1:910560229527:web:4ddf017c84a670e5c891d2',
}

const firebase = initializeApp(firebaseConfig)
export default firebase