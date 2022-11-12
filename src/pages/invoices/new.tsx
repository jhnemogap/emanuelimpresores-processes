import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
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
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';

import { generatePDF } from '../../pdf/makePdf';

import type { BaseSyntheticEvent } from 'react';

const PREVIEW_PDF_ID = 'preview-pdf';

function NewInvoicePage() {
  const [src, setSrc] = useState<unknown>('');

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleOnSubmit = (event: BaseSyntheticEvent<SubmitEvent>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const inputEntries = [...formData.entries()];
    const NUMBER_ROOT_INPUTS = 8;
    const lengthProducts = (inputEntries.length - NUMBER_ROOT_INPUTS) / 4;
    const regExpProducts = /^(\d+)-(.*)/;
    const result = inputEntries.reduce(
      (acc, cItem) => {
        const match = cItem[0].match(regExpProducts);
        const newName = match?.[2] ?? cItem[0];
        const newProperty = { [newName]: cItem[1] };
        const index = match ? parseInt(match[1]) - 1 : null;
        return {
          ...acc,
          ...(!match && newProperty),
          ...(match && {
            products: acc.products.map((p, idx) =>
              idx === index ? { ...p, ...newProperty } : { ...p },
            ),
          }),
        };
      },
      { products: Array(lengthProducts).fill({}) } as ResultSubmit,
    );
    console.info(result);
    const isPreview = event.nativeEvent.submitter?.id === `btn-${PREVIEW_PDF_ID}`;
    const genPdf = generatePDF({ isPreview, data: result  });
    if (isPreview) {
      setSrc(genPdf);
      onOpen();
    }
  };

  return (
    <VStack as='main' alignItems='center'>
      <Box as='section' width='100%' maxWidth='45rem'>
        <Heading as='h1' size='xl' mb={6}>
          Crea una nueva factura
        </Heading>

        <VStack as='form' spacing={4} alignItems='stretch' onSubmit={handleOnSubmit}>
          <FormControl>
            <FormLabel>FACTURA DE VENTA No.</FormLabel>
            <NumberInput isRequired name='invoiceNumber' min={1} max={9_999}>
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
            <Textarea isRequired name='forWhom' rows={3} cols={29} maxLength={29*3} />
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
            <Textarea isRequired name='totalToWords' placeholder='Precio total en palabras' />
          </FormControl>

          <HStack justifyContent='space-evenly' spacing={2}>
            <Button
              id={`btn-${PREVIEW_PDF_ID}`}
              type='submit'
              variant='outline'
              colorScheme='twitter'
            >
              Vista Previa
            </Button>
            <Button id='btn-save-pdf' type='submit' variant='solid' colorScheme='linkedin'>
              Generar Factura
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Drawer isOpen={isOpen} onClose={onClose} placement='right' size='xl'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            Vista previa de la FACTURA
          </DrawerHeader>
          <DrawerBody>
            <Box
              as='iframe'
              id={PREVIEW_PDF_ID}
              src={src as string}
              width='100%'
              height='100%'
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </VStack>
  );
}

export default NewInvoicePage;

function InvoiceProducts() {
  const PRODUCT_INIT: Product = { amount: 0, unitValue: 0, totalValue: 0, description: '' };

  const [totalV, setTotalV] = useState('');
  const [products, setProducts] = useState<Product[]>([{ ...PRODUCT_INIT }]);

  const toast = useToast();

  const handleAddProduct = () => {
    setProducts((ps) => [...ps, { ...PRODUCT_INIT }]);
  };

  const handleDeleteProduct = (indexProduct: IndexProduct) => {
    if (products.length > 1) {
      setProducts((ps) => ps.filter((_, index) => index !== indexProduct - 1));
    } else {
      toast({
        status: 'warning',
        isClosable: true,
        title: 'No se puede eliminar este elemento',
        description: 'Debe haber al menos un producto o servicio en la factura',
        containerStyle: { marginBottom: '2rem' },
      });
    }
  };

  const handleOnChangeProduct = (params: { product: Product; indexProduct: number }) => {
    const { indexProduct, product } = params;
    setProducts((ps) =>
      ps.map((item, index) => (index === indexProduct - 1 ? { ...product } : item)),
    );
  };

  useEffect(() => {
    setTotalV(formatCurrencyValue({ value: products.reduce((pv, p) => pv + p.totalValue, 0) }));
  }, [products]);

  return (
    <VStack as='section' p={2} spacing={4} alignItems='stretch' bgColor='blue.500'>
      <Accordion defaultIndex={[0]} allowMultiple>
        {products.map((product, index) => (
          <InvoiceProduct
            key={`p-${index + 1}`}
            indexProduct={index + 1}
            product={{ ...product }}
            onChange={handleOnChangeProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </Accordion>

      <Button variant='ghost' leftIcon={<PlusSquareIcon />} onClick={handleAddProduct}>
        Agregar producto
      </Button>

      <Text align='center' as='mark'>
        {`Valor total factura: ${totalV}`}
      </Text>

      <Input isReadOnly type='text' hidden={true} value={totalV} name='invoiceTotalValue' />
    </VStack>
  );
}

function InvoiceProduct(props: InvoiceProductProps) {
  const { indexProduct = 1, product, onChange, onDelete = () => null } = props;

  const handleOnChange = ({ name, value }: { name: string; value: string | number }) => {
    onChange({ indexProduct, product: { ...product, [name]: !!value ? value : '' } });
  };

  useEffect(() => {
    const total = product.unitValue * product.amount;
    handleOnChange({ name: 'totalValue', value: total });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.unitValue, product.amount]);

  return (
    <AccordionItem as='article' p={2} mt={3} border='none' borderRadius='0.5rem' bgColor='blue.700'>
      <AccordionButton as='header' p={1} justifyContent='space-between'>
        <Heading as='h2' size='md'>
          # {indexProduct}
        </Heading>
        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel p={0}>
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
            pattern={'\\$\\s[0-9]{1,3}(.[0-9]{3})*'}
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

        <HStack m={2} justifyContent='flex-end'>
          <Text>Eliminar este producto</Text>
          <IconButton
            size='xs'
            variant='solid'
            colorScheme='red'
            icon={<MinusIcon />}
            aria-label='delete product'
            onClick={() => onDelete(indexProduct)}
          />
        </HStack>
      </AccordionPanel>
    </AccordionItem>
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
  const result = Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
  return !!value ? result : '';
}

function parseCurrencyValue({ value }: { value: string }) {
  return parseNumberByThousands({ value }).replaceAll(',00', '').slice(2);
}

interface InvoiceProductProps {
  indexProduct: IndexProduct;
  product: Product;
  onDelete?: (indexProduct: IndexProduct) => void;
  onChange: (params: { indexProduct: IndexProduct; product: Product }) => void;
}

interface Product {
  amount: number;
  unitValue: number;
  totalValue: number;
  description: string;
}

export interface ProductToSubmit {
  amount: string;
  unitValue: string;
  totalValue: string;
  description: string;
}

export type InvoiceNumber = string;

export interface ResultSubmit {
  invoiceNumber: InvoiceNumber;
  orderName: string;
  wayToPay: string;
  forWhom: string;
  dateStart: string;
  dateEnd: string;
  products: ProductToSubmit[];
  totalToWords: string;
  invoiceTotalValue: string;
}

type IndexProduct = number;
