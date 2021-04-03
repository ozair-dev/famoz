import React from 'react';
import axios from 'axios'
import ChatInfo from './ChatInfo'
import {FiSearch} from 'react-icons/fi'
import {IoIosPeople} from 'react-icons/io'
export default class Find extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: "",
			users: [],
			loading: false,
		}
	}

	componentDidMount(){
		this.props.changeColor('find');
		this.setState({loading: true})
		axios.get('/user/all')
		.then(res=>this.setState({users: res.data, loading: false}))
		.catch(err=>this.setState({loading: false}))

	}

	handleChange = (e)=>{
  		this.setState({search: e.target.value})
  	}
  	handleSubmit = (e)=>{
  		e.preventDefault();
  		this.setState({loading: true})
  		let query = this.state.search;
  		if(query.startsWith("@")) query = query.slice(1,);
  		if(query===""){
  			axios.get("/user/all")
  			.then(res=>this.setState({users: res.data, loading: false}))
			.catch(err=>this.setState({loading: false}))
		}
  		else{
  			axios.post("/user/find", {query})
  			.then(res=>{
  				this.setState({users: res.data, loading: false})
  			})
			.catch(err=>this.setState({loading: false}))
  		}
  	}

	render() {
		let users = this.state.users.filter(user=>user.username).map((user, index)=><ChatInfo history={this.props.history} key={index} profile={user} /> )
		return (
			<div className="flex flex-col w-full">
				<form onSubmit={this.handleSubmit} className="mt-2 mb-4 flex items-center justify-around w-11/12">
		    		<input onChange={this.handleChange} type='text' value={this.state.search} placeholder="Find people (e.g, @john)" className="w-9/12 py-1 px-4 focus:outline-none border-2 border-purple-500 rounded-full text-gray-500" />
		    		<button className="rounded text-white text-center bg-purple-500 px-6 py-2 text-xl h-full rounded-full focus:outline-none"><FiSearch /></button>
		    	</form>
		    	{this.state.loading? (
		    		<center><IoIosPeople className="h-48 w-48 animate-pulse text-purple-600" /></center>
		    		):!this.state.users[0]?(
		    		<p className="text-center text-purple-800 text-2xl font-mono">Your Search <b>{this.state.search}</b> Did Not Return Any Results!</p>
		    		): users}
			</div>
		);
	}
}
