import React, { Component } from 'react'
import {Box,Heading,Card,Image,Text,Button,Mask} from 'gestalt'
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
                    brand:response.data.brand.name})
        }catch(err){
            console.log('Error, no data fetched')
            console.error(err)
        }

    }

    render(){
        const {brand,brews,cartItems}=this.state
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
                         <Text color="orchid" >{brew.price}</Text>
                         <Box marginBottom={2}></Box>
                            <Text size="xl">
                                <Button color="blue" text="Add to Cart"/>
                            </Text>
                         <Box marginBottom={2}></Box>
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
                             <Heading align="center" size="md" >Your Cart</Heading>
                             <Text color="gray" italic>
                                {cartItems.length} items selected
                             </Text>
                            {/*  Cart Items (will add) */}

                            <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                                <Box margin={2}>
                                    {cartItems.length===0 &&(
                                        <Text color="red">Please select some items</Text>
                                    )}
                                </Box>

                                <Text size="lg">Total: $3.99</Text>
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