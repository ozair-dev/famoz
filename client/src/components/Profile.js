import React from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import {HiOutlineCamera} from 'react-icons/hi'
import {VscLoading} from 'react-icons/vsc'
import {BiLoaderAlt} from 'react-icons/bi'
export default class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newImg: "",
			uploading: "",
			loggingout: false
		}
	}

	handleUpload = (e)=>{
		this.setState({uploading: true})
		let files = Array.from(e.target.files);
		let formData = new FormData()
		files.forEach((file, index)=>formData.append(index, file));
		axios.post("/upload", formData)
		.then(res=>this.setState({uploading: false, newImg: res.data}))
		.catch(err=>this.setState({uploading: false}))
	}

	handleCancel = ()=>{
		this.setState({newImg: ""})
	}

	changeDp = ()=>{
		axios.post("/user/change-dp", {img: this.state.newImg})
		.then(res=>{
			this.props.updateUser(res.data);
			this.setState({newImg: ""})
		})
		.catch(err=>console.log(err))
	}

	handleLogout = ()=>{
		this.setState({loggingout: true})
		axios.get('/user/logout')
		.then(res=>this.props.updateUser(null))
		.catch(err=>this.setState({loggingout: false}))
	}

	render() {
		if(!this.props.user){
			return (<Redirect to='/login' />)
		}
		else{
			return (
				<div className='flex flex-col items-center'>
					<div className="mt-6 w-48 border-2 border-purple-400 h-48 rounded-full">
						<img src={this.state.newImg || this.props.user.img} alt={this.props.user.name} className="h-full w-full rounded-full" />
						{!this.state.uploading? (
							<label>
							<input type="file" onChange={this.handleUpload} accept=".jpeg, .png, .jpg" className="hidden" />
							<HiOutlineCamera className="cursor-pointer w-8 h-8 p-1 rounded-full bg-white bg-opacity-70 relative bottom-12 left-32" />
						</label>
						):(
						<VscLoading className="animate-spin text-purple-500 cursor-wait w-8 h-8 p-1 rounded-full bg-white bg-opacity-70 relative bottom-12 left-32" />
						)}
					</div>
					{this.state.newImg && (
						<div className='flex justify-around w-full mb-4'>
							<button onClick={this.handleCancel} className="border border-purple-700 rounded-md font-sans text-purple-500 px-2 text-xl">Cancel</button>
							<button onClick={this.changeDp} className="rounded-md font-sans text-white px-2 bg-purple-600 text-xl">Save</button>
						</div>
						)}
					<p className="text-center text-3xl font-mono mt-2">{this.props.user.name}</p>
					<p className="text-center text-xl font-sans text-gray-500">@{this.props.user.username}</p>
					<button  onClick={this.handleLogout} className="flex items-center rounded-full bg-purple-600 text-white py-1 px-6 mt-16 text-xl">Logout{this.state.loggingout && <BiLoaderAlt className="animate-spin ml-1" />}</button>
				</div>
			);
		}
	}
}
