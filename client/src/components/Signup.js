import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import {HiOutlineCamera} from 'react-icons/hi'
import {VscLoading} from 'react-icons/vsc'
import {BiLoaderAlt} from 'react-icons/bi'
import img from "./saadi.png"
export default class Signup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			formData: {
				name: "",
				username: "",
				password: "",
				img: "https://st.depositphotos.com/1779253/5140/v/600/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg"
			},
			uploading: false,
			signingup: false
		}
	}

	handleUpload = (e)=>{
		this.setState({uploading: true, "warning": ""})
		let files = Array.from(e.target.files)
		let formData = new FormData();
		files.forEach((file, i)=>formData.append(i, file))
		axios.post('/upload', formData)
		.then(res=>this.setState(({formData})=>{
			formData.img = res.data;
			return ({formData, uploading: false})
		}))
		.catch(err=>this.setState({warning: "Image not uploaded!", "uploading": false}))
	}

	handleChange = (e)=>{
		this.setState({warning: ""})
		let formData = this.state.formData;
		formData[e.target.name]=e.target.value;
		this.setState({formData})
	}
	handleSubmit = (e)=>{
		e.preventDefault();
		let formData = this.state.formData;
		for(let i in formData){
			if(!formData[i]) return this.setState({warning: `${i.slice(0,1).toUpperCase()+i.slice(1,)} field is required!`});
			if((i==='username'||i==='password') && formData[i].length<4) return this.setState({warning: `${i.slice(0,1).toUpperCase()+i.slice(1,)} must be atleast 4 characters long!`});
		}
		this.setState({signingup: true})
		axios.post('/user/signup', formData)
		.then(res=>this.props.history.push("/login"))
		.catch(err=>this.setState({signingup: false, warning: "Username already taken!"}))
	}
	render() {
		if(this.props.user){
			return (<Redirect to="/profile" />)
		}
		else{
			return (
				<form onSubmit={this.handleSubmit} className="flex flex-col items-center">
					<div className="mt-2 w-48 border-2 border-purple-400 h-48 rounded-full">
						<img src={this.state.formData.img} className="h-full w-full rounded-full" />
						{!this.state.uploading? (
							<label>
							<input type="file" onChange={this.handleUpload} accept=".jpeg, .png, .jpg" className="hidden" />
							<HiOutlineCamera className="cursor-pointer w-8 h-8 p-1 rounded-full bg-white bg-opacity-70 relative bottom-12 left-32" />
						</label>
						):(
						<VscLoading className="animate-spin text-purple-500 cursor-wait w-8 h-8 p-1 rounded-full bg-white bg-opacity-70 relative bottom-12 left-32" />
						)}
					</div>
					<input name="name" type="text" value={this.state.name} onChange={this.handleChange} placeholder="Enter Your name" className="rounded-full border-2 border-purple-700 focus:outline-none px-4 py-1 text-purple-500 w-5/6 mt-4 placeholder-purple-500" />
					<input name="username" type="text" value={this.state.username} onChange={this.handleChange} placeholder="Choose a username" className="rounded-full border-2 border-purple-700 focus:outline-none px-4 py-1 text-purple-500 w-5/6 mt-2 placeholder-purple-500" />
					<input name="password" type="password" value={this.state.password} onChange={this.handleChange} placeholder="Choose a password" className="rounded-full border-2 border-purple-700 focus:outline-none px-4 py-1 text-purple-500 w-5/6 mt-2 placeholder-purple-500" />
					<p className="text-red-700 mt-1 w-5/6 text-center">{this.state.warning}</p>
					<button disabled={this.state.uploading||this.state.signingup} className="flex items-center rounded-full bg-purple-600 text-white py-1 px-4 mt-2 text-xl disabled:cursor-not-allowed">Signup{this.state.signingup && <BiLoaderAlt className='animate-spin ml-1' />}</button>

					<p className="mt-2">Already have an account? <Link to="/login" className="text-purple-900 focus:outline-none">Login</Link></p>

				</form>
			);
		}
	}
}
