import React, { Component } from 'react'
import {Box,Heading,Card,Image,Text,Button,Mask,IconButton} from 'gestalt'
import {calculatePrice,setCart,getCart} from './utils'
import {Link} from 'react-router-dom'
import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class Brews extends Component {
    state={
        brews:[],
        brand:'',
        cartItems:[]
    }

    async componentDidMount(){
       // console.log(this.props.match.params.brandId)
       try{
            const response= await strapi.request('POST','/graphql',{
                data:{
                    query:`query{
                        brand(id:"${this.props.match.params.brandId}"){
                        _id
                        name
                        brews{
                            _id
                            name
                            description
                            image{
                            url
                            }
                            price
                        }
                        }
                    }`
                }
            })
            //console.log(response)
            this.setState({brews:response.data.brand.brews,
                    brand:response.data.brand.name,
                    cartItems:getCart()
                })
        }catch(err){
            console.log('Error, no data fetched')
            console.error(err)
        }

    }

    addToCart=brew=>{
        const alreadyInCart= this.state.cartItems.findIndex(item=>item._id===brew._id)

        if(alreadyInCart === -1){
            const updateItems=this.state.cartItems.concat({
                ...brew,
                quantity:1
            })
            this.setState({cartItems:updateItems},()=>setCart(updateItems))
        } else{
            const updateItems=[...this.state.cartItems]
            updateItems[alreadyInCart].quantity +=1
            this.setState({cartItems:updateItems},()=>setCart(updateItems))
        }

    }

    deleteItemFromCart=itemToDeleteId=>{
        const filteredItems=this.state.cartItems.filter(
            item=>item._id !==itemToDeleteId
        )
        this.setState({cartItems:filteredItems},()=>setCart(filteredItems))

    }
    render(){
        const {brand,brews,cartItems}=this.state
      //  console.log("cartItems",cartItems)
        return(
            <Box
            marginTop={4}
            display="flex"
            justifyContent="center"
            alignItems="start"
            dangerouslySetInlineStyle={{
                __style:{
                    flexWrap:'wrap-reverse'
                }
            }}
            >
            {/*Brews sections */}
            <Box display="flex" direction="column" alignItems="center">
                {/*Brews heading */}
                <Box margin={2}>
                    <Heading color="orchid">{brand}</Heading>
                </Box>
                {/*Brews */}
                <Box
                    dangerouslySetInlineStyle={{
                        __style:{
                            backgroundColor:'#bdcdd9'
                        }
                    }} 
                    wrap
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    padding={4}
                    >
                    {brews.map(brew=>(
                         <Box paddingY={4} margin={2} width={210} key={brew._id}>
                         <Card
                             image={
                                 <Box height={250} width={200}>
                                     <Image
                                         fit="cover"
                                         alt="Brew"
                                         naturalHeight={1}
                                         naturalWidth={1} 
                                         src={`${apiUrl}${brew.image.url}`}>

                                     </Image>
                                 </Box>
                             }
                         >
                         <Box
                             display="flex"
                             alignItems="center"
                             justifyContent="center"
                             direction="column"
                         >
                            <Box marginBottom={2}>
                                <Text size="xl">{brew.name}</Text>
                            </Box>
                            <Text >{brew.description}</Text>
                            <Text color="orchid" >${brew.price}</Text>
                            <Box marginBottom={2}>
                                <Text size="xl">
                                    <Button onClick={()=>this.addToCart(brew)} color="blue" text="Add to Cart"/>
                                </Text>
                            </Box>
                         </Box>

                         </Card>
                     </Box>
                    ))}
                </Box>
            </Box>
           {/*User Cart*/}
                <Box alignSelf="end" marginTop={2} marginLeft={8}>
                    <Mask shape="rounded" wash>
                        <Box display="flex" direction="column" alignItems="center" padding={2}>
                        {/* User Cart Heading */}
                             <Heading align="center" size="sm" >Your Cart</Heading>
                             <Text color="gray" italic>
                                {cartItems.length} items selected
                             </Text>
                            {/*  Cart Items  */}
                            {cartItems.map(item=>(

                                <Box key={item._id} display="flex" alignItems="center">
                                    <Text>
                                        {item.name} x {item.quantity} - {(item.quantity * item.price).toFixed(2)}
                                    </Text>
                                    <IconButton
                                        accessibilityLabel="Delete Item"
                                        icon="cancel"
                                        size="sm"
                                        iconColor="red"
                                        onClick={()=>this.deleteItemFromCart(item._id)}
                                    />
                                </Box>
                            ))}


                            <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                                <Box margin={2}>
                                    {cartItems.length===0 &&(
                                        <Text color="red">Please select some items</Text>
                                    )}
                                </Box>

                                <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                                <Text>
                                    <Link to="/checkout">Checkout</Link>
                                </Text>
                            </Box>

                        </Box>
                    </Mask>
                </Box>             

            </Box>
        )
    }
}

export default Brews