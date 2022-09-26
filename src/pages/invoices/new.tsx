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
import { useEffect, useState } from 'react';
import { MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';

import type { SyntheticEvent } from 'react';

function NewInvoicePage() {
  const handleOnSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const inputEntries = [...formData.entries()];
    const NUMBER_ROOT_INPUTS = 7;
    const lengthProducts = (inputEntries.length - NUMBER_ROOT_INPUTS) / 4;
    const regExpProducts = /^(\d+)-(.*)/;
    const result = inputEntries.reduce((acc, cItem) => {
      const match = cItem[0].match(regExpProducts);
      const newName = match?.[2] ?? cItem[0];
      const newProperty = { [newName]: cItem[1] };
      const index = match ? parseInt(match[1]) - 1: null;
      return {
        ...acc,
        ...(!match && newProperty),
        ...(match && {
          products: acc.products.map((p, idx) => idx === index ? { ...p, ...newProperty } : { ...p }),
        }),
      };
    }, { products: Array(lengthProducts).fill({}) } as ResultSubmit);
    console.info(result);
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
  const PRODUCT_INIT: Product = { amount: 0, unitValue: 0, totalValue: 0, description: '' };

  const [products, setProducts] = useState<Product[]>([{ ...PRODUCT_INIT }]);

  const handleAddProduct = () => {
    setProducts((ps) => [...ps, { ...PRODUCT_INIT }]);
  }

  const handleDeleteProduct = (indexProduct: IndexProduct) => {
    setProducts((ps) => ps.filter((_, index) => index !== indexProduct - 1));
  }

  const handleOnChangeProduct = (params: { product: Product, indexProduct: number }) => {
    const { indexProduct, product } = params;
    setProducts((ps) => ps.map((item, index) =>
      index === indexProduct - 1 ? { ...product } : item)
    );
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
          indexProduct={index + 1}
          product={{ ...product }}
          onChange={handleOnChangeProduct}
          onDelete={handleDeleteProduct}
        />
      ))}
        <Button variant='ghost' leftIcon={<PlusSquareIcon />} onClick={handleAddProduct}>
          Agregar producto
        </Button>
    </VStack>
  );
}

function InvoiceProduct(props: InvoiceProductProps) {
  const { indexProduct = 1, product, onChange, onDelete = () => null } = props;

  const handleOnChange = ({ name, value }: { name: string; value: string | number; }) => {
    onChange({ indexProduct, product: { ...product, [name]: !!value ? value : '' }});
  }

  useEffect(() => {
    const total = product.unitValue * product.amount;
    handleOnChange({ name: 'totalValue', value: total });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.unitValue, product.amount]);

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
          icon={<MinusIcon />}
          aria-label='delete product'
          onClick={() => onDelete(indexProduct)}
        />
      </HStack>

      <FormControl>
        <FormLabel>Cantidad</FormLabel>
        <NumberInput
          isRequired
          name={`${indexProduct}-amount`}
          min={1}
          max={99_999}
          value={product.amount}
          parse={(value) => parseNumberByThousands({ value })}
          format={(value) => formatNumberByThousands({ value: value as number })}
          onChange={(_, value) => handleOnChange({ name: 'amount', value })}
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
          value={product.unitValue}
          pattern={"\\$\\s[0-9]{1,3}(.[0-9]{3})*"}
          parse={(value) => parseCurrencyValue({ value })}
          format={(value) => formatCurrencyValue({ value: value as number })}
          onChange={(_, value) => handleOnChange({ name: 'unitValue', value })}
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
        <Input
          readOnly
          name={`${indexProduct}-totalValue`}
          value={formatCurrencyValue({ value: product.totalValue })}
        />
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

function formatNumberByThousands({ value }: { value: number }) {
  const result = Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);
  return !!value ? result : '';
}

function parseNumberByThousands({ value }: { value: string }) {
  return value.replaceAll('.', '');
}

function formatCurrencyValue({ value }: { value: number }): string {
  const result = Intl.NumberFormat(
    'es-CO',
    { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }
  ).format(value);
  return !!value ? result : '';
}

function parseCurrencyValue({ value }: { value: string }) {
  return parseNumberByThousands({ value }).replaceAll(',00', '').slice(2);
}

interface InvoiceProductProps {
  indexProduct: IndexProduct;
  product: Product;
  onDelete?: (indexProduct: IndexProduct) => void;
  onChange: (params: { indexProduct: IndexProduct, product: Product }) => void;
}

interface Product {
  amount: number;
  unitValue: number;
  totalValue: number;
  description: string;
}

interface ResultSubmit  {
  invoiceNumber: string;
  orderName: string;
  wayToPay: string;
  dateStart: string;
  dateEnd: string;
  products: Product[];
  totalToWords: string;
}

type IndexProduct = number;
