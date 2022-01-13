import React,{useState} from 'react'
import {db , storage} from './firebase'
import Button from '@mui/material/Button'
import {  ref , uploadBytesResumable ,getDownloadURL } from "firebase/storage";
import { collection, addDoc ,serverTimestamp } from "firebase/firestore"; 
import './Upload.css'

function Upload({username}) {

    const [progress,setProgress] = useState(0);
    const [caption,setCaption] = useState('');
    const [image,setImage] = useState(null);

    const handlechange = (e) =>{
        setImage(e.target.files[0])
        if(e.target.files[0] == null)
        alert('no image to post');
    }

    const handleupload = () => {
        
        if(image == null)
        alert('add an image');
        else{
        const imageref = ref(storage, `images/${image.name}`);
        console.log(image.name)
        const uploadTask = uploadBytesResumable(imageref,image);

        uploadTask.on('state_changed',(snapshot) => {
            const Progress=Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(Progress);
            if(Progress === 100)
            setProgress(0)
        },(error) => {
            // Handle unsuccessful uploads
            alert(error.message)
          },() => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(imageref).then(async (downloadURL) => {
                const docRef = await addDoc(collection(db, "user"), {
                    username: username,
                    caption:caption,
                    imageurl:downloadURL,
                    timestamp: serverTimestamp()
                  });
                  console.log("Document written with ID: ", docRef.id);
            });
          })
        }
    }
    return (
        <div className='upload'>
            <input type="text" className='upload_items' placeholder="add-caption" value={caption} onChange={(e) => {setCaption(e.target.value)}}/>
            <input type="file" className='upload_items upload_file_button' onChange = {handlechange}/>
           
            <progress className='upload_items' value={progress} max='100'></progress>
            < Button  color="primary" style={{ marginLeft: '60%', marginTop: '5px' ,background:"white"}} variant="outlined"  onClick={handleupload}>upload</Button>
        </div>
    )
}

export default Upload
