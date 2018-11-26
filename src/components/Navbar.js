import React,{Component} from 'react'
import {Box,Text, Heading,Image,Button} from 'gestalt'
import {NavLink,withRouter} from 'react-router-dom'
import {getToken,clearToken,clearCart} from '../utils'

class Navbar extends Component{
    handleSignout=()=>{
        //clear token
        clearToken()
        //clear local storage 
        clearCart()
        //redirect to home
        //not inside Switch component on index.js, need special functions
        //get withRouter from react-router-dom and wrap this class with the withRouter higher order component (HOC)
        this.props.history.push('/')

    }



    render(){
         return getToken() !==null?<AuthNav handleSignout={this.handleSignout}/>:<UnAuthNav/>
    }
}

//destructure props
const AuthNav=({handleSignout})=> 
<Box 
   display="flex"
   alignItems="center" 
   justifyContent="around"
   height={70} 
   color="midnight" 
   padding={1}
   shape="roundedBottom">
  {/* Checkout Link */}
   <NavLink activeClassName="active" to="/checkout">
       <Text size="xl" color="white">Checkout</Text>
   </NavLink>
   {/* Title and LOGO */}
   <NavLink  activeClassName="active" exact to="/">
       <Box display="flex" alignItems="center">
           <Box height={50} width={50}>
               <Image 
                   alt="Kain Handaan logo"
                   naturalHeight={1}
                   naturalWidth={1}
                   src="./icons/logo.svg"/>
           </Box>
           <Heading size="xs" color="orange">Kain Handaan</Heading>
       </Box>
   </NavLink>
   {/* Signout button */}
  <Button 
  onClick={handleSignout}
  color="transparent"
  text="Sign out"
  inline
  size="md"
  />
</Box>

const UnAuthNav=()=> 
     <Box 
        display="flex"
        alignItems="center" 
        justifyContent="around"
        height={70} 
        color="midnight" 
        padding={1}
        shape="roundedBottom">
       {/* Signin Link */}
        <NavLink activeClassName="active" to="/signin">
            <Text size="xl" color="white">Sign In</Text>
        </NavLink>
        {/* Title and LOGO */}
        <NavLink  activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Box height={50} width={50}>
                    <Image 
                        alt="Kain Handaan logo"
                        naturalHeight={1}
                        naturalWidth={1}
                        src="./icons/logo.svg"/>
                </Box>
                <Heading size="xs" color="orange">Kain Handaan</Heading>
            </Box>
        </NavLink>
        {/* Sign Up Link */}
        <NavLink activeClassName="active" to="/signup">
            <Text size="xl" color="white">Sign Up</Text>
        </NavLink>
     </Box>



export default withRouter(Navbar)