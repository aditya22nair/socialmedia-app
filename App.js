import React, { useState, useEffect } from 'react';
import Post from './post';
import Upload from './Upload';
import './App.css';
import { q } from './firebase';
import { onSnapshot } from "firebase/firestore";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword ,onAuthStateChanged ,signOut,updateProfile} from "firebase/auth";
import FlashOnIcon from '@mui/icons-material/FlashOn';
function App() {

  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null);

  useEffect(() => {

    onSnapshot(q, (querySnapshot) => {

      const people = [];
      querySnapshot.forEach((doc) => {
        people.push({ id: doc.id, objects: doc.data() });
      })
      setPost(people)
    })

  }, [])

  /////////////////////for signin
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const Sighnup = (event) => {
    event.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        //  setUser(userCredential.user);
        
        // if(userCredential.additionalUserInfo.isNewUser)
        console.log(user)
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  }

  const Sighnin = (event) => {
    event.preventDefault();
    const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    // setUser(userCredential.user);
    console.log(userCredential);
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage)
  });
  }

  useEffect( () =>
  {const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
  
  if (user) {
    console.log(user);
    // const uid = user.uid;
    if(!user.displayName)
    {updateProfile(user, {
      displayName: username
    })}
  
    setUser(user);
    handleClose();
    // ...
  } else {
    setUser(null);
    // User is signed out
    // ...
  }
})} , [user,username] )

const signout = () => {
  const auth = getAuth();
signOut(auth).then(() => {
    setUser(null)// Sign-out successful.
}).catch((error) => {

  alert(error.message);
  // An error happened.
});
}
  

  ////////////////////end signin

  return (
    <div className="App">
      <div className="app_header">
        <h2>volt</h2><FlashOnIcon fontSize='large'/>
        {user ? (<Button style={{ marginLeft: '60%', marginTop: '5px' }} variant="outlined"  onClick={signout}>logout</Button>) :          
          (<Button style={{ marginLeft: '60%', marginTop: '5px' }} variant="contained" onClick={handleOpen}>signin</Button>) 
        }
        
        <Modal
          open={open}
          onClose={handleClose}

        >
          <Box sx={style}>
            <form className="signin">
              <h2>signin</h2>
              <TextField style={{ margin: '10px' }} id="outlined-basic" label="username" variant="outlined" value={username} onChange={(e) => { setUsername(e.target.value) }} />
              <TextField style={{ margin: '10px' }} id="outlined-basic" label="email" variant="outlined" value={email} onChange={(e) => { setEmail(e.target.value) }} />
              <TextField style={{ margin: '10px' }} id="outlined-basic" type='password' label="password" variant="outlined" value={password} onChange={(e) => { setPassword(e.target.value) }} />
              <Button style={{ margin: '10px' }} variant="contained" type='submit' onClick={Sighnin}>login</Button>
              <Button style={{ margin: '10px' }} variant="contained" type='submit' onClick={Sighnup}>signup</Button>
            </form>
          </Box>
        </Modal>
      </div>
      
      {user && <Upload username={username}/>}

      <div className="app_post">
      {
        post.map(({ id, objects }) => {
          return <Post key={id} postid={id} user={user} username={objects.username} imageurl={objects.imageurl} caption={objects.caption} />
        })
      }
      </div>
    </div>
  );
}

export default App;
