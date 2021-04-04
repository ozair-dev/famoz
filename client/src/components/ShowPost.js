import React from 'react';
import {RiArrowRightSLine, RiArrowLeftSLine} from 'react-icons/ri'
import {IoIosRocket} from 'react-icons/io'
import {VscComment} from 'react-icons/vsc'
import openSocket from 'socket.io-client'

const Comment = (props)=>{
	let com = props.data
	let handleClick = ()=>{
	console.log('com', com)
		let user = {...com};
		delete user.comment
		console.log("user", user)
		// props.history.push({pathname: "/profile", state: {user: com}})
	}
	return (
		<div className="w-full border-b border-gray-300 flex bg-gray-50">
			<img src={com.img} onClick={handleClick} alt="" className="w-8 h-8 m-1 rounded-full" />
			<div className="flex flex-col">
				<p className="font-bold text-md w-full truncate">{com.name}</p>
				<p className="leading-tight">{com.comment}</p>
			</div>
		</div>
		)
}

export default class ShowPost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			postData: {},
			imgInd: 0,
			showComments: false,
			comment: ""
		}
		this.socket = openSocket()
		// this.socket = openSocket("http://localhost:5000", {
		// 	withCredentials: true
		// })
		this.socket.on(this.props.postData._id, doc=>{
			let postData = {...this.state.postData};
			if(postData.post){
				if(doc.type==='comment'){
					let comments = postData.post.comments.concat([doc.comment])
					postData.post.comments = comments
				}
				else{
				delete doc._id
				let post = {...postData.post}
				Object.assign(post, doc)
				postData.post = post
				}
			}
			this.setState({postData})
		})
	}

	componentDidMount(){
		this.setState({postData: this.props.postData})
	}

	changeImage= (v)=>{
		let {imgInd, postData: {post: {imgs}}} = this.state
		if(v==="+"){
			if(imgs[imgInd+1]){
				imgInd++
				this.setState({imgInd})
			}
		}
		else if(v==="-"){
			if(imgs[imgInd-1]){
				imgInd--;
				this.setState({imgInd})
			}
		}
	}

	handleCommentSubmit = (e)=>{
		e.preventDefault()
		let {comment, postData} = this.state;
		let user = {...this.props.user};
		delete user.messages;
		if(comment){
			let newComment = Object.assign({}, {comment}, user)
			this.socket.emit("update-post", { _id: postData._id, type:"comment", comment: newComment})
			this.setState({comment: ""})
		}
	}

	handleLike = ()=>{
		if(this.props.user){
			let postData = {...this.state.postData};
			let likes = postData.post.likes;
			let ind = likes.indexOf(this.props.user._id);
			if(ind===-1) {
				likes = likes.concat([this.props.user._id])			
			}
			else{
				likes = likes.slice(0,ind).concat(likes.slice(ind+1))
			}
			this.socket.emit("update-post", {_id: postData._id, likes: likes})
		}
	}		

	handleDelete = ()=>{
		if(window.confirm("Are you sure you want to delete this post?")){
			let postData = {...this.state.postData}
			let showing = !postData.post.showing
			this.socket.emit('update-post', {_id: postData._id, showing})
		}
	}

	render() {
		let data = this.state;
		let {postData} = this.state
		let comments = postData.post?.comments.map((com, index)=><Comment key={index} data={com} history={this.props.history} />)

		if(!this.state.postData.post || (this.state.postData.post && !this.state.postData.post.showing && this.props.user?.username!=="ozair" )){
			return <div></div>
		}

		return (
			<div className='w-full my-2 shadow-md'>
				<div className="w-full flex items-center h-12 py-1 px-1 bg-gray-200">
					<div onClick={()=>this.props.history.push({pathname: "/profile", state: {user: postData.by}})} className="w-1/2 h-full flex items-center cursor-pointer">
						<img src={postData.by.img} alt="" className="w-10 h-10 rounded-full mx-2" />
						<div className="w-full h-full flex flex-col items-start justify-around">
							<p className="w-full leading-none font-bold truncate">{postData.by.name}</p>
							<p className="w-full leading-none font-bold text-gray-500 truncate">@{postData.by.username}</p>
						</div>
					</div>
					<div className="w-1/2 flex items-center justify-end">
							{(this.props.user?._id===postData.by._id || this.props.user?.username==="ozair") && <button onClick={this.handleDelete} className="px-2 text-xl text-white bg-red-600 rounded mr-3 focus:outline-none">Delete{!this.state.postData.post.showing&&"d"}</button>}
					</div>
				</div>
				{Boolean(postData.post.caption) && (
					<p className="w-full p-2 break-words text-justify font-sans whitespace-pre-wrap bg-gray-100">{data.postData.post.caption}</p>
					)}
				{Boolean(postData.post.imgs.length) && (
					<div className="w-full relative">
						<p className="h-6 -mb-6 absolute right-0 w-8 bg-gray-600 text-white pb-2 pl-2 rounded-bl-full">{data.imgInd+1}/{postData.post.imgs.length}</p>
						<img src={postData.post.imgs[data.imgInd]} alt="" className="w-full" />
						<div className="w-full flex items-center justify-between relative -mt-10">
							<button onClick={()=>this.changeImage("-") } className={`w-10 h-10 bg-white rounded-full text-3xl text-gray-600 ${postData.post.imgs[data.imgInd-1]?"opacity-75":"opacity-0"} focus:outline-none`} ><RiArrowLeftSLine className="w-full h-full" /></button>
							<button onClick={()=>this.changeImage("+") } className={`w-10 h-10 bg-white rounded-full text-3xl text-gray-600 ${postData.post.imgs[data.imgInd+1]?"opacity-75":"opacity-0"} focus:outline-none`} ><RiArrowRightSLine className="w-full h-full" /></button>
						</div>
					</div>
					)}
				<div className="w-full h-10 bg-gray-50 flex items-center justify-between">
					<button onClick={this.handleLike} className={`flex items-center h-8 p-1 bg-white ${(this.props.user && this.state.postData.post.likes.includes(this.props.user._id))?"text-purple-500":"text-gray-500"} ml-4 rounded shadow-lg focus:outline-none truncate`}><IoIosRocket className="h-full w-6 mr-1" />{Boolean(this.state.postData.post.likes.length) && this.state.postData.post.likes.length}</button>
					<button onClick={()=>this.setState({showComments: !data.showComments})} className="flex items-center justify-center h-8 p-1 bg-white text-gray-500 mr-4 rounded shadow-lg focus:outline-none truncate"><VscComment className="h-full w-6 mr-1" />{Boolean(this.state.postData.post.comments.length) && this.state.postData.post.comments.length}</button>
				</div>
				{data.showComments && (
					<div className="w-full">
						{this.props.user && (
							<form onSubmit={this.handleCommentSubmit} className="w-full flex items-center">
								<input type="text" value={this.state.comment} onChange={(e)=>this.setState({comment: e.target.value}) } placeholder="Write a comment..." className="ml-1 w-10/12 px-1 border border-purple-400 rounded focus:outline-none" />
								<button className="w-2/12 bg-gray-100 text-purple-500 focus:outline-none">Post</button>
							</form>
							)}
						{comments}
					</div>					)}
			</div>
		);
	}
}
