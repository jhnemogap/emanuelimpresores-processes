import { Box, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';

function NewInvoicePage() {
  return (
    <Box w='100%'>
      <Heading as='h1' size='lg'>
        NEW INVOICE PAGE
      </Heading>

      <form>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type='email' placeholder='myEmail@email.com' />
        </FormControl>
      </form>
    </Box>
  );
}

export default NewInvoicePage;
