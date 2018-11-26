import React from 'react';
import {BrowserRouter as Router, Switch, Route,Redirect} from 'react-router-dom'
import "gestalt/dist/gestalt.css"
import Landing from './Landing'
import Signin from './Signin';
import Signup from './Signup';
import Checkout from './Checkout';
import Navbar from './Navbar'
import Brews from './Brews'
import './App.css';
import { getToken } from '../utils';


//protects Checkout route
//if not authenticated redirect to signin route
const PrivateRoute=({component:Component,...rest})=>(
  <Route {...rest} render={props=>(
    getToken()!==null?
    <Component {...props}/>:<Redirect to={{
      pathname:'/signin',
      state:{from :props.location}
    }} />

  )} />
)

const App = () => 
  <Router>
    <React.Fragment>
      <Navbar/>
      <Switch>
          <Route exact path={"/"} component={Landing}  />
          <Route  path={"/signup"} component={Signup}  />
          <Route  path={"/signin"} component={Signin}  />
          <PrivateRoute  path={"/checkout"} component={Checkout}  />
          <Route  path={"/:brandId"} component={Brews} />
       </Switch>
      </React.Fragment>
     
  </Router>

export default App;
