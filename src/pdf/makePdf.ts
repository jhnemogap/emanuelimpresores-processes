import { jsPDF } from 'jspdf';

import { pxToCm, pxToPt } from '../utils/lengthUnits.util';

import type { ResultSubmit } from 'pages/invoices/new';

const COLOR_RED = '#f00';
const COLOR_BLACK = '#000';
const NORMAL_FONT_SIZE_IN_PX = 16; // 1.0rem -> 16px
const SMALL_FONT_SIZE_IN_PX = NORMAL_FONT_SIZE_IN_PX * 0.75; // 0.75rem -> 12px

export function generatePDF(props: generatePDFProps) {
  const { data, isPreview = false } = props;
  const doc = new jsPDF({ unit: 'cm', format: [19.9, 22.0] });
  // +++ app +++
  doc.setLineWidth(0.01);
  setBaseFontToFill({ doc });
  // doc.rect(0.7, 1.1, 18.5, 19.9);
  // +++ header +++
  drawInvoiceNumber({ doc, value: data.invoiceNumber });
  // +++ save or preview PDF +++
  return isPreview ? doc.output('bloburl') : doc.save('my-pdf-test');
}

// +++ header-item__bill-title +++
function drawInvoiceNumber(props: DrawerFnValueString) {
  const { doc, value } = props;
  const [x, y] = [16.9, 2.1];
  const fontSizeInPX = 24; // 1.5rem
  const characterWidth = pxToCm(fontSizeInPX) / 2;
  const shiftLeft = characterWidth * (value.length / 2);
  // doc.rect(14.9, 1.4, 4.0, 1.0);
  doc.setFont('helvetica', 'normal', 'bold');
  doc.setFontSize(pxToPt(fontSizeInPX));
  doc.setTextColor(COLOR_RED);
  doc.text(value, x - shiftLeft, y);
  setBaseFontToFill({ doc });
}

function setBaseFontToFill(params: SetBaseFontToFillParams) {
  const { doc, size = 'normal', fontWeight = 'normal' } = params;
  doc.setTextColor(COLOR_BLACK);
  doc.setFont('courier', 'normal', fontWeight);
  doc.setFontSize(pxToPt(size === 'normal' ? NORMAL_FONT_SIZE_IN_PX : SMALL_FONT_SIZE_IN_PX));
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
