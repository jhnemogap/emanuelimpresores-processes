import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';

import { useEffect, useState } from 'react';
import { JSXElement } from '@babel/types';

function NewInvoicePage() {
  return (
    <Box as='main'>
      <Heading as='h1' size='xl' mb={6}>
        Crea una nueva factura
      </Heading>

      <VStack as='form' spacing={4} alignItems='stretch'>
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

        <InvoiceProducts />

        <FormControl>
          <FormLabel>SON:</FormLabel>
          <Textarea name='description' placeholder='Precio total en palabras'/>
        </FormControl>
      </VStack>
    </Box>
  );
}

export default NewInvoicePage;

function InvoiceProducts() {
  const [products, setProducts] = useState<unknown[]>([]);

  const handleDeleteProduct = (index: number) => {
    // setProducts((ps) => ps.filter((_, cIndex) => cIndex !== index - 1));
  }

  const handleAddProduct = () => {
    setProducts((ps) => [...ps, null]);
  }

  return (
    <VStack as='section' p={2} alignItems='stretch' spacing={4} bgColor='blue.500'>
      {products.map((_, index) => (
        <InvoiceProduct
          key={`p-${index + 1}`}
          index={index + 1}
          onDelete={() => handleDeleteProduct(index + 1)}
        />
      ))}
      <Button variant='ghost' leftIcon={<PlusSquareIcon />} onClick={handleAddProduct}>
        Agregar producto
      </Button>
    </VStack>
  );
}

function InvoiceProduct({ index = 1, onDelete = () => null }: InvoiceProductProps) {
  return (
    <VStack
      as='article'
      p={2}
      spacing={2}
      alignItems='stretch'
      bgColor='blue.700'
      borderRadius='0.5rem'
    >
      <HStack as='header' justifyContent='space-between'>
        <Heading as='h2' size='md'>
          Elemento # {index}
        </Heading>
        <IconButton
          size='xs'
          variant='solid'
          colorScheme='red'
          onClick={onDelete}
          icon={<MinusIcon />}
          aria-label='delete product'
        />
      </HStack>

      <FormControl>
        <FormLabel>Cantidad</FormLabel>
        <NumberInput
          name={`amount-e${index}`}
          min={1}
          max={99_999}
          defaultValue={0}
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
          name={`unit-value-e${index}`}
          min={1}
          max={9_999_999}
          defaultValue={0}
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
        <Textarea name={`description-e${index}`} defaultValue={''} />
      </FormControl>
    </VStack>
  );
}

interface InvoiceProductProps {
  index: number;
  onDelete?: () => void;
}
