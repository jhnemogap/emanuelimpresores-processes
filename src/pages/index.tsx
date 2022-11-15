import { useRouter } from 'next/router';
import { Box, Button, Heading } from '@chakra-ui/react';

function RootPage() {
  const router = useRouter();

  const handleGoToNewInvoice = () => router.push('/invoices/new');

  return (
    <Box as='main'>
      <Heading as='h1' size='lg'>
        ROOT PAGE
      </Heading>
      <Button variant='solid' colorScheme='blue' onClick={handleGoToNewInvoice}>
        Ir a crear nueva factura
      </Button>
    </Box>
  );
}

export default RootPage;
