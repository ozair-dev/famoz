import React, {useRef, useEffect} from 'react';
import {Redirect} from 'react-router-dom'
import {BiImageAdd} from 'react-icons/bi'
import {AiOutlineSend} from 'react-icons/ai'
import {VscLoading} from 'react-icons/vsc'
import openSocket from 'socket.io-client'
import Chat from "./Chat"
import axios from 'axios'
// this component always stays on bottom of a div, helpful for scrolling to botton in Chat
const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

export default class Talk extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				message: "",
				type: "text"
			},
			messages: [],
			uploading: false,
			imgIcon: "bg-white border-2 border-purple-500 text-purple-700",
			loadMessageIndex: 0,
			stayOnBottom: true,
			showLoadMoreButton: false
		}
		this.socket = openSocket("http://localhost:5000", {
			withCredentials: true,
		})
		this.socket.on(this.chatName(), data=>this.addMessage(data))
	}
	chatName = ()=>{
		let name;
		if(this.props.location.state.talkTo.type==='person'){
			name = [this.props.user._id,this.props.location.state.talkTo._id].sort();
		}else{
			name = [this.props.location.state.talkTo._id]
		}
		name = name.join("-")
		return name
	}
	minify = (chat)=>{
		let msgs = []
		for (let i in chat){
			if(msgs[msgs.length-1]?.sender._id===chat[i].sender._id){
	    		msgs[msgs.length-1].message = msgs[msgs.length-1].message.concat(chat[i].message)
	  		}else{
	  			msgs.push(chat[i])
	  		}
		}
		return msgs
	}
	componentDidMount(){
		this.props.changeColor('messages')
		axios.get(`/chat/${this.chatName()}/0`)
		.then(res=>{
			if(res.data.chat){
				let msgs = this.minify(res.data.chat)
				this.setState({messages: msgs, loadMessageIndex: 20})
				if(res.data.chat.length===20){
	  			this.setState({showLoadMoreButton: true})
	  			}
			}
		})
		.catch(err=>console.log(err))
  	}
  	addMessage = (mesg)=>{
  		let {messages} = this.state
  		let lastMessage = messages[messages.length-1]
  		let {sender} = mesg
		if(messages.length && lastMessage.sender._id===sender._id){
  			lastMessage.message.push({type: mesg.data.type, message: mesg.data.message})
  			messages[messages.length-1]= lastMessage;
  		}
  		else{
  			let newMesg = {sender: sender, message: [{type: mesg.data.type, message: mesg.data.message}]}
  			messages.push(newMesg)
  		}
  		this.setState(({loadMessageIndex})=>({messages: messages, stayOnBottom: true, loadMessageIndex: loadMessageIndex+1}))
  	}
  	handleChange = (e)=>{
  		this.setState({imgIcon: "bg-white border-2 border-purple-500 text-purple-700"})
  		let formData = this.state.formData;
  		formData.message = e.target.value===" "?"":e.target.value;
  		formData.type = 'text'
  		this.setState({formData: formData})
  	}
  	handleUpload = (e)=>{
  		this.setState({uploading: true})
  		let files = Array.from(e.target.files)
  		let formData = new FormData();
  		files.forEach((file, index)=>formData.append(index,file))
  		axios.post("/upload/many", formData)
  		.then(res=>{
  			let formData = this.state.formData;
  			formData.type = 'img'
  			formData.message = res.data[0]
  			this.setState({uploading: false, formData, imgIcon: "border-white bg-purple-500 text-white"})
  		})
  		.catch(err=>this.setState({uploading: false}))
  	}
  	handleSubmit = (e)=>{
  		e.preventDefault();
  		let {formData, messages} = this.state
  		if(formData.message){
  			this.socket.emit("message", {chatName: this.chatName(), sender: this.props.user, data: this.state.formData})
	  		formData.type = "text"
	  		formData.message = ""
	  		this.setState({messages : messages, formData, imgIcon: "bg-white border-2 border-purple-500 text-purple-700"})
  		}
  	}

  	showMore = ()=>{
  		let {loadMessageIndex} = this.state
  		this.setState({showLoadMoreButton: false})
  		axios.get(`/chat/${this.chatName()}/${loadMessageIndex}`)
  		.then(res=>{
  			if(res.data.chat){
  				let msgs = this.minify(res.data.chat)
  				let {messages} = this.state;
  				messages = msgs.concat(messages);
  				this.setState({showLoadMoreButton: res.data.chat.length===20, messages: messages, loadMessageIndex: this.state.loadMessageIndex+20, stayOnBottom: false})
  			}
  		})
  		.catch(err=>this.setState({showLoadMoreButton: true}))
  	}

	render() {
		if(!this.props.location.state) return (<Redirect to="/login" />)
		else{

			let chat = this.state.messages;
			if(this.state.messages.length){
				chat = chat.map((message, index)=><Chat key={index} message={message} user={this.props.user} />)
			}
			return (
				<div style={{height: 'calc(100vh - 5rem)'}} className="flex flex-col justify-between pb-10" >
					<div onClick={()=>console.log(this.props.location.state.talkTo.name)} className="fixed top-30 md:w-1/3 w-full flex items-center h-14 px-1 pt-2 cursor-pointer shadow-md bg-gray-100" >
				    	<div className="w-2/12 h-full"	>
				    		<img src={this.props.location.state.talkTo.img} alt={this.props.location.state.talkTo.name} className="h-full rounded-full" />
				    	</div>
				    	<div className="w-10/12 h-full flex flex-col justify-around">
				    		<p className="leading-none font-mono font-bold text-xl text-gray-700 truncate">{this.props.location.state.talkTo.name}</p>
				    		<p className="leading-none font-sans text-gray-600 text-lg truncate">@{this.props.location.state.talkTo.username}</p>
				    	</div>
				    </div>
				    <div id="messages" className="overflow-y-auto w-full flex flex-col px-1 pt-16">
				    	{this.state.showLoadMoreButton && (
				    		<center>
				    			<button onClick={this.showMore} className="px-2 text-purple-700 border-2 rounded font-bold border-purple-500 font-mono ">Show More </button>
				    		</center>
				    		)}
				    	{chat}
				    	{this.state.stayOnBottom && <AlwaysScrollToBottom />}
				    </div>
				    <form onSubmit={this.handleSubmit} className="fixed md:w-1/3 bottom-0 flex justify-around w-full h-10 pb-0.5 bg-white">
				    	{this.state.uploading?(
				    		<VscLoading className="animate-spin w-10 cursor-wait h-full text-purple-500 bg-white rounded-full" />
				    		):(
				    		<label className='w-10 cursor-pointer'>
					    		<input type='file' accept=".jpeg, .png, .jpg" onChange={this.handleUpload} className='hidden' />
					    		<BiImageAdd className={`w-full p-1 h-full ${this.state.imgIcon} rounded-full`} />
					    	</label>
				    		)}
				    	<input type='text' value={this.state.formData.type==='text'?this.state.formData.message:""} onChange={this.handleChange} className="w-9/12 border-2 rounded-full border-purple-600 py-2 px-2 text-gray-700 focus:outline-none" />
				    	<button className='w-10 focus:outline-none' ><AiOutlineSend className="h-full p-1 w-full text-white text-xl bg-purple-600 rounded-full"  /></button>
				    </form>
				</div>
			);
		}
	}
}
