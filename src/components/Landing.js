import React, { Component } from 'react'
//prettier-ignore
import {Container,Box,Heading,Card,Image,Text,SearchField,Icon,Spinner} from 'gestalt'
import Strapi from 'strapi-sdk-javascript/build/main'
import {Link} from 'react-router-dom'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class Landing extends Component{
    state = {
        brands:[],
        searchTerm:'',
        loading:true
    }

    async componentDidMount(){
        try{
        const response= await strapi.request('POST','/graphql',{
            data:{
                query:`query{
                    brands{
                      _id
                          name
                      description
                      createdAt
                      image{
                        name
                        url
                      }
                    }
                  }
                `
            }
        })
      //  console.log(response)
      //disable spinner
        this.setState({brands : response.data.brands,loading:false})
    }catch(err){
        console.log(err)
        this.setState({loading:false})
    }

    }

    handleChange=({value})=>{

        this.setState({searchTerm:value})

    }

    filterBrands=({searchTerm,brands})=>{
       return brands.filter(brand=>{
            return (
                    brand.name.toLowerCase().includes(searchTerm.toLowerCase())||
                    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })

    }
    render() {
        const {searchTerm,loading} =this.state
        return(
         <Container>
            {/*Brands Search field */}
            <Box display="flex" justifyContent="center" marginTop={4}>
                <SearchField  
                    id="searchField"
                    accessibilityLabel="Brands Search Field"
                    onChange={this.handleChange}
                    value={searchTerm}
                    placeholder="Search Brands"
                />
                <Box margin={3}>
                    <Icon  icon="filter"
                            color={searchTerm?'orange':'gray'}
                            size={20}
                            accessibilityLabel="Filter"/>
                </Box>
            </Box>

            <Box display="flex"
                justifyContent="center"
                marginBottom={2}>
                <Heading>
                    Food Brands
                </Heading>

            </Box>
            <Box
                dangerouslySetInlineStyle={{
                    __style:{
                        backgroundColor:'#d6c8ec'
                    }
                }}
                shape="rounded"
                wrap
                display="flex"
                justifyContent="around"
            >
            {/* Brands */}
                <Box wrap display="flex" justifyContent="around" >
                    {this.filterBrands(this.state).map(brand=>(
                        <Box paddingY={4} margin={2} width={200} key={brand._id}>
                            <Card
                                image={
                                    <Box height={200} width={200}>
                                        <Image
                                            fit="cover"
                                            alt="Brand"
                                            naturalHeight={1}
                                            naturalWidth={1} 
                                            src={`${apiUrl}${brand.image.url}`}>

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
                            <Text size="xl">{brand.name}</Text>
                            <Text >{brand.description}</Text>
                            <Text size="xl">
                                <Link to={`/${brand._id}`}>See Food</Link>
                            </Text>
                            </Box>

                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Spinner show ={loading} accessibilityLabel="Loading..."/>
         </Container>
          
        )
    }
}

export default Landing