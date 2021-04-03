import React, {useState} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom'
import Messages from './Messages'
import Find from './Find'
import Talk from './Talk'
import {BiSearch} from 'react-icons/bi'
const Inbox = (props) => {
	const [messagesColor, setMessagesColor] = useState("text-purple-500 bg-white rounded-tr-md") 
	const [findColor, setFindColor] = useState('text-white')
	let changeColor = (button)=>{
		if(button==='messages'){
			setMessagesColor("text-purple-500 bg-white rounded-tr-md");
			setFindColor("text-white")
		}
		else if(button==="find"){
			setMessagesColor("text-white");
			setFindColor("text-purple-500 bg-white rounded-tl-md")
		}
	}
	if(!props.user) return (<Redirect to="/login" />)
	else{
		return (
		    <div className="w-full ">
		    	<div className="fixed top-13 h-8 w-full md:w-1/3 flex justify-around bg-purple-600">
		    		<Link to='/inbox' className={`w-1/2 text-2xl text-center ${messagesColor} focus:outline-none`}>Messages</Link>
		    		<Link to='/inbox/find' className={`w-1/2 flex items-center text-2xl justify-center ${findColor}  focus:outline-none`}>Find <BiSearch className="ml-1"/></Link>
		    	</div>
		    	<div className="pt-7">
		    		<Switch>
			    		<Route path="/inbox" exact render={()=><Messages user={props.user} updateUser={props.updateUser} history={props.history} changeColor={changeColor} /> } />
			    		<Route path="/inbox/find" render={()=><Find changeColor={changeColor} user={props.user} history={props.history} /> } />
			    		<Route path='/inbox/:id'render={()=><Talk location={props.location} history={this.props.history} user={props.user} changeColor={changeColor} /> } />
			    	</Switch>
		    	</div>
		    </div>
		)
	}
}

export default Inbox;