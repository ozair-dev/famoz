import React from 'react';
import {BsChatSquareDots} from 'react-icons/bs'
export default class Home extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="flex flex-col items-center">
				<BsChatSquareDots className="h-48 w-48 mt-20 animate-pulse text-purple-600" />
				<p className="text-6xl text-center text-purple-600 font-berkshire animate-pulse">FamOz</p>
			</div>
		);
	}
}
