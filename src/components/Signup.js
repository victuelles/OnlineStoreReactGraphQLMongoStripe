import React, { Component } from 'react'
//prettier-ignore
import {Container,Box,Heading,TextField,Button,Text} from 'gestalt'
import {setToken} from '../utils'
import ToastMessage from './ToastMessage'

//Load API libraries
import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)



class Signup extends Component{
    state={
        username:'',
        email:'',
        password:'',
        toast:false,
        toastMessage:'',
        loading:false
    }

    handleChange=({event,value})=>{
        event.persist()
        this.setState({[event.target.name]:value})

    }
    handleSubmit=async event=>{
        event.preventDefault()
        //destructure
        const {username,email,password} =this.state

        if(this.isFormEmpty(this.state)){
            this.showToast('Fill in all fields')
            return
        }
       // console.log('submitted')
       //Sign up user

       try{ 
           //set loading -true
           this.setState({loading:true})
           //make request to register user with strapi
           const response= await strapi.register(username,email,password)
           //set loading false
           this.setState({loading:false})
           //put token (to manage user seeion) in local storage
           //jwt json web token
           setToken(response.jwt)
          // console.log(response)
           //redirect user to home page
           this.redirectUser('/')
           

       }catch(err){

        //set loading to false
        this.setState({loading:false})
        //show error message using toast message
        this.showToast(err.message)

       }
    }

    redirectUser=path=>this.props.history.push(path)

    isFormEmpty=({username,email,password})=>{
        return !username || !email || !password
    }
    showToast=toastMessage=>{
        this.setState({toast:true,toastMessage:toastMessage})
        setTimeout(()=>this.setState({toast:false,toastMessage:''}),5000)

    }

    render() {
        const {toastMessage,toast,loading}=this.state
        console.log(this.state)
        return(
            <Container>
                <Box 
                    dangerouslySetInlineStyle={{
                        __style:{
                            backgroundColor:'#ebe2da'
                        }
                    }}
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    >
                    {/* Signup Form */}
                    <form style={{
                        display:'inlineBlock',
                        textAlign:'center',
                        maxWidth:450
                    }}
                    onSubmit={this.handleSubmit}
                    >
                    {/* Sign Up Form Heading */}
                    <Box
                        marginBottom={2}
                        display="flex"
                        direction="column"
                        alignItems="center"
                    >
                        <Heading color="midnight">Let's get started!</Heading>
                        <Text italic color="orchid">Sign up to order some brews!</Text>
                        
                    </Box>
                        {/* Username Input */}
                        <TextField 
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={this.handleChange}
                        />
                        {/* Email Input */}
                        <TextField 
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email address"
                            onChange={this.handleChange}
                        />
                        {/* Password Input */}
                        <TextField 
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={this.handleChange}
                        />

                        {/* Username Input */}
                        <Button inline disabled={loading}
                        color="blue"
                        text="Submit"
                        type="submit"
                        />
                    </form>
                </Box>
                <ToastMessage    show={toast} message={toastMessage}/>
            </Container>
          
        )
    }
}

export default Signup