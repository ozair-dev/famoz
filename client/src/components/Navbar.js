import React from 'react';
import {Link} from 'react-router-dom'
import {ImUser} from 'react-icons/im'
const Navbar = (props) => {
  return (
    <div>
    	<nav className="bg-purple-500 h-10 flex items-center font-sans fixed top-0 w-screen">
	    	<div>
	    		<Link to="/" className="text-2xl text-white ml-4 focus:outline-none">famoz</Link>
	    	</div>
	    	<div>
	    		<Link to="login"><ImUser className="h-8 w-8 text-white focus:outline-none" /></Link>
	    	</div>
	    </nav>
    </div>
  )
}

export default Navbar;