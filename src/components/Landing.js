import React, { Component } from 'react'
//prettier-ignore
import {Container,Box,Heading,Card,Image,Text,SearchField,Icon,Spinner} from 'gestalt'
import {Link} from 'react-router-dom'
import Strapi from 'strapi-sdk-javascript/build/main'
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

        this.setState({searchTerm:value},()=>this.searchBrands())

    }

   /*  filterBrands=({searchTerm,brands})=>{
       return brands.filter(brand=>{
            return (
                    brand.name.toLowerCase().includes(searchTerm.toLowerCase())||
                    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })

    } */

    searchBrands= async () => {
        const response= await strapi.request('POST','/graphql',{
            data:{
                query:` query {
                    brands(where:{
                        name_contains:"${this.state.searchTerm}"
                    }){
                        _id
                        name
                        description
                        image{
                            name
                            url
                        }
                    }
                }`
            }
        })

      /*   console.log(this.state.searchTerm, response.data.brands)*/
        this.setState({brands:response.data.brands, 
        loading:false})
    }


    render() {
        const {searchTerm,loading,brands} =this.state
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
                    Beer Brands
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
                    {brands.map(brand=>(
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
                                <Link to={`/${brand._id}`}>See Brews</Link>
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