import React from 'react';
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import {HiOutlineCamera} from 'react-icons/hi'
import {VscLoading} from 'react-icons/vsc'
import {BiLoaderAlt} from 'react-icons/bi'
export default class EditProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {},
			uploading: false,
			warning: "",
			saving: false
		}
	}

	handleUpload = (e)=>{
		this.setState({uploading: true})
		let files = Array.from(e.target.files);
		let formData = new FormData();
		files.forEach((file, index)=>formData.append(index, file));
		axios.post("/upload", formData)
		.then(res=>{
			let {formData} = this.state;
			formData.img = res.data
			this.setState({uploading: false, formData})
		})
		.catch(err=>this.setState({uploading: false}))
	}

	handleChange = (e)=>{
		this.setState({warning: ""})
		let {formData} = this.state;
		if(e.target.value!==" "){
			formData[e.target.name] = e.target.value;
			this.setState({formData})
		}
	}

	handleSubmit = (e)=>{
		e.preventDefault();
		this.setState({warning: "", saving: true})
		let {formData} = this.state;
		if(formData.password==="") delete formData.password
		for (let i in formData){
			if(!formData[i]){
				return this.setState({warning: `${i.slice(0,1).toUpperCase()+i.slice(1,)} field is required!`, saving: false})
			}
			if(formData[i].length<4){
				return this.setState({warning: `${i.slice(0,1).toUpperCase()+i.slice(1,)} must be atleast 4 characters long!`, saving: false})
			}
		}
		axios.post("/user/update", formData)
		.then(res=>{
			this.props.updateUser(res.data)
			this.setState({saving: false})
			this.props.history.goBack();
		})
		.catch(err=>this.setState({warning: "Username is already taken!", saving: false}))
		
	}
	handleLogout = ()=>{
		axios.get("/user/logout")
		.then(res=>this.props.updateUser(null))
		.catch(err=>console.log(err))
	}
	componentDidMount(){
		let formData = {...this.props.user};
		if(formData.messages) delete formData.messages;
		if(!formData.username) formData.username = "";
		this.setState({formData})
	}

	render() {
		if(!this.props.user){
			return <Redirect to="/" />
		}
		return (
			<div className="w-full">
				<p className="text-4xl text-center text-purple-600 font-kiwi">Edit your profile</p>
				<form onSubmit={this.handleSubmit} className="flex flex-col items-center">
					<div className="mt-6 w-48 border-2 border-purple-400 h-48 rounded-full">
						<img src={this.state.formData.img} alt='' className="h-full w-full rounded-full" />
						{!this.state.uploading? (
							<label>
								<input type="file" onChange={this.handleUpload} accept=".jpeg, .png, .jpg" className="hidden" />
								<HiOutlineCamera className="cursor-pointer w-8 h-8 p-1 rounded-full bg-white bg-opacity-70 relative bottom-12 left-32" />
							</label>
						):(
						<VscLoading className="animate-spin text-purple-500 cursor-wait w-8 h-8 p-1 rounded-full bg-white bg-opacity-70 relative bottom-12 left-32" />
						)}
					</div>
					<input name="name" onChange={this.handleChange} value={this.state.formData.name} placeholder="Enter your name" className="border-b-2 border-purple-400 focus:border-purple-600 focus:outline-none px-2 py-1 text-purple-600 w-5/6 mt-4 placeholder-purple-400 focus:placeholder-purple-500" />
					<input name="username" onChange={this.handleChange} value={this.state.formData.username} placeholder="Choose a username" className="border-b-2 border-purple-400 focus:border-purple-600 focus:outline-none px-2 py-1 text-purple-600 w-5/6 mt-4 placeholder-purple-400 focus:placeholder-purple-500" />
					{!this.state.formData.id && <input name="password" type="password" title="Leave this field empty if you don't want to change your password" onChange={this.handleChange} placeholder="Change password" className="border-b-2 border-purple-400 focus:border-purple-600 focus:outline-none px-2 py-1 text-purple-600 w-5/6 mt-4 placeholder-purple-400 focus:placeholder-purple-500" />}
					{!this.state.formData.id && <p className="text-blue-600 mt-1 w-5/6 text-center">Tip: You can leave the password field empty if you don't want to change the password.</p>}
					<p className="text-red-700 mt-1 w-5/6 text-center">{this.state.warning}</p>
					<button disabled={this.state.uploading} className="flex items-center rounded-full bg-purple-600 text-white py-1 px-4 mt-2 text-xl disabled:cursor-wait focus:outline-none">Save{this.state.saving && <BiLoaderAlt className="animate-spin ml-2" />}</button>
				</form>		
				{!this.props.user.username && <button onClick={this.handleLogout} className="flex items-center rounded-full block mx-auto bg-purple-600 text-white py-1 px-4 mt-2 text-xl">Logout</button>}
			</div>
		);
	}
}
