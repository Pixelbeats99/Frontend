import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Login from './components/login'
import Register from './components/register'
import googleAuth from './components/google-auth'
import accountInfo from './components/accountInfo'


const routing = (
  <Router>
    <div>
      <Route exact path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/google-auth" component= {googleAuth} />
      <Route path = "/accountInfo" component= {accountInfo} />
    </div>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'))

