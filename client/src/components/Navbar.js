import React from 'react';
import {Link} from 'react-router-dom'
import {ImUser} from 'react-icons/im'
import {IoIosChatbubbles} from 'react-icons/io'
const Navbar = (props) => {
  return (
    <div>
    	<nav className="bg-purple-600 h-12 flex items-center font-sans fixed top-0 w-screen z-50">
	    	<div className="w-2/3">
	    		<Link to="/" className="text-3xl text-white ml-4 focus:outline-none font-berkshire font-black">FamOz</Link>
	    	</div>
	    	<div className="w-1/3 flex justify-around">
	    		<Link to="/inbox"><IoIosChatbubbles className="h-8 w-8 text-white focus:outline-none" /></Link>
	    		<Link to="/login"><ImUser className="h-8 w-8 text-white focus:outline-none" /></Link>
	    	</div>
	    </nav>
    </div>
  )
}

export default Navbar;