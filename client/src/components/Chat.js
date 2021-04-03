import React from 'react';

const Chat = (props)=>{
	let user = props.message.sender;
	let messages = props.message["message"]
	messages = messages.map(i=>{
		if(i.type==='text'){
			return (<p className="font-sans px-1 break-words">{i.message}</p>)
		}
		else if(i.type==='img'){
			return (<a href={i.message} target="_blank" rel="noreferrer" className="w-full"><img src={i.message} alt='' className="rounded px-1 mt-1 w-full" /></a>)
		}
	})
	if(user._id===props.user._id){
		return (
			<div className="mt-2 bg-purple-500 text-white self-end rounded-t rounded-bl w-3/4 py-1">
	    		{messages}
	    	</div>
			)
	}
	return (
		<div className="flex w-full mt-2 self-start">
    		<img onClick={()=>props.history.push({pathname: "/profile", state: {user: user}}) } src={user.img} alt='' className="w-8 h-8 rounded-full self-end" />
    		<div className="bg-white text-purple-700 rounded-t rounded-br border border-purple-600 shadow-md w-3/4 py-1">
	    		{messages}
	    		<p className="font-sans px-1 leading-none mt-1"></p>
	    	</div>
    	</div>
	)

}

export default Chat;