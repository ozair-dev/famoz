import React from 'react';
import {Link} from 'react-router-dom'
import ChatInfo from "./ChatInfo"
import openSocket from 'socket.io-client'
export default class Messages extends React.Component {

	constructor(props) {
		super(props);
		this.socket = openSocket()
		// this.socket = openSocket("http://localhost:5000", {
		// 	withCredentials: true,
		// })
		this.socket.on(this.props.user._id, data=>{
			this.updateMessages(data)
		})
		this.socket.on("new group chat", data=>{
			this.updateMessages(data)
		})
	}

	updateMessages = (data)=>{
		let user = {...this.props.user}
		let {messages} = user
		if(!messages){
			messages = []
		}
		messages= messages.filter(doc=>doc._id!==data._id)
		user.messages = [...messages, data]
		this.props.updateUser(user)
	}

	componentDidMount(){
		this.props.changeColor('messages')
	}

	render() {
		let messages = this.props.user.messages?.filter(user=>user.username).reverse().map((user, ind)=><ChatInfo profile={user} history={this.props.history} key={ind} /> )
		if(messages?.length) {
			return (
				<div className="mt-2">
					{messages}
				</div>
				)
		}
		else{
			return (
				<div className='flex flex-col items-center'>
					<p className="mt-8 text-3xl text-purple-500 font-sans text-center">No Messages</p>
					<Link to="/inbox/find" className="mt-2 py-1 px-4 font-mono text-xl text-purple-500 text-center border border-purple-300 shadow-lg rounded-md">Find People</Link>
				</div>
			);
		}
	}
}
