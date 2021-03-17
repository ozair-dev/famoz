import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import {BiLoaderAlt} from 'react-icons/bi'
export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				username: "",
				password: ""
			},
			warning: "",
			loggingin: false
		}
	}

	handleChange = (e)=>{
		this.setState({warning: ''})
		let formData = this.state.formData;
		formData[e.target.name] = e.target.value;
		this.setState({formData})
	}

	handleSubmit = (e)=>{
		e.preventDefault();
		let formData = this.state.formData;
		for(let i in formData){
			if(!formData[i]) return this.setState({warning: `${i.slice(0,1).toUpperCase()+i.slice(1,)} is required!`});
		}
		this.setState({loggingin: true})
		axios
		.post("/user", formData)
		.then(res=>this.props.updateUser(res.data))
		.catch(err=>this.setState({warning: "Invalid username or password!", loggingin: false}))
	}
	render() {
		if(this.props.user){
			return (<Redirect to='/profile' />)
		}
		else{
			return (
				<div>
					<form onSubmit={this.handleSubmit} className="flex flex-col items-center">
						<input name="username" type="text" value={this.state.username} onChange={this.handleChange} placeholder="Enter Your username" className="rounded-full border-2 border-purple-500 focus:outline-none px-4 py-1 text-purple-500 w-5/6 mt-2 placeholder-purple-500" />
						<input name="password" type="password" value={this.state.password} onChange={this.handleChange} placeholder="Enter Your password" className="rounded-full border-2 border-purple-500 focus:outline-none px-4 py-1 text-purple-500 w-5/6 mt-2 placeholder-purple-500" />
						<p className="text-red-700 w-5/6 text-center mt-2">{this.state.warning}</p>
						<button className="flex items-center rounded-full bg-purple-600 text-white py-1 px-4 mt-2 text-xl">Login{this.state.loggingin && <BiLoaderAlt className="animate-spin ml-1" />}</button>
						<p className="mt-2">Don't have an account? <Link to="/signup" className="text-purple-900 focus:outline-none">Signup</Link></p>
					</form>
				</div>
			);
		}
	}
}
