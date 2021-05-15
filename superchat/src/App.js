import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
	apiKey: "AIzaSyAetN62HrfwIj5PrHprzBf1oslXyGnf_OM",
    authDomain: "superchat-7dec0.firebaseapp.com",
    projectId: "superchat-7dec0",
    storageBucket: "superchat-7dec0.appspot.com",
    messagingSenderId: "327851414931",
    appId: "1:327851414931:web:4867f24a1c4112cca70466"
});


const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

	const [user]=useAuthState(auth);

	return (
	<div className="App">
		<header>
			<h1>⚛️🔥💬</h1>
			<SignOut />
		</header>
		
		<section>
			{
				user? <ChatRoom/> : <SignIn/>
			}
		</section>
	</div>
  );
}


function SignIn(){

	const SignInWithGoogle=()=>{
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	}

	return(
		<button onClick={SignInWithGoogle}>Sign in with Google</button>
	);
}

function SignOut(){
	return auth.currentUser && (
		<button onClick={()=>auth.signOut()}>Sign out</button>
	);
}

function ChatRoom(){
	const dummy = useRef();
	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit(25);
  
	const [messages] = useCollectionData(query, { idField: 'id' });
  
	const [formValue, setFormValue] = useState('');
  
  
	const sendMessage = async (e) => {
		e.preventDefault();

		const { uid, photoURL } = auth.currentUser;

		await messagesRef.add({
			text: formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid,
			photoURL
		})

		setFormValue('');
		dummy.current.scrollIntoView({ behavior: 'smooth' });	
	}

	useEffect(()=>{
		dummy.current.scrollIntoView({ behavior: 'smooth' });	
	});


	return (
		<>
			<main>
		
				{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
			
				<span ref={dummy}></span>
		
			</main>
		
			<form onSubmit={sendMessage}>
		
				<input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
			
				<button type="submit" disabled={!formValue}>🕊️</button>
		
			</form>
	  	</>
	);
}


function ChatMessage(props) {
	const { text, uid, photoURL } = props.message;

	const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

	return (
		<>
			<div className={`message ${messageClass}`}>
			<img src={photoURL || 'data:image/jpeg;base64,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'} />
			<p>{text}</p>
			</div>
		</>
	);
}
  

export default App;
