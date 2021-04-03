import React from 'react';

const ChatInfo = (props) => {
  return (
    <div onClick={()=>props.history.push({pathname: `/inbox/${props.profile._id}`, state: {talkTo: props.profile}})} className="w-full h-14 flex items-center border border-purple-200 p-1 cursor-pointer" >
    	<div className="w-2/12 h-full">
    		<img src={props.profile.img} alt={props.profile.name} className="h-full rounded-full" />
    	</div>
    	<div className="w-10/12 h-full flex flex-col justify-around">
    		<p className="leading-none font-mono font-bold text-xl text-gray-700 truncate">{props.profile.name}</p>
    		<p className="leading-none font-sans text-gray-600 text-lg truncate">@{props.profile.username}</p>
    	</div>
    </div>
  )
}

export default ChatInfo;
