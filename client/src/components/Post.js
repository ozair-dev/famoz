import React from 'react';
import axios from 'axios'
import {BiCamera, BiImageAdd} from 'react-icons/bi'
import {VscLoading} from 'react-icons/vsc'
import {MdAdd} from 'react-icons/md'
import openSocket from 'socket.io-client'
export default class Post extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				caption: "",
				imgs: []
			},
			warning: "",
			createPost: false,
			uploadButton: "Select images...",
			uploadButtonStyle: "text-purple-600 border border-purple-600 shadow-lg",
			uploading: false
		}
		this.socket = openSocket('http://localhost:5000', {
			withCredentials: true
		})
	}

	handleCancel = ()=>{
		this.setState({
			formData: {
				caption: "",
				imgs: []
			},
			warning: "",
			createPost: false,
			uploadButton: "Select images...",
			uploadButtonStyle: "text-purple-600 border border-purple-600 shadow-lg",
			uploading: false
		})
	}

	handleUpload = (e)=>{
		if(e.target.files.length){
			this.setState({uploadButton: "Adding images...", uploading: true})
			let files = Array.from(e.target.files);
			let formData = new FormData()
			files.forEach((file, i)=> formData.append(i, file))
			axios.post("/upload/many", formData)
			.then(res=>{
				let {formData} = this.state
				formData.imgs = res.data
				this.setState({uploadButtonStyle: "text-white bg-purple-600", uploadButton: `${res.data.length} image(s) added`, uploading: false, formData})
			})
			.catch(err=>this.setState({uploadButton: "Add images...", uploading: false}))
		}
	}

	handleChange = (e)=>{
		this.setState({warning: ""})
		let {formData} = this.state;
		formData[e.target.name] = e.target.value;
		this.setState({formData})
	}

	handleSubmit = (e)=>{
		e.preventDefault();
		if(this.props.user){
			this.setState({warning: ""})
			let {formData} = this.state;
			let user = {...this.props.user}
			delete user.messages;
			if(formData.caption || formData.imgs.length){
				if(formData.caption.length>1000){
					return this.setState({warning: "Caption's length can not be more than 1000 characters!"})
				}
				formData.comments = [];
				formData.likes = [user._id];
				formData.showing = true;
				let data = {
					by: user,
					post: formData
				}
				this.socket.emit('post', data)
				this.setState({
					formData: {
						caption: "",
						imgs: []
					},
					createPost: false,
					uploadButton: "Select images...",
					uploadButtonStyle: "text-purple-600 border border-purple-600 shadow-lg",
					uploading: false
				})
			}
		}else{
			this.setState({warning: "Please Login to make a post."})
			alert("Please Login to make a post.")
		}
	}

	render() {
		return (
			<div className="w-full mb-1">
				<div onClick={()=>this.setState({createPost: true})} className={`pt-2 flex items-center justify-around  ${this.state.createPost? 'hidden':''}`}>
					<BiImageAdd className="h-10 w-10 p-1 rounded-full text-white bg-purple-600" />
					<textarea placeholder="Say something..." rows={1} cols={25} className="resize-none border-2 border-purple-600 rounded-lg p-1 placeholder-gray-500 focus:outline-none" />
					<MdAdd className="h-10 w-10 p-1 rounded-full text-white bg-purple-600" />
				</div>
				<div className={`w-full pt-4 ${this.state.createPost?'':'hidden'} mb-2`} >
					<form onSubmit={this.handleSubmit} className="w-full flex flex-col items-center ">
						<textarea name="caption" onChange={this.handleChange} value={this.state.formData.caption} placeholder="Say something..." rows={3} autoFocus className="w-5/6 px-1 text-purple-800 border-2 border-purple-600 rounded-lg placeholder-gray-500 focus:outline-none" />
						<label className="w-full mt-2">
							<p className={`block mx-auto w-5/6 px-2 text-lg rounded ${this.state.uploadButtonStyle} flex items-center cursor-pointer`}>{this.state.uploading?(<VscLoading className="animate-spin mr-2" />):(<BiCamera className="h-full mr-2"/>)}{this.state.uploadButton}</p>
							<input onChange={this.handleUpload} type='file' accept=".jpeg, .png, .jpg" multiple className="hidden"/>
						</label>
						<p className="text-red-700 mt-2 w-5/6 text-center">{this.state.warning}</p>

						<div className="w-full mt-1 flex items-center justify-around">
							<p onClick={this.handleCancel} className="select-none cursor-pointer text-purple-600 text-xl py-1 px-2 border border-purple-600 rounded shadow">Cancel</p>
							<button disabled={this.state.uploading} className="w-24 rounded bg-purple-600 text-xl text-white py-1 px-2 focus:outline-none">POST</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
