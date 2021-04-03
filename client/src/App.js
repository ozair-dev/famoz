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
import EditProfile from "./components/EditProfile"
axios.defaults.withCredentials = true;
export default withRouter (
  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: null
      }
    }

    updateUser = (user)=>{
      if(user?.password) delete user.password;
      this.setState({user})
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
          <div style={{minHeight: "calc(100vh - 3rem)"}} className="mt-12 w-screen md:w-1/3 mx-auto">
            {(this.state.user && !this.state.user.username)? (<EditProfile user={this.state.user} updateUser={this.updateUser} history={this.props.history} />):
              (
              <Switch>
                <Route path="/" exact render={()=><Home user={this.state.user} history={this.props.history} /> }/>
                <Route path="/inbox" render={()=><Inbox user={this.state.user} updateUser={this.updateUser} history={this.props.history} location={this.props.location} /> } />
                <Route path="/login" render={()=><Login history={this.props.history} user={this.state.user} updateUser={this.updateUser} /> } />
                <Route path="/signup" render={()=><Signup history={this.props.history} user={this.state.user} /> } />
                <Route path="/profile" render={()=><Profile history={this.props.history} location={this.props.location} user={this.state.user} updateUser={this.updateUser} /> } />  
                <Route path="/edit-profile" render={()=><EditProfile user={this.state.user} updateUser={this.updateUser} history={this.props.history} /> } />
              </Switch>
              )}
          </div>
        </div>
      );
    }
  }
)
