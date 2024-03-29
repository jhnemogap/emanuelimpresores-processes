import { jsPDF } from 'jspdf';

import { pxToCm, pxToPt } from '../utils/lengthUnits.util';

import type { ProductToSubmit, ResultSubmit } from 'pages/invoices/new';

const COLOR_RED = '#f00';
const COLOR_BLACK = '#000';
const NORMAL_FONT_SIZE_IN_PX = 16; // 1.0rem -> 16px
const SMALL_FONT_SIZE_IN_PX = NORMAL_FONT_SIZE_IN_PX * 0.75; // 0.75rem -> 12px
let GLOBAL_FONT_SIZE_IN_PX = NORMAL_FONT_SIZE_IN_PX;

export function generatePDF(props: generatePDFProps) {
  const { data, isPreview = false, toggleEnableLines = false } = props;
  const doc = new jsPDF({ unit: 'cm', format: [19.9, 22.0] });
  // +++ app +++
  doc.setLineWidth(0.01);
  if (toggleEnableLines) drawAllRects({ doc });
  // +++ header +++
  setBaseFontToFill({ doc });
  drawInvoiceNumber({ doc, value: data.invoiceNumber });
  setBaseFontToFill({ doc, fontWeight: 'bold' });
  drawForWhom({ doc, value: data.forWhom });
  setBaseFontToFill({ doc, size: 'small', fontWeight: 'bold' });
  drawDateStart({ doc, value: data.dateStart });
  drawDateEnd({ doc, value: data.dateEnd });
  drawPurchaseOrder({ doc, value: data.purchaseOrder });
  drawWayToPay({ doc, value: data.wayToPay });
  // +++ products +++
  drawProducts({ doc, products: data.products });
  // +++ footer +++
  setBaseFontToFill({ doc, fontWeight: 'bold' });
  drawTotalToWord({ doc, value: data.totalToWords });
  setBaseFontToFill({ doc, size: 'small', fontWeight: 'bold' });
  drawSubtotal({ doc, value: data.invoiceTotalValue });
  drawTotal({ doc, value: data.invoiceTotalValue });
  // +++ save or preview PDF +++
  return isPreview ? doc.output('bloburl') : doc.save('my-pdf-test');
}

function drawAllRects({ doc }: BaseDrawerFn) {
  doc.rect(0.7, 1.1, 18.5, 19.9);
  // +++ header +++
  doc.rect(14.9, 1.4, 4.0, 1.0);
  doc.rect(0.7, 2.7, 11.0, 1.9);
  doc.rect(3.0, 3.0, 7.5, 1.4);
  doc.rect(11.5, 2.7, 7.7, 1.9);
  doc.rect(15.3, 2.7, 3.9, 0.65);
  doc.rect(11.5, 3.35, 7.7, 0.6);
  // +++ products +++
  doc.rect(0.7, 5.3, 1.4, 11.8);
  doc.rect(2.1, 5.3, 12.3, 11.8);
  doc.rect(14.4, 5.3, 1.95, 11.8);
  doc.rect(16.35, 5.3, 2.85, 11.8);
  // +++ footer +++
  doc.rect(0.7, 17.2, 13.5, 1.1);
  doc.rect(16.4, 17.2, 2.8, 1.0);
  doc.rect(16.4, 18.2, 2.8, 1.1);
}

function drawInvoiceNumber(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [16.9, 2.1];
  const fontSizeInPX = 24; // 1.5rem
  const characterWidth = pxToCm(fontSizeInPX) / 2;
  const shiftLeft = characterWidth * (value.length / 2);
  doc.setFont('helvetica', 'normal', 'bold');
  doc.setFontSize(pxToPt(fontSizeInPX));
  doc.setTextColor(COLOR_RED);
  doc.text(value, x - shiftLeft, y);
}

function drawForWhom(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [3.0, 3.1];
  const characterWidth = pxToCm(GLOBAL_FONT_SIZE_IN_PX);
  const shiftTop = characterWidth / 2;
  doc.text(value, x, y + shiftTop, { maxWidth: 20 });
}

function drawDateStart(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [12.5, 3.05];
  const characterWidth = pxToCm(GLOBAL_FONT_SIZE_IN_PX);
  const shiftTop = characterWidth / 2;
  doc.text(value, x, y + shiftTop);
}

function drawDateEnd(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [16.0, 3.05];
  const characterWidth = pxToCm(GLOBAL_FONT_SIZE_IN_PX);
  const shiftTop = characterWidth / 2;
  doc.text(value, x, y + shiftTop);
}

function drawPurchaseOrder(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [14.3, 3.75];
  doc.text(value, x, y);
}

function drawWayToPay(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [14.0, 4.35];
  doc.text(value, x, y);
}

function drawProducts(props: DrawerFnProducts) {
  const { doc, products } = props;
  setBaseFontToFill({ doc });
  const [xAmount, xDesc, xSubV, xTotalV] = [2.0, 2.3, 16.3, 19.1];
  const Y_SPACE = doc.getLineHeightFactor() * pxToCm(GLOBAL_FONT_SIZE_IN_PX);
  let [x, y] = [0, 6.0];
  products.forEach((p) => {
    setBaseFontToFill({ doc });
    x = xAmount;
    doc.text(p.amount, x, y, { align: 'right' });
    x = xDesc;
    doc.text(p.description, x, y, { align: 'left' });
    y += Y_SPACE * [...p.description.matchAll(/\r\n/g)].length;
    setBaseFontToFill({ doc, size: 'small' });
    x = xSubV;
    doc.text(p.unitValue, x, y, { align: 'right' });
    x = xTotalV;
    doc.text(p.totalValue, x, y, { align: 'right' });
    y += Y_SPACE * 2.0;
  });
}

function drawTotalToWord(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [2, 17.4];
  const characterWidth = pxToCm(GLOBAL_FONT_SIZE_IN_PX);
  const shiftTop = characterWidth / 2;
  doc.text(value, x, y + shiftTop);
}

function drawSubtotal(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [19.1, 17.8];
  doc.text(value, x, y, { align: 'right' });
}

function drawTotal(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [19.1, 18.85];
  doc.text(value, x, y, { align: 'right' });
}

function setBaseFontToFill(params: SetBaseFontToFillParams) {
  const { doc, size = 'normal', fontWeight = 'normal' } = params;
  const newFontSize = size === 'normal' ? NORMAL_FONT_SIZE_IN_PX : SMALL_FONT_SIZE_IN_PX;
  GLOBAL_FONT_SIZE_IN_PX = newFontSize;
  doc.setTextColor(COLOR_BLACK);
  doc.setFont('courier', 'normal', fontWeight);
  doc.setFontSize(pxToPt(newFontSize));
}

interface DataSubmit {
  data: ResultSubmit;
}

interface generatePDFProps extends DataSubmit {
  isPreview?: boolean;
  toggleEnableLines?: boolean;
}

interface BaseDrawerFn {
  doc: jsPDF;
}

interface DrawerFnValueString extends BaseDrawerFn {
  value: string;
}

interface DrawerFnProducts extends BaseDrawerFn {
  products: ProductToSubmit[];
}

interface SetBaseFontToFillParams {
  doc: jsPDF;
  size?: 'small' | 'normal';
  fontWeight?: string | number;
}
