import { jsPDF } from 'jspdf';

import { pxToPt } from '../utils/lengthUnits.util';

import type { ResultSubmit } from 'pages/invoices/new';

const COLOR_RED = '#f00';

export function generatePDF(props: generatePDFProps) {
  const { data, isPreview = false } = props;
  const doc = new jsPDF({ unit: 'cm', format: [19.9, 22.0] });
  // +++ app +++
  // doc.rect(0.7, 1.1, 18.5, 19.9);
  doc.setFont('sans-serif', 'normal', 'normal');
  // +++ header +++
  drawInvoiceNumber({ doc, value: data.invoiceNumber });
  // +++ save or preview PDF +++
  return isPreview ? doc.output('bloburl') : doc.save('my-pdf-test');
}

function drawInvoiceNumber(props: DrawerFnValueString) {
  const { doc, value } = props;
  // +++ header-item__bill-title +++
  doc.rect(14.9, 1.4, 4.0, 0.9);
  doc.setFont('Arial', 'normal', 'bold');
  doc.setFontSize(pxToPt(24));
  doc.setTextColor(COLOR_RED);
  doc.text(value, 14.9, 1.9);
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
