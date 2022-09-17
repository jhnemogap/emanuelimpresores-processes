import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper, Textarea,
  VStack,
} from '@chakra-ui/react';

function NewInvoicePage() {
  return (
    <Box as='main'>
      <Heading as='h1' size='xl' mb={6}>
        Crea una nueva factura
      </Heading>

      <VStack spacing={4} alignItems='stretch'>
        <FormControl>
          <FormLabel>FACTURA DE VENTA No.</FormLabel>
          <NumberInput
            name='invoice-number'
            defaultValue={0}
            min={1}
            max={9_999}
            clampValueOnBlur={false}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>ORDEN DE COMPRA No.</FormLabel>
          <Input name='order-name' type='text' />
        </FormControl>

        <FormControl>
          <FormLabel>FORMA DE PAGO</FormLabel>
          <Input name='way-to-pay' type='text' />
        </FormControl>

        <FormControl>
          <FormLabel>Señores</FormLabel>
          <Textarea name='for-whom' />
        </FormControl>

        <FormControl>
          <FormLabel>FECHA</FormLabel>
          <Input name='date-start' type='date' />
        </FormControl>

        <FormControl>
          <FormLabel>FECHA DE VENCIMIENTO</FormLabel>
          <Input name='date-end' type='date' />
        </FormControl>

        <VStack as='section' p={2} alignItems='stretch' bgColor='blue.500'>
          <Heading as='h2' size='lg' mb={2} >
            Elementos
          </Heading>

          <VStack as='article' p={2} spacing={2} bgColor='blue.700' borderRadius='0.5rem'>
            <Heading as='h2' size='md'>
              #1
            </Heading>

            <FormControl>
              <FormLabel>Cantidad</FormLabel>
              <NumberInput
                name='amount'
                defaultValue={0}
                min={1}
                max={99_999}
                clampValueOnBlur={false}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Valor Unitario</FormLabel>
              <NumberInput
                name='unit-value'
                defaultValue={0}
                min={1}
                max={9_999_999}
                clampValueOnBlur={false}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Descripción producto / servicio</FormLabel>
              <Textarea name='description' />
            </FormControl>
          </VStack>
        </VStack>

        <FormControl>
          <FormLabel>SON:</FormLabel>
          <Textarea name='description' placeholder='Precio total en palabras'/>
        </FormControl>
      </VStack>
    </Box>
  );
}

export default NewInvoicePage;
