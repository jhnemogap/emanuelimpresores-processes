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
import { useState } from 'react';
import { MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';

import type { Dispatch, SetStateAction, SyntheticEvent } from 'react';

function NewInvoicePage() {
  const handleOnSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const inputEntries = [...formData.entries()];
    const regExpProducts = /(\d+-).*/;
    console.info(inputEntries.reduce((acc, cItem) => {
      const toReplace = cItem[0].match(regExpProducts)?.[1];
      return {
        ...acc,
        [toReplace ? cItem[0].replace(toReplace, '') : cItem[0]]: cItem[1],
      };
    }, {}));
  };

  return (
    <Box as='main'>
      <Heading as='h1' size='xl' mb={6}>
        Crea una nueva factura
      </Heading>

      <VStack as='form' spacing={4} alignItems='stretch' onSubmit={handleOnSubmit}>
        <FormControl>
          <FormLabel>FACTURA DE VENTA No.</FormLabel>
          <NumberInput
            isRequired
            name='invoiceNumber'
            min={1}
            max={9_999}
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
          <Input name='orderName' type='text' />
        </FormControl>

        <FormControl>
          <FormLabel>FORMA DE PAGO</FormLabel>
          <Input name='wayToPay' type='text' />
        </FormControl>

        <FormControl>
          <FormLabel>Señores</FormLabel>
          <Textarea isRequired name='forWhom' />
        </FormControl>

        <FormControl>
          <FormLabel>FECHA</FormLabel>
          <Input name='dateStart' type='date' />
        </FormControl>

        <FormControl>
          <FormLabel>FECHA DE VENCIMIENTO</FormLabel>
          <Input name='dateEnd' type='date' />
        </FormControl>

        <InvoiceProducts />

        <FormControl>
          <FormLabel>SON:</FormLabel>
          <Textarea isRequired name='totalToWords' placeholder='Precio total en palabras'/>
        </FormControl>

        <Button variant='ghost' type='submit'>
          Generar Factura
        </Button>
      </VStack>
    </Box>
  );
}

export default NewInvoicePage;

function InvoiceProducts() {
  const PRODUCT_INIT: Product = { amount: 0, unitValue: 0, description: '' };

  const [products, setProducts] = useState<Product[]>([{ ...PRODUCT_INIT }]);

  const handleDeleteProduct = (index: number) => {
    setProducts((ps) => ps.filter((_, idx) => idx !== index - 1));
  }

  const handleAddProduct = () => {
    setProducts((ps) => [...ps, { ...PRODUCT_INIT }]);
  }

  return (
    <VStack
      as='section'
      p={2}
      spacing={4}
      alignItems='stretch'
      bgColor='blue.500'
    >
      {products.map((product, index) => (
        <InvoiceProduct
          key={`p-${index + 1}`}
          product={product}
          setP={setProducts}
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

function InvoiceProduct(props: InvoiceProductProps) {
  const { indexProduct = 1, onDelete = () => null, product, setP } = props;

  const [totalValue , setTotalValue] = useState<number>(0);

  const handleOnChange = ({ name, value }: { name: string; value: string; }) => {
    let newValue: string | number = value;
    if (['amount', 'unitValue'].includes(name) && !!value) {
      newValue = parseInt(value);
      setTotalValue(name === 'amount' ? newValue * product.unitValue : newValue * product.amount);
    }
    setP((ps) => ps.map(
      (item, index) => index === indexProduct - 1 ? ({ ...item, [name]: newValue }) : item
    ));
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
          isRequired
          name={`${indexProduct}-amount`}
          min={1}
          max={99_999}
          value={product.amount || ''}
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
          isRequired
          name={`${indexProduct}-unitValue`}
          min={1}
          max={9_999_999}
          value={product.unitValue || ''}
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
        <FormLabel>Valor Total</FormLabel>
        <NumberInput
          isDisabled
          isRequired
          name={`${indexProduct}-totalValue`}
          min={1}
          max={9_999_999}
          value={totalValue || ''}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Descripción producto / servicio</FormLabel>
        <Textarea
          isRequired
          name={`${indexProduct}-description`}
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
  setP: Dispatch<SetStateAction<Product[]>>;
}

interface Product {
  amount: number;
  unitValue: number;
  description: string;
}
