import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun, HeadingLevel, BorderStyle, ImageRun, Header } from 'docx';
import { TABLES } from '../pages/constants'

export const generateWordReport = async (data, columnNames, valueColumns, images, isRedField, reportConfig) => {
  const {
    clientName,
    clientCompany,
    contactName,
    contactEmail,
    contactPhone,
    filename,
    indice,
    logoImage
  } = reportConfig;

  const syntheseTable = TABLES.find(t => t.key === 'synthese');
  if (!syntheseTable) {
    throw new Error('Synthese table not found');
  }

  // Create header for pages 2-4
  const createHeader = () => {
    return new Header({
      children: [
        new Paragraph({
          children: [
            new TextRun({ 
              text: `PROPOSITION TECHNICO COMMERCIALE - ${filename}`, 
              bold: true, 
              size: 28,
              color: "1e3a8a",
              font: "Calibri"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text: `INDICE ${indice}`, 
              bold: true, 
              size: 20,
              color: "374151"
            })
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 }
        })
      ]
    });
  };

  // First Page Content
  const firstPageContent = [];

  // Add logo if provided (centered, reasonable size)
  if (logoImage) {
    try {
      const logoRun = new ImageRun({
        data: logoImage.buffer,
        transformation: {
          width: 200,
          height: 150,
        },
      });

      firstPageContent.push(
        new Paragraph({
          children: [logoRun],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 400 }
        })
      );
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  } else {
    firstPageContent.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { before: 600, after: 400 }
      })
    );
  }

  // Add client information centered below logo
  firstPageContent.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: `A L'ATTENTION DE ${clientName} – ${clientCompany}`, 
          bold: true, 
          size: 28,
          color: "1e3a8a",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: `AFFAIRE SUIVIE PAR ${contactName}`, 
          bold: true, 
          size: 22,
          color: "374151",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: `Mail : ${contactEmail}`, 
          size: 18,
          color: "6b7280",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: `Téléphone : ${contactPhone}`, 
          size: 18,
          color: "6b7280",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  );

  // Create synthesis table
  const headerCells = [
    new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ 
          text: "Champs", 
          bold: true, 
          color: "FFFFFF",
          font: "Calibri",
          size: 20
        })],
        alignment: AlignmentType.CENTER
      })],
      shading: { fill: "4472C4" },
      width: { size: 30, type: WidthType.PERCENTAGE }
    })
  ];

  columnNames.forEach(columnName => {
    headerCells.push(new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ 
          text: columnName, 
          bold: true, 
          color: "FFFFFF",
          font: "Calibri",
          size: 18
        })],
        alignment: AlignmentType.CENTER
      })],
      shading: { fill: "4472C4" },
      width: { size: 70 / valueColumns, type: WidthType.PERCENTAGE }
    }));
  });

  const headerRow = new TableRow({ children: headerCells });

  const dataRows = syntheseTable.headers.map((header, index) => {
    const rowColor = index % 2 === 0 ? "F8FAFC" : "FFFFFF";
    
    const cells = [
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ 
            text: header, 
            bold: true,
            color: "1F2937",
            font: "Calibri",
            size: 16
          })],
          alignment: AlignmentType.LEFT
        })],
        shading: { fill: rowColor },
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
            color: isRed ? "DC2626" : "374151",
            font: "Calibri",
            size: 14
          })],
          alignment: AlignmentType.CENTER
        })],
        shading: { fill: isRed ? "FEF2F2" : rowColor },
        width: { size: 70 / valueColumns, type: WidthType.PERCENTAGE }
      }));
    }

    return new TableRow({ children: cells });
  });

  const synthesisTable = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "4472C4" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "4472C4" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "4472C4" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "4472C4" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }
    }
  });

  // Second Page Content
  const secondPageContent = [
    new Paragraph({
      children: [new TextRun({ 
        text: "Tableau de Synthèse", 
        size: 28, 
        bold: true,
        color: "1e3a8a",
        font: "Calibri"
      })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 300 },
      alignment: AlignmentType.CENTER
    }),
    synthesisTable
  ];

  // Third Page Content
  const thirdPageContent = [
    new Paragraph({
      children: [new TextRun({ 
        text: "Détails Techniques", 
        size: 28, 
        bold: true,
        color: "1e3a8a",
        font: "Calibri"
      })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 300 },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [new TextRun({ 
        text: `Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 
        size: 16,
        italics: true,
        color: "6b7280",
        font: "Calibri"
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),
    new Paragraph({
      children: [new TextRun({ 
        text: `Nombre de colonnes de données : ${valueColumns}`, 
        size: 14,
        color: "374151",
        font: "Calibri"
      })],
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [new TextRun({ 
        text: `Colonnes : ${columnNames.join(', ')}`, 
        size: 14,
        color: "374151",
        font: "Calibri"
      })],
      spacing: { after: 200 }
    })
  ];

  // Fourth Page Content
  const fourthPageContent = [
    new Paragraph({
      children: [new TextRun({ 
        text: "Images et Annexes", 
        size: 28, 
        bold: true,
        color: "1e3a8a",
        font: "Calibri"
      })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 300 },
      alignment: AlignmentType.CENTER
    })
  ];

  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      
      try {
        fourthPageContent.push(
          new Paragraph({
            children: [new TextRun({ 
              text: `Image ${i + 1}: ${img.name}`, 
              size: 18, 
              bold: true,
              color: "374151",
              font: "Calibri"
            })],
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

        fourthPageContent.push(
          new Paragraph({
            children: [imageRun],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          })
        );
        
      } catch (error) {
        console.error(`Error processing image ${img.name}:`, error);
        fourthPageContent.push(
          new Paragraph({
            children: [new TextRun({ 
              text: `Erreur: Impossible d'insérer l'image ${img.name}`, 
              color: "DC2626",
              font: "Calibri"
            })],
            spacing: { before: 100, after: 200 }
          })
        );
      }
    }
  } else {
    fourthPageContent.push(
      new Paragraph({
        children: [new TextRun({ 
          text: "Aucune image ajoutée", 
          italics: true,
          size: 16,
          color: "9CA3AF",
          font: "Calibri"
        })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );
  }

  const doc = new Document({
    sections: [
      // First page (no headers)
      {
        children: firstPageContent,
        properties: {
          page: {
            pageNumbers: { start: 1, formatType: "decimal" }
          }
        }
      },
      // Second page with header
      {
        headers: {
          default: createHeader()
        },
        children: secondPageContent,
        properties: {
          page: {
            pageNumbers: { start: 2, formatType: "decimal" }
          }
        }
      },
      // Third page with header
      {
        headers: {
          default: createHeader()
        },
        children: thirdPageContent,
        properties: {
          page: {
            pageNumbers: { start: 3, formatType: "decimal" }
          }
        }
      },
      // Fourth page with header
      {
        headers: {
          default: createHeader()
        },
        children: fourthPageContent,
        properties: {
          page: {
            pageNumbers: { start: 4, formatType: "decimal" }
          }
        }
      }
    ]
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