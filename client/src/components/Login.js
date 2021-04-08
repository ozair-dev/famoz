import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import {FcGoogle} from 'react-icons/fc'
import {AiFillFacebook} from 'react-icons/ai'
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
		.then(res=>{
			this.props.updateUser(res.data)
			this.props.history.push("https://ozfam.herokuapp.com");
		})
		.catch(err=>this.setState({warning: "Invalid username or password!", loggingin: false}))
	}
	render() {
		if(this.props.user){
			return (<Redirect to='/profile' />)
		}
		else{
			return (
				<div className="pt-2">
					<a href="https://ozfam.herokuapp.com/user/auth/google" className="block mx-auto my-2 w-5/6 py-1 border border-purple-400 rounded-md shadow-md"><p className="flex items-center justify-center text-3xl leading-none"><FcGoogle className='-ml-7 mr-2' /><p className="font-mono text-2xl text-gray-600 leading-none">Google</p></p></a>
					<a href="https://ozfam.herokuapp.com/user/auth/facebook" className="block mx-auto my-2 w-5/6 py-1 border border-purple-400 rounded-md shadow-md"><p className="flex items-center justify-center text-3xl"><AiFillFacebook className='mr-2 text-blue-600' /><p className="font-mono text-2xl text-gray-600">Facebook</p></p></a>
					<p className="text-center font-mono text-purple-500 mt-4">Or Login With Email Adress!</p>
					<form onSubmit={this.handleSubmit} className="flex flex-col items-center">
						<input name="username" type="text" value={this.state.username} onChange={this.handleChange} placeholder="Enter Your username" className="border-b-2 border-purple-400 focus:outline-none focus:border-purple-600 px-2 py-1 text-purple-500 w-5/6 mt-4 placeholder-purple-400 focus:placeholder-purple-500" />
						<input name="password" type="password" value={this.state.password} onChange={this.handleChange} placeholder="Enter Your password" className="border-b-2 border-purple-400 focus:outline-none focus:border-purple-600 px-2 py-1 text-purple-500 w-5/6 mt-2 placeholder-purple-400 focus:placeholder-purple-500" />
						<p className="text-red-700 w-5/6 text-center mt-2">{this.state.warning}</p>
						<button className="flex items-center rounded-full bg-purple-600 text-white py-1 px-4 mt-2 text-xl focus:outline-none">Login{this.state.loggingin && <BiLoaderAlt className="animate-spin ml-1" />}</button>
						<p className="mt-2">Don't have an account? <Link to="/signup" className="text-purple-900 focus:outline-none">Signup</Link></p>
					</form>
				</div>
			);
		}
	}
}
