import './App.css';
import React from 'react';
import {withRouter, Switch, Route} from "react-router-dom"
import axios from 'axios'
import Home from "./components/Home"
import Navbar from './components/Navbar'
import Inbox from './components/Inbox'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from "./components/Profile"
export default withRouter (
  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: null
      }
    }

    updateUser = (user)=>{
      this.setState({user: user})
    }

    componentDidMount(){
      axios.get('/user')
      .then(res=>this.updateUser(res.data))
      .catch(err=>console.log(err))
    }

    render() {
      return (
        <div>
          <Navbar />
          <div className="mt-12 w-screen md:w-1/3 mx-auto ">
            <Switch>
              <Route path="/" exact render={()=><Home /> }/>
              <Route path="/inbox" render={()=><Inbox user={this.state.user} history={this.props.history} location={this.props.location} /> } />
              <Route path="/login" render={()=><Login history={this.props.history} user={this.state.user} updateUser={this.updateUser} /> } />
              <Route path="/signup" render={()=><Signup history={this.props.history} user={this.state.user} /> } />
              <Route path="/profile" render={()=><Profile history={this.props.history} user={this.state.user} updateUser={this.updateUser} /> } />  
            </Switch>
          </div>
        </div>
      );
    }
  }
)
