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
			loggingout: false
		}
	}

	handleUpload = (e)=>{
		let files = Array.from(e.target.files);
		let formData = new FormData()
		files.forEach((file, index)=>formData.append(index, file));
		axios.post("/upload", formData)
		.then(res=>console.log(res))
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
						<img src={this.props.user.img} className="h-full w-full rounded-full" />
						{!this.state.uploading? (
							<label>
							<input type="file" onChange={this.handleUpload} accept=".jpeg, .png, .jpg" className="hidden" />
							<HiOutlineCamera className="cursor-pointer w-8 h-8 p-1 rounded-full bg-white bg-opacity-70 relative bottom-12 left-32" />
						</label>
						):(
						<VscLoading className="animate-spin text-purple-500 cursor-wait w-8 h-8 p-1 rounded-full bg-white bg-opacity-70 relative bottom-12 left-32" />
						)}
					</div>
					<p className="text-center text-3xl font-mono mt-2">{this.props.user.name}</p>
					<button  onClick={this.handleLogout} className="flex items-center rounded-full bg-purple-600 text-white py-1 px-4 mt-16 text-xl disabled:cursor-not-allowed">Logout{this.state.loggingout && <BiLoaderAlt className="animate-spin ml-1" />}</button>
				</div>
			);
		}
	}
}
