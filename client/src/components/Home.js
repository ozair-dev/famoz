import React from 'react';
import axios from 'axios'
import Post from './Post'
import {BsChatSquareDots} from 'react-icons/bs'
import ShowPost from './ShowPost'
import openSocket from 'socket.io-client'
export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			postIndex: 0,
			showLoadMore: false
		}
		this.socket = openSocket()
		// this.socket = openSocket("http://localhost:5000", {
		// 	withCredentials: true
		// })
		this.socket.on('new-post', post=>{
			let posts = [...this.state.posts]
			if(posts.length){
				posts = posts.concat([post])
				this.setState(({postIndex})=>({posts: posts, postIndex: postIndex+1}))
			}
		})
	}

	componentDidMount(){
		axios.get("/posts/0")
		.then(res=>{
			this.setState({posts: res.data, postIndex: 10, showLoadMore: res.data.length===10})
		})
		.catch(err=>console.log(err))
	}

	handleLoadMore = ()=>{
		let {postIndex, posts} = this.state;
		this.setState({showLoadMore: false})
		axios.get(`/posts/${postIndex}`)
		.then(res=>{
			this.setState({posts: [...res.data, ...posts], postIndex: postIndex+10, showLoadMore: res.data.length===10})
			console.log(this.state.posts)
		})
		.catch(err=>this.setState({showLoadMore: true}))
	}

	render() {
		let posts = this.state.posts.map((post, index)=><ShowPost key={post._id} postData={post} history={this.props.history} user={this.props.user} />)
		return (
			<div className="w-full">
				<Post user={this.props.user} />
				{posts.length? posts.reverse(): (
					<div className="w-full flex flex-col items-center">
						<BsChatSquareDots className="h-48 w-48 mt-20 animate-pulse text-purple-600" />
						<p className="text-6xl text-center text-purple-600 font-berkshire animate-pulse">FamOz</p>
					</div>
					)}
			{this.state.showLoadMore && <button onClick={this.handleLoadMore} className="text-md my-1 bg-white text-purple-500 font-bold border-2 border-purple-500 rounded block mx-auto px-2 focus:outline-none">Show more</button>}
			</div>
		);
	}
}
