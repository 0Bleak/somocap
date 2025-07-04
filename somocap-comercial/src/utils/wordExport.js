import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun, HeadingLevel, BorderStyle, ImageRun } from 'docx';
import { TABLES } from '../pages/constants'
export const generateWordReport = async (data, columnNames, valueColumns, images, isRedField) => {
  const syntheseTable = TABLES.find(t => t.key === 'synthese');
  if (!syntheseTable) {
    throw new Error('Synthese table not found');
  }

  const headerCells = [
    new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: "Champs", bold: true, color: "FFFFFF" })],
        alignment: AlignmentType.CENTER
      })],
      shading: { fill: "4472C4" },
      width: { size: 30, type: WidthType.PERCENTAGE }
    })
  ];

  columnNames.forEach(columnName => {
    headerCells.push(new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: columnName, bold: true, color: "FFFFFF" })],
        alignment: AlignmentType.CENTER
      })],
      shading: { fill: "4472C4" },
      width: { size: 70 / valueColumns, type: WidthType.PERCENTAGE }
    }));
  });

  const headerRow = new TableRow({ children: headerCells });

  const dataRows = syntheseTable.headers.map((header, index) => {
    const cells = [
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: header, bold: true })],
          alignment: AlignmentType.LEFT
        })],
        shading: { fill: index % 2 === 0 ? "F2F2F2" : "FFFFFF" },
        width: { size: 30, type: WidthType.PERCENTAGE }
      })
    ];

    for (let col = 0; col < valueColumns; col++) {
      const cellValue = data[col]?.synthese?.[header] || '';
      const isRed = isRedField('synthese', header);
      
      cells.push(new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ 
            text: cellValue.toString(), 
            bold: isRed,
            color: isRed ? "D32F2F" : "000000"
          })],
          alignment: AlignmentType.CENTER
        })],
        shading: { fill: index % 2 === 0 ? "F2F2F2" : "FFFFFF" },
        width: { size: 70 / valueColumns, type: WidthType.PERCENTAGE }
      }));
    }

    return new TableRow({ children: cells });
  });

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 }
    }
  });

  const documentContent = [
    new Paragraph({
      children: [new TextRun({ text: "Rapport de Synthèse", size: 32, bold: true })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),
    new Paragraph({
      children: [new TextRun({ 
        text: `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 
        size: 20,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Tableau de Synthèse", size: 24, bold: true })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 200 }
    }),
    table,
  ];

  if (images.length > 0) {
    documentContent.push(
      new Paragraph({
        children: [new TextRun({ text: "Images et Annexes", size: 24, bold: true })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      })
    );

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      
      try {
        documentContent.push(
          new Paragraph({
            children: [new TextRun({ text: `Image ${i + 1}: ${img.name}`, size: 16, bold: true })],
            spacing: { before: 200, after: 100 }
          })
        );

        const imageRun = new ImageRun({
          data: img.buffer,
          transformation: {
            width: 400,
            height: 300,
          },
        });

        documentContent.push(
          new Paragraph({
            children: [imageRun],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          })
        );
        
      } catch (error) {
        console.error(`Error processing image ${img.name}:`, error);
        documentContent.push(
          new Paragraph({
            children: [new TextRun({ 
              text: `Erreur: Impossible d'insérer l'image ${img.name}`, 
              color: "FF0000", 
            })],
            spacing: { before: 100, after: 200 }
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [{
      children: documentContent
    }]
  });

  const blob = await Packer.toBlob(doc);
  return blob;
};

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};