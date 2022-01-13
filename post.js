import React,{useState,useEffect} from 'react'
import './post.css';
import Avatar from '@mui/material/Avatar';
import {db}  from './firebase'
import {  onSnapshot ,collection, query ,addDoc , serverTimestamp , orderBy} from "firebase/firestore";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

function Post({postid,user,username,imageurl,caption}) {

    const [comments,setComments] = useState([])
    const [eachcomment, setEachcomment] = useState('')

    //read comment from database
    useEffect(() => {
        let unsubscribe;
        if(postid){
        let comment = [];
        const c = query(collection(db, "user",postid,"comments"),orderBy('timestamp'));
          unsubscribe = onSnapshot(c, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                comment.push({id:doc.id,object:doc.data()});
                // console.log(doc.data());
            });
            setComments(comment); 
            comment=[];
        })
        
        
    }
        return () => {
                unsubscribe();
        }
           
    }, [postid])

    //write comment to database
    const postcomment = async (event) => {
        event.preventDefault();
        const docRef = await addDoc(collection(db, "user",postid,'comments'), {
            user:user.displayName,
            text: eachcomment,
            timestamp: serverTimestamp()
          });
          setEachcomment('')
          console.log("Document written with ID: ", docRef.id);
          
    }
    return (
        <div className='post'>
            <div className="post_header">
            <Avatar className='avatar' alt={username} src="/static/images/avatar/1.jpg" sx={{ width: 24, height: 24 }} />
            <h3>{username}</h3>
            </div>
            
            <img className='post_image' src={imageurl} alt="" />
            <p style={{marginLeft:10,fontWeight:600}}><strong>{username}:</strong> {caption}</p>

            <div className="comments">
                {
                    comments.map(({id,object}) => {
                        
                           return <div>
                            <p><strong>{object.user}</strong>   {object.text}</p>
                            </div>
                        
                    })
                }
            </div>
            {user && 
            <form action="" className="comments_upload">
                <input className='comment_text' type="text" value={eachcomment} placeholder='add a comment...' onChange={e => setEachcomment(e.target.value)} />
                <Button variant="text" style={{color:"white"}} size="small" endIcon={<SendIcon />} className='comment_post' disabled={!eachcomment} onClick={postcomment}>post</Button>
            </form>
            }           
        </div>
    )
}

export default Post;
