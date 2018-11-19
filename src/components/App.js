import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import "gestalt/dist/gestalt.css"
import Landing from './Landing'
import Signin from './Signin';
import Signup from './Signup';
import Checkout from './Checkout';
import Navbar from './Navbar'
import './App.css';

const App = () => 
  <Router>
    <React.Fragment>
      <Navbar/>
      <Switch>
          <Route exact path={"/"} component={Landing}  />
          <Route  path={"/signup"} component={Signup}  />
          <Route  path={"/signin"} component={Signin}  />
          <Route  path={"/checkout"} component={Checkout}  />
       </Switch>
      </React.Fragment>
     
  </Router>

export default App;
