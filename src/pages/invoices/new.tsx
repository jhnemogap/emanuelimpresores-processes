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
import { ForwardedRef, forwardRef, useRef, useState } from 'react';
import { MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';

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
  const PRODUCT_INIT = { amount: 0, unitValue: 0, description: '' };

  const products = useRef([{ ...PRODUCT_INIT }]);
  const [, setCN] = useState(0);

  const handleDeleteProduct = (index: number) => {
    products.current = products.current.filter((_, idx) => idx !== index - 1);
    setCN((ps) => ps + 1);
  }

  const handleAddProduct = () => {
    products.current = [...products.current, { ...PRODUCT_INIT }];
    setCN((ps) => ps + 1);
  }

  return (
    <VStack
      as='section'
      p={2}
      spacing={4}
      alignItems='stretch'
      bgColor='blue.500'
    >
      {products.current.map((product, index) => (
        <InvoiceProduct
          key={`p-${index + 1}`}
          product={product}
          indexProduct={index + 1}
          onDelete={() => handleDeleteProduct(index + 1)}
        />
      ))}
      <Button variant='ghost' leftIcon={<PlusSquareIcon />} onClick={handleAddProduct}>
        Agregar producto
      </Button>
    </VStack>
  );
}

function InvoiceProduct({ indexProduct = 1, onDelete = () => null, product }: InvoiceProductProps) {
  const [, setCN] = useState(0);

  const handleOnChange = ({ name, value }: { name: string; value: string; }) => {
    if (['amount', 'unitValue'].includes(name) && !!value) {
      product[name] = parseInt(value); // ToDo: TS error
    }
    else {
      product[name] = value; // ToDo: TS error
    }
    setCN((ps) => ps + 1);
  }

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
          Elemento # {indexProduct}
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
          name={`amount-${indexProduct}`}
          min={1}
          max={99_999}
          value={product.amount}
          onChange={(value) => handleOnChange({ name: 'amount', value })}
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
          name={`unitValue-${indexProduct}`}
          min={1}
          max={9_999_999}
          clampValueOnBlur={false}
          value={product.unitValue}
          onChange={(value) => handleOnChange({ name: 'unitValue', value })}
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
        <Textarea
          name={`description-${indexProduct}`}
          value={product.description}
          onChange={(e) => handleOnChange({ name: 'description', value: e.currentTarget.value })}
        />
      </FormControl>
    </VStack>
  );
}

interface InvoiceProductProps {
  indexProduct: number;
  onDelete?: () => void;
  product: Product;
}

interface Product {
  amount: number;
  unitValue: number;
  description: string;
}
