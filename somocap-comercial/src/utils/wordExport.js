import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun, HeadingLevel, BorderStyle, ImageRun, Header, Footer } from 'docx';
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

  // Beautiful header with gradient-like styling for pages 2-4
  const createHeader = () => {
    return new Header({
      children: [
        // Main title with elegant styling
        new Paragraph({
          children: [
            new TextRun({ 
              text: "PROPOSITION TECHNICO COMMERCIALE", 
              bold: true, 
              size: 28,
              color: "1e3a8a", // Deep blue
              font: "Calibri"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 150 },
          border: {
            bottom: {
              color: "3b82f6",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6
            }
          }
        }),
        // Filename with modern styling
        new Paragraph({
          children: [
            new TextRun({ 
              text: filename.toUpperCase(), 
              bold: true, 
              size: 20,
              color: "374151", // Gray-700
              font: "Calibri"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),
        // Indice with badge-like styling
        new Paragraph({
          children: [
            new TextRun({ 
              text: `INDICE ${indice}`, 
              bold: true, 
              size: 18,
              color: "FFFFFF",
              highlight: "3b82f6" // Blue background
            })
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 300 }
        })
      ]
    });
  };

  // Beautiful footer
  const createFooter = () => {
    return new Footer({
      children: [
        new Paragraph({
          children: [
            new TextRun({ 
              text: `${contactName} - ${contactEmail} - ${contactPhone}`, 
              size: 16,
              color: "6b7280", // Gray-500
              italics: true
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: {
            top: {
              color: "e5e7eb",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 3
            }
          }
        })
      ]
    });
  };

  // First Page Content - Cover Page
  const firstPageContent = [];

  // Add decorative spacing and title
  firstPageContent.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { before: 800 }
    })
  );

  // Add logo if provided with elegant framing
  if (logoImage) {
    try {
      const logoRun = new ImageRun({
        data: logoImage.buffer,
        transformation: {
          width: 250,
          height: 180,
        },
      });

      firstPageContent.push(
        new Paragraph({
          children: [logoRun],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          border: {
            top: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
            bottom: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
            left: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
            right: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 }
          }
        })
      );
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  } else {
    firstPageContent.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { before: 400, after: 600 }
      })
    );
  }

  // Elegant client information section
  firstPageContent.push(
    // Main attention line with beautiful styling
    new Paragraph({
      children: [
        new TextRun({ 
          text: "À L'ATTENTION DE", 
          bold: true, 
          size: 20,
          color: "6b7280",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: `${clientName} – ${clientCompany}`, 
          bold: true, 
          size: 32,
          color: "1e3a8a", // Deep blue
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      border: {
        bottom: {
          color: "3b82f6",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 4
        }
      }
    }),
    
    // Contact section with card-like styling
    new Paragraph({
      children: [
        new TextRun({ 
          text: "AFFAIRE SUIVIE PAR", 
          bold: true, 
          size: 18,
          color: "6b7280",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 }
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: contactName, 
          bold: true, 
          size: 26,
          color: "1f2937", // Gray-800
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),
    
    // Contact details with icons (using symbols)
    new Paragraph({
      children: [
        new TextRun({ 
          text: "✉ ", 
          size: 20,
          color: "3b82f6"
        }),
        new TextRun({ 
          text: contactEmail, 
          size: 18,
          color: "374151",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 }
    }),
    new Paragraph({
      children: [
        new TextRun({ 
          text: "📞 ", 
          size: 20,
          color: "3b82f6"
        }),
        new TextRun({ 
          text: contactPhone, 
          size: 18,
          color: "374151",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // Beautiful synthesis table with modern styling
  const headerCells = [
    new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ 
          text: "CHAMPS", 
          bold: true, 
          color: "FFFFFF",
          font: "Calibri",
          size: 22
        })],
        alignment: AlignmentType.CENTER
      })],
      shading: { 
        fill: "1e40af" // Beautiful deep blue
      },
      width: { size: 30, type: WidthType.PERCENTAGE },
      margins: {
        top: 200,
        bottom: 200,
        left: 100,
        right: 100
      }
    })
  ];

  columnNames.forEach((columnName, index) => {
    // Alternate header colors for visual appeal
    const headerColor = index % 2 === 0 ? "3b82f6" : "2563eb";
    
    headerCells.push(new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ 
          text: columnName.toUpperCase(), 
          bold: true, 
          color: "FFFFFF",
          font: "Calibri",
          size: 20
        })],
        alignment: AlignmentType.CENTER
      })],
      shading: { fill: headerColor },
      width: { size: 70 / valueColumns, type: WidthType.PERCENTAGE },
      margins: {
        top: 200,
        bottom: 200,
        left: 100,
        right: 100
      }
    }));
  });

  const headerRow = new TableRow({ children: headerCells });

  const dataRows = syntheseTable.headers.map((header, index) => {
    // Beautiful alternating row colors
    const rowColor = index % 2 === 0 ? "f8fafc" : "ffffff";
    
    const cells = [
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ 
            text: header, 
            bold: true,
            color: "1f2937",
            font: "Calibri",
            size: 18
          })],
          alignment: AlignmentType.LEFT
        })],
        shading: { fill: rowColor },
        width: { size: 30, type: WidthType.PERCENTAGE },
        margins: {
          top: 150,
          bottom: 150,
          left: 200,
          right: 100
        }
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
            color: isRed ? "dc2626" : "374151", // Red for calculated, gray for normal
            font: "Calibri",
            size: 16
          })],
          alignment: AlignmentType.CENTER
        })],
        shading: { fill: isRed ? "fef2f2" : rowColor }, // Light red background for calculated fields
        width: { size: 70 / valueColumns, type: WidthType.PERCENTAGE },
        margins: {
          top: 150,
          bottom: 150,
          left: 100,
          right: 100
        }
      }));
    }

    return new TableRow({ children: cells });
  });

  const synthesisTable = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "1e40af" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "1e40af" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "1e40af" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "1e40af" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "e5e7eb" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "e5e7eb" }
    }
  });

  // Second Page Content - Beautiful Synthesis Table
  const secondPageContent = [
    new Paragraph({
      children: [
        new TextRun({ 
          text: "📊 TABLEAU DE SYNTHÈSE", 
          size: 32, 
          bold: true,
          color: "1e40af",
          font: "Calibri"
        })
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 400 },
      alignment: AlignmentType.CENTER,
      border: {
        bottom: {
          color: "3b82f6",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 4
        }
      }
    }),
    synthesisTable
  ];

  // Third Page Content - Elegant Technical Details
  const thirdPageContent = [
    new Paragraph({
      children: [
        new TextRun({ 
          text: "⚙️ DÉTAILS TECHNIQUES", 
          size: 32, 
          bold: true,
          color: "1e40af",
          font: "Calibri"
        })
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 400 },
      alignment: AlignmentType.CENTER,
      border: {
        bottom: {
          color: "3b82f6",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 4
        }
      }
    }),
    
    // Information card-style section
    new Paragraph({
      children: [
        new TextRun({ 
          text: `📅 Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 
          size: 18,
          italics: true,
          color: "6b7280",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      shading: { fill: "f8fafc" },
      border: {
        top: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
        bottom: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
        left: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
        right: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 }
      }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ 
          text: "📋 INFORMATIONS PROJET", 
          size: 24,
          bold: true,
          color: "1f2937",
          font: "Calibri"
        })
      ],
      spacing: { before: 200, after: 300 },
      border: {
        bottom: {
          color: "d1d5db",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 2
        }
      }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ 
          text: `📊 Nombre de colonnes de données : `, 
          size: 16,
          color: "6b7280",
          font: "Calibri"
        }),
        new TextRun({ 
          text: valueColumns.toString(), 
          size: 16,
          bold: true,
          color: "1f2937",
          font: "Calibri"
        })
      ],
      spacing: { after: 200 }
    }),
    
    new Paragraph({
      children: [
        new TextRun({ 
          text: `🏷️ Colonnes : `, 
          size: 16,
          color: "6b7280",
          font: "Calibri"
        }),
        new TextRun({ 
          text: columnNames.join(', '), 
          size: 16,
          bold: true,
          color: "1f2937",
          font: "Calibri"
        })
      ],
      spacing: { after: 300 }
    })
  ];

  // Fourth Page Content - Beautiful Images Gallery
  const fourthPageContent = [
    new Paragraph({
      children: [
        new TextRun({ 
          text: "🖼️ IMAGES ET ANNEXES", 
          size: 32, 
          bold: true,
          color: "1e40af",
          font: "Calibri"
        })
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 400 },
      alignment: AlignmentType.CENTER,
      border: {
        bottom: {
          color: "3b82f6",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 4
        }
      }
    })
  ];

  if (images.length > 0) {
    fourthPageContent.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: `📷 ${images.length} image(s) ajoutée(s)`, 
            size: 18,
            italics: true,
            color: "6b7280",
            font: "Calibri"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      
      try {
        // Image title with number badge
        fourthPageContent.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `${i + 1}`, 
                bold: true,
                color: "FFFFFF",
                size: 16,
                highlight: "3b82f6"
              }),
              new TextRun({ 
                text: ` ${img.name}`, 
                size: 18, 
                bold: true,
                color: "1f2937",
                font: "Calibri"
              })
            ],
            spacing: { before: 300, after: 200 },
            border: {
              bottom: {
                color: "e5e7eb",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 1
              }
            }
          })
        );

        const imageRun = new ImageRun({
          data: img.buffer,
          transformation: {
            width: 450,
            height: 320,
          },
        });

        // Image with elegant border
        fourthPageContent.push(
          new Paragraph({
            children: [imageRun],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            border: {
              top: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 2 },
              bottom: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 2 },
              left: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 2 },
              right: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 2 }
            }
          })
        );
        
      } catch (error) {
        console.error(`Error processing image ${img.name}:`, error);
        fourthPageContent.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: "⚠️ ", 
                size: 20,
                color: "dc2626"
              }),
              new TextRun({ 
                text: `Erreur: Impossible d'insérer l'image ${img.name}`, 
                color: "dc2626",
                italics: true,
                font: "Calibri"
              })
            ],
            spacing: { before: 200, after: 300 },
            shading: { fill: "fef2f2" },
            border: {
              left: { color: "dc2626", space: 1, style: BorderStyle.SINGLE, size: 4 }
            }
          })
        );
      }
    }
  } else {
    fourthPageContent.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: "📂 Aucune image ajoutée", 
            italics: true,
            size: 20,
            color: "9ca3af",
            font: "Calibri"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        shading: { fill: "f9fafb" },
        border: {
          top: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
          bottom: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
          left: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 },
          right: { color: "e5e7eb", space: 1, style: BorderStyle.SINGLE, size: 1 }
        }
      })
    );
  }

  const doc = new Document({
    sections: [
      // First page - Beautiful cover page
      {
        children: firstPageContent,
        properties: {
          page: {
            pageNumbers: { start: 1, formatType: "decimal" },
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        }
      },
      // Second page - Synthesis table with header and footer
      {
        headers: { default: createHeader() },
        footers: { default: createFooter() },
        children: secondPageContent,
        properties: {
          page: {
            pageNumbers: { start: 2, formatType: "decimal" },
            margin: {
              top: 2160, // More space for header
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        }
      },
      // Third page - Technical details with header and footer
      {
        headers: { default: createHeader() },
        footers: { default: createFooter() },
        children: thirdPageContent,
        properties: {
          page: {
            pageNumbers: { start: 3, formatType: "decimal" },
            margin: {
              top: 2160,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        }
      },
      // Fourth page - Images with header and footer
      {
        headers: { default: createHeader() },
        footers: { default: createFooter() },
        children: fourthPageContent,
        properties: {
          page: {
            pageNumbers: { start: 4, formatType: "decimal" },
            margin: {
              top: 2160,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
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