import { Box, Select, Flex, Heading, Button, useToast, HStack, Text, Input } from "@chakra-ui/react";

import Head  from 'next/head';
import { Header, Sidebar } from "../../components";
import { api } from "../../services/api";
import { GetStaticProps } from "next";
import { useState } from "react";

interface RentsRequest {
  users: UserProps[]
  books: BookProps[]
}

interface UserProps {
  id: string;
  name: string;
}

interface BookProps {
  id: string;
  title: string;
  author: string;
  isbn: string;
}

export default function RentsCreate({ users, books }: RentsRequest) {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [initialDate, setInitialDate] = useState(0)
  const [finalDate, setFinalDate] = useState(0)

  const toast = useToast()

  async function rentBook() {
    try {
      const response = await api.post('rents/create', {
        userId: selectedUser,
        bookId: selectedBook,
        initialDate,
        finalDate,
      });

      console.log(response.data)
      toast({
        description: "Livro alugado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      }) 
  
    } catch (error) {
      toast({
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })  
    }
  }
  

  return (
    <Box>
      <Head>
        <title>LibManager | Alugar</title>
      </Head>
      <Header />

      <Flex 
        w="100%" 
        my="6" 
        maxW={1480} 
        mx="auto"
      >
        <Sidebar />
        <Box flex="1">
          <Flex justifyContent="space-between">   
          <Heading size="lg" fontWeight="normal">Alugar livros</Heading>
        </Flex>

        <Box mt="16" d="flex" >

          <HStack spacing="8" w="100%" paddingBottom="5">
          <Select 
            borderColor="gray.800"
            bg="gray.800"
            color="white"
            fontWeight="bold" 
            placeholder="Selecione um usuário"
            colorScheme="green"
            variant="filled"
            h="12"
            onChange={(e) => {setSelectedUser(e.target.value)}}
            value={selectedUser}
          >
            {users.map(user => (
              <option 
                key={user.id} 
                value={user.id}
              >
                {user.name}
              </option>
            ))}
          </Select>

          <Select 
            borderColor="gray.800"
            bg="gray.800"
            color="white"
            fontWeight="bold" 
            placeholder="Selecione um livro"
            colorScheme="green"
            variant="filled"
            h="12"
            onChange={(e) => {setSelectedBook(e.target.value)}}
            value={selectedBook}
          >
            {books.map(book => (
              <option 
                key={book.id} 
                value={book.id}
              >
                {book.title}
              </option>
            ))}
          </Select>
        </HStack>

            
      </Box>

      <HStack spacing="8" w="100%">
        <Box>
      <Text mb="2" fontSize="12">Data inicial</Text>
      <Input 
          name="yearOfPublication" 
          type="date" 
          placeholder="Ex: 02/04/2021"
          paddingY="7"
          label="Ano de publicação" 
          onChange={(e) => {setInitialDate(e.target.value)}}
          value={initialDate}
       />
       </Box>
       <Box>
      <Text mb="2" fontSize="12">Data final</Text>
      <Input 
         name="yearOfPublication" 
         type="date" 
         placeholder="Ex: 02/04/2021"
         paddingY="7"
         label="Ano de publicação" 
         onChange={(e) => {setFinalDate(e.target.value)}}
         value={finalDate}
       />
          </Box>
        </HStack>
        <Button 
          as="a" 
          size="md" 
          fontSize="small" 
          colorScheme="red" 
          mt="16"
          onClick={rentBook}
          disabled={selectedBook && selectedUser && initialDate > 0 && finalDate > 0 ? false : true}
        >
          ALUGAR
        </Button>
      {/* </Link> */}
        
      </Box>
    </Flex>
  </Box>
  )
}

export const getStaticProps: GetStaticProps<RentsRequest> = async () => {

  const usersResponse = await api.get('/users')
  const booksResponse = await api.get('/books')

  return {
    props: {
      users: usersResponse.data,
      books: booksResponse.data
    },
  };
}