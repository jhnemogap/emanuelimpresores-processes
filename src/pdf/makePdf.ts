import { jsPDF } from 'jspdf';

import { pxToCm, pxToPt } from '../utils/lengthUnits.util';

import type { ResultSubmit } from 'pages/invoices/new';

const DRAW_ALL_RECTS = true;
const COLOR_RED = '#f00';
const COLOR_BLACK = '#000';
const NORMAL_FONT_SIZE_IN_PX = 16; // 1.0rem -> 16px
const SMALL_FONT_SIZE_IN_PX = NORMAL_FONT_SIZE_IN_PX * 0.75; // 0.75rem -> 12px
let GLOBAL_FONT_SIZE_IN_PX = NORMAL_FONT_SIZE_IN_PX;

export function generatePDF(props: generatePDFProps) {
  const { data, isPreview = false } = props;
  const doc = new jsPDF({ unit: 'cm', format: [19.9, 22.0] });
  // +++ app +++
  doc.setLineWidth(0.01);
  setBaseFontToFill({ doc });
  if (DRAW_ALL_RECTS) drawAllRects({ doc });
  // +++ header +++
  drawInvoiceNumber({ doc, value: data.invoiceNumber });
  drawForWhom({ doc, value: data.forWhom });
  // +++ save or preview PDF +++
  return isPreview ? doc.output('bloburl') : doc.save('my-pdf-test');
}

function drawAllRects({ doc }: BaseDrawerFn) {
  doc.rect(0.7, 1.1, 18.5, 19.9);
  doc.rect(14.9, 1.4, 4.0, 1.0);
  doc.rect(0.7, 2.7, 10.5, 1.9);
  doc.rect(3.0, 3.0, 7.5, 1.4);
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
  setBaseFontToFill({ doc });
}

function drawForWhom(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [3.0, 3.1];
  const characterWidth = pxToCm(GLOBAL_FONT_SIZE_IN_PX);
  const shiftTop = characterWidth / 2;
  doc.text(value, x, y + shiftTop);
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
  isPreview: boolean;
}

interface BaseDrawerFn {
  doc: jsPDF;
}

interface DrawerFnValueString extends BaseDrawerFn {
  value: string;
}

interface SetBaseFontToFillParams {
  doc: jsPDF;
  size?: 'small' | 'normal';
  fontWeight?: string | number;
}
