import { jsPDF } from 'jspdf';

export function generatePDF() {
  const doc = new jsPDF();
  doc.setFontSize(40);
  doc.setFont("helvetica", "bold");
  doc.text('Hola', 60, 30);
  doc.save('my-pdf-test');
}
