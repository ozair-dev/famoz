import React from 'react';
import {Link} from 'react-router-dom'
import ChatInfo from "./ChatInfo"
export default class Messages extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount(){
		this.props.changeColor('messages')
	}

	render() {
		let messages = this.props.user.messages?.reverse().map((user, ind)=><ChatInfo profile={user} history={this.props.history} key={ind} /> )
		if(messages) {
			return (
				<div className="mt-2">
					{messages}
				</div>
				)
		}
		else{
			return (
				<div className='flex flex-col items-center'>
					<p className="mt-8 text-3xl text-purple-500 font-sans text-center">No Messages</p>
					<Link to="/inbox/find" className="mt-2 py-1 px-4 font-mono text-xl text-purple-500 text-center border border-purple-300 shadow-lg rounded-md">Find People</Link>
				</div>
			);
		}
	}
}
