const firebase = require('firebase/app');
const { getStorage, ref, uploadBytes } = require('firebase/storage');

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDERID,
  appId: process.env.APPID,
};

firebase.initializeApp(firebaseConfig);

const storage = getStorage();

const uploadFirebase = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const storageRef = ref(storage, `chat/${req.file.filename}`);

  uploadBytes(storageRef, req.file.path).then((snapshot) => {
    console.log('file uplaoded');
  });
  console.log(req.file);
};
module.exports = uploadFirebase;
