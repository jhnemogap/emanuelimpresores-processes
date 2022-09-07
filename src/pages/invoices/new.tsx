import { Box, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';

function NewInvoicePage() {
  return (
    <Box w="100%">
      <Heading as="h1" size="lg">
        NEW INVOICE PAGE
      </Heading>

      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input type="email" />
      </FormControl>
    </Box>
  );
}

export default NewInvoicePage;
