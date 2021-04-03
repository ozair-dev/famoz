import React from 'react';
import {Redirect, Link} from 'react-router-dom'
import axios from 'axios'
import {BiLoaderAlt} from 'react-icons/bi'
import {AiOutlineEdit, AiFillMessage} from 'react-icons/ai'
export default class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggingout: false
		}
	}

	handleLogout = ()=>{
		this.setState({loggingout: true})
		axios.get('/user/logout')
		.then(res=>this.props.updateUser(null))
		.catch(err=>this.setState({loggingout: false}))
	}

	render() {
		let user = this.props.location?.state?.user || this.props.user
		if(!user){
			return (<Redirect to='/login' />)
		}

		else{
			return (
				<div className='flex flex-col items-center'>
					{(this.props.user && this.props.user._id===user._id) && <Link to="/edit-profile" className="self-end text-4xl mt-2 rounded text-gray-500 shadow bg-gray-100 mr-4"><AiOutlineEdit/></Link>}
					<div className="w-48 mt-1 border-2 border-purple-400 h-48 rounded-full">
						<img src={user.img} alt="" className="h-full w-full rounded-full" />
					</div>
					<p className="text-center text-3xl font-mono mt-2">{user.name}</p>
					<p className="text-center text-xl font-sans text-gray-500">@{user.username}</p>
					{ (this.props.user && this.props.user._id===user._id)? <button  onClick={this.handleLogout} className="flex items-center rounded-full bg-purple-600 text-white py-1 px-6 text-xl mt-16 focus:outline-none">Logout{this.state.loggingout && <BiLoaderAlt className="animate-spin ml-1" />}</button>: <Link to={{pathname: `/inbox/${user._id}`, state: {talkTo: user}}} className="flex items-center text-lg h-8 mt-6 px-2 bg-purple-600 text-white rounded" ><AiFillMessage className="mr-1 h-full w-6" /> Send Message</Link>}
				</div>
			);
		}
	}
}