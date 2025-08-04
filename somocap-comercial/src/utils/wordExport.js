import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun, HeadingLevel, BorderStyle, ImageRun, Header, Footer, PageBreak } from 'docx';

export const generateWordReport = async (data, columnNames, valueColumns, images, isRedField, reportConfig) => {
  const {
    clientName,
    clientCompany,
    contactName,
    contactEmail,
    contactPhone,
    filename,
    indice,
    logoImage,
    footerImage,
    introductionText,
    revisionComment,
    revisionDate,
    revisionVisa,
    definitionSections = [],
    presentationSections = [],
    delaisItems = [],
    reservesItems = [],
    moq = '10 000pcs',
    transportConditions = 'port dû',
    seriesControl = 'Contrôle dimensionnel et aspect sur échantillonnage',
    packaging = 'en cartons standards avec protection',
    offerValidity = '3 mois',
    toolingInvoicing = 'Facturation de 50% à la commande : Virement à réception de facture',
    toolingBalance = 'Solde : 50% à la validation des échantillons - Virement à réception de facture',
    toolingDelay = 'Si délai de validation > 30 jours, la facture échantillons sera présentée à 30 jours après expédition',
    partsPayment = 'Virement à 30 jours date de facture',
    partsTransport = 'Port dû',
    signerName = '',
    signerRole = ''
  } = reportConfig;

  // Create footer with image
  const createFooter = () => {
    if (!footerImage) return null;
    
    try {
      return new Footer({
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: footerImage.buffer,
                transformation: {
                  width: 600,
                  height: 80,
                },
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 }
          })
        ]
      });
    } catch (error) {
      console.error('Error creating footer:', error);
      return null;
    }
  };

  const footer = createFooter();

  // Create header for pages 2+
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
            new TextRun({text: `INDICE ${indice}`, 
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
         spacing: { before: 400, after: 600 }
       })
     );
   } catch (error) {
     console.error('Error adding logo:', error);
   }
 }

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
     spacing: { after: 400 }
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
     spacing: { after: 300 }
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
     spacing: { after: 150 }
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
     spacing: { after: 400 }
   })
 );

 // Create revision table
 const revisionTable = new Table({
   rows: [
     new TableRow({
       children: [
         new TableCell({
           children: [new Paragraph({
             children: [new TextRun({ text: "INDICE", bold: true, color: "FFFFFF", font: "Calibri", size: 16 })],
             alignment: AlignmentType.CENTER
           })],
           shading: { fill: "4472C4" },
           width: { size: 15, type: WidthType.PERCENTAGE }
         }),
         new TableCell({
           children: [new Paragraph({
             children: [new TextRun({ text: "COMMENTAIRES", bold: true, color: "FFFFFF", font: "Calibri", size: 16 })],
             alignment: AlignmentType.CENTER
           })],
           shading: { fill: "4472C4" },
           width: { size: 50, type: WidthType.PERCENTAGE }
         }),
         new TableCell({
           children: [new Paragraph({
             children: [new TextRun({ text: "VISA", bold: true, color: "FFFFFF", font: "Calibri", size: 16 })],
             alignment: AlignmentType.CENTER
           })],
           shading: { fill: "4472C4" },
           width: { size: 15, type: WidthType.PERCENTAGE }
         }),
         new TableCell({
           children: [new Paragraph({
             children: [new TextRun({ text: "DATE", bold: true, color: "FFFFFF", font: "Calibri", size: 16 })],
             alignment: AlignmentType.CENTER
           })],
           shading: { fill: "4472C4" },
           width: { size: 20, type: WidthType.PERCENTAGE }
         })
       ]
     }),
     new TableRow({
       children: [
         new TableCell({
           children: [new Paragraph({
             children: [new TextRun({ text: indice, font: "Calibri", size: 14 })],
             alignment: AlignmentType.CENTER
           })],
           shading: { fill: "F8FAFC" }
         }),
         new TableCell({
           children: [new Paragraph({
             children: [new TextRun({ text: revisionComment, font: "Calibri", size: 14 })],
             alignment: AlignmentType.LEFT
           })],
           shading: { fill: "F8FAFC" }
         }),
         new TableCell({
           children: [new Paragraph({
             children: [new TextRun({ text: revisionVisa, font: "Calibri", size: 14 })],
             alignment: AlignmentType.CENTER
           })],
           shading: { fill: "F8FAFC" }
         }),
         new TableCell({
           children: [new Paragraph({
             children: [new TextRun({ text: revisionDate, font: "Calibri", size: 14 })],
             alignment: AlignmentType.CENTER
           })],
           shading: { fill: "F8FAFC" }
         })
       ]
     })
   ],
   width: { size: 100, type: WidthType.PERCENTAGE }
 });

 // Second Page Content (Table of Contents)
 const secondPageContent = [
   new Paragraph({
     children: [new TextRun({ 
       text: introductionText, 
       size: 16,
       color: "374151",
       font: "Calibri"
     })],
     spacing: { before: 200, after: 400 },
     alignment: AlignmentType.JUSTIFY
   }),
   revisionTable,
   new Paragraph({
     children: [new TextRun({ text: "" })],
     spacing: { after: 400 }
   }),
   new Paragraph({
     children: [new TextRun({ 
       text: "Table des matières", 
       size: 24, 
       bold: true,
       color: "1e3a8a",
       font: "Calibri"
     })],
     spacing: { before: 400, after: 300 },
     alignment: AlignmentType.LEFT
   }),
   new Paragraph({
    children: [new TextRun({ 
      text: "I. Définition du besoin & données d'entrée :.................................................................................3", 
      size: 14,
      font: "Calibri"
    })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [new TextRun({ 
      text: "II. Présentation offre technique :...................................................................................................... 4", 
      size: 14,
      font: "Calibri"
    })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [new TextRun({ 
      text: "III. Conditions tarifaires:.....................................................................................................................5", 
      size: 14,
      font: "Calibri"
    })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [new TextRun({ 
      text: "IV. Délais Projet : ................................................................................................................................. 6", 
      size: 14,
      font: "Calibri"
    })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [new TextRun({ 
      text: "V. Réserves :........................................................................................................................................ 6", 
      size: 14,
      font: "Calibri"
    })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [new TextRun({ 
      text: "VI. Conditions de réalisation : ............................................................................................................7", 
      size: 14,
      font: "Calibri"
    })],
    spacing: { after: 200 }
  })
];

// Helper function to create section content with images
const createSectionContent = (sections) => {
  const content = [];
  sections.forEach((section, index) => {
    if (section.title) {
      content.push(
        new Paragraph({
          children: [new TextRun({ 
            text: section.title, 
            size: 18, 
            bold: true,
            color: "374151",
            font: "Calibri"
          })],
          spacing: { before: 300, after: 200 }
        })
      );
    }

    if (section.content) {
      content.push(
        new Paragraph({
          children: [new TextRun({ 
            text: section.content, 
            size: 14,
            color: "374151",
            font: "Calibri"
          })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFY
        })
      );
    }

    if (section.image) {
      try {
        const imageRun = new ImageRun({
          data: section.image.buffer,
          transformation: {
            width: 400,
            height: 300,
          },
        });

        content.push(
          new Paragraph({
            children: [imageRun],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          })
        );
      } catch (error) {
        console.error(`Error processing section image:`, error);
      }
    }
  });
  return content;
};

// Page 3: Définition du besoin & données d'entrée
const page3Content = [
  new Paragraph({
    children: [new TextRun({ 
      text: "I. Définition du besoin & données d'entrée", 
      size: 24, 
      bold: true,
      color: "1e3a8a",
      font: "Calibri"
    })],
    spacing: { before: 200, after: 400 }
  }),
  ...createSectionContent(definitionSections)
];

// Page 4: Présentation offre technique
const page4Content = [
  new Paragraph({
    children: [new TextRun({ 
      text: "II. Présentation offre technique", 
      size: 24, 
      bold: true,
      color: "1e3a8a",
      font: "Calibri"
    })],
    spacing: { before: 200, after: 400 }
  }),
  ...createSectionContent(presentationSections)
];

// Page 5: Conditions tarifaires (empty with just title)
const page5Content = [
  new Paragraph({
    children: [new TextRun({ 
      text: "III. Conditions tarifaires", 
      size: 24, 
      bold: true,
      color: "1e3a8a",
      font: "Calibri"
    })],
    spacing: { before: 200, after: 400 }
  }),
  new Paragraph({
    children: [new TextRun({ 
      text: "[Contenu à développer]", 
      size: 14,
      italics: true,
      color: "9CA3AF",
      font: "Calibri"
    })],
    spacing: { after: 300 }
  })
];

// Page 6: Délais Projet & Réserves
const createDelaisAndReservesContent = () => {
  const content = [
    new Paragraph({
      children: [new TextRun({ 
        text: "IV. Délais Projet", 
        size: 24, 
        bold: true,
        color: "1e3a8a",
        font: "Calibri"
      })],
      spacing: { before: 200, after: 400 }
    }),
    new Paragraph({
      children: [new TextRun({ 
        text: "Ci-dessous sont indiqués les délais techniques :", 
        size: 16,
        color: "374151",
        font: "Calibri"
      })],
      spacing: { after: 200 }
    })
  ];

  // Create table for delais
  if (delaisItems.length > 0) {
    const delaisTable = new Table({
      rows: [
        // Header row
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Etapes", bold: true, font: "Calibri", size: 14 })],
                alignment: AlignmentType.CENTER
              })],
              shading: { fill: "E5E7EB" },
              width: { size: 60, type: WidthType.PERCENTAGE }
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Délais", bold: true, font: "Calibri", size: 14 })],
                alignment: AlignmentType.CENTER
              })],
              shading: { fill: "E5E7EB" },
              width: { size: 40, type: WidthType.PERCENTAGE }
            })
          ]
        }),
        // Data rows
        ...delaisItems.map(item => new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: item.etape, font: "Calibri", size: 14 })],
                alignment: AlignmentType.LEFT
              })],
              shading: { fill: "F8FAFC" }
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: item.delai, font: "Calibri", size: 14 })],
                alignment: AlignmentType.LEFT
              })],
              shading: { fill: "F8FAFC" }
            })
          ]
        }))
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }
      }
    });

    content.push(delaisTable);
  }

  // Add Réserves section
  content.push(
    new Paragraph({
      children: [new TextRun({ 
        text: "V. Réserves", 
        size: 24, 
        bold: true,
        color: "1e3a8a",
        font: "Calibri"
      })],
      spacing: { before: 400, after: 300 }
    })
  );

  reservesItems.forEach(item => {
    content.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: "➔ ", 
            size: 16,
            color: "374151",
            font: "Calibri"
          }),
          new TextRun({ 
            text: `${item.type} : ${item.description}`, 
            size: 16,
            color: "374151",
            font: "Calibri"
          })
        ],
        spacing: { after: 100 }
      })
    );
  });

  return content;
};

const page6Content = createDelaisAndReservesContent();

// Page 7: Conditions de réalisation
const page7Content = [
  new Paragraph({
    children: [new TextRun({ 
      text: "VI. Conditions de réalisation", 
      size: 24, 
      bold: true,
      color: "1e3a8a",
      font: "Calibri"
    })],
    spacing: { before: 200, after: 400 }
  }),
  
  // Basic conditions
  new Paragraph({
    children: [
      new TextRun({ text: "- ", size: 16, color: "374151", font: "Calibri" }),
      new TextRun({ text: "MOQ : ", size: 16, bold: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: moq, size: 16, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "- ", size: 16, color: "374151", font: "Calibri" }),
      new TextRun({ text: "Conditions de transport : ", size: 16, bold: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: transportConditions, size: 16, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "- ", size: 16, color: "374151", font: "Calibri" }),
      new TextRun({ text: "Contrôle en série : ", size: 16, bold: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: seriesControl, size: 16, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "- ", size: 16, color: "374151", font: "Calibri" }),
      new TextRun({ text: "Emballage : ", size: 16, bold: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: packaging, size: 16, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 300 }
  }),

  // Offer validity
  new Paragraph({
    children: [
      new TextRun({ text: "Validité de l'offre : ", size: 16, bold: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: offerValidity, size: 16, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 300 }
  }),

  // Payment conditions
  new Paragraph({
    children: [new TextRun({ 
      text: "Conditions de règlement :", 
      size: 18, 
      bold: true,
      color: "374151",
      font: "Calibri"
    })],
    spacing: { after: 200 }
  }),

  new Paragraph({
    children: [new TextRun({ 
      text: "Outillages :", 
      size: 16, 
      bold: true,
      color: "374151",
      font: "Calibri"
    })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "• ", size: 14, color: "374151", font: "Calibri" }),
      new TextRun({ text: toolingInvoicing, size: 14, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 50 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "• ", size: 14, color: "374151", font: "Calibri" }),
      new TextRun({ text: toolingBalance, size: 14, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 50 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "*", size: 14, italics: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: toolingDelay, size: 14, italics: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: "*", size: 14, italics: true, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 200 }
  }),

  new Paragraph({
    children: [new TextRun({ 
      text: "Pièces :", 
      size: 16, 
      bold: true,
      color: "374151",
      font: "Calibri"
    })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "• ", size: 14, color: "374151", font: "Calibri" }),
      new TextRun({ text: partsPayment, size: 14, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 50 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "• ", size: 14, color: "374151", font: "Calibri" }),
      new TextRun({ text: partsTransport, size: 14, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 200 }
  }),

  // General conditions
  new Paragraph({
    children: [
      new TextRun({ text: "Conditions générales : ", size: 14, bold: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: "nous exécutons les commandes, suivant les Conditions Générales de Vente de Somocap, en annexe", size: 14, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 300 }
  }),

  // Signature section
  new Paragraph({
    children: [new TextRun({ 
      text: "Signature :", 
      size: 16, 
      bold: true,
      color: "374151",
      font: "Calibri"
    })],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "Nom : ", size: 14, bold: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: signerName, size: 14, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 50 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: "Fonction : ", size: 14, bold: true, color: "374151", font: "Calibri" }),
      new TextRun({ text: signerRole, size: 14, color: "374151", font: "Calibri" })
    ],
    spacing: { after: 200 }
  }),

  // Legal text
  new Paragraph({
    children: [new TextRun({ 
      text: "La Société SOMOCAP se réserve la propriété des marchandises jusqu'au paiement de l'intégralité du prix et de toutes sommes s'y rattachant. Le transfert de propriété ne s'opère au profit de l'acheteur qu'après règlement de la dernière échéance. (Loi 80-355 du 12/05/1980)", 
      size: 12,
      italics: true,
      color: "6b7280",
      font: "Calibri"
    })],
    spacing: { before: 300, after: 200 },
    alignment: AlignmentType.JUSTIFY
  })
];

// Images page content
const imagesPageContent = [
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
      imagesPageContent.push(
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

      imagesPageContent.push(
        new Paragraph({
          children: [imageRun],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        })
      );
      
    } catch (error) {
      console.error(`Error processing image ${img.name}:`, error);
      imagesPageContent.push(
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
  imagesPageContent.push(
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
    // First page (no headers/footers)
    {
      children: firstPageContent,
      properties: {
        page: {
          pageNumbers: { start: 1, formatType: "decimal" }
        }
      },
      footers: footer ? {
        default: footer
      } : undefined
    },
    // Second page with header (table of contents)
    {
      headers: {
        default: createHeader()
      },
      footers: footer ? {
        default: footer
      } : undefined,
      children: secondPageContent,
      properties: {
        page: {
          pageNumbers: { start: 2, formatType: "decimal" }
        }
      }
    },
    // Page 3: Définition du besoin
    {
      headers: {
        default: createHeader()
      },
      footers: footer ? {
        default: footer
      } : undefined,
      children: page3Content,
      properties: {
        page: {
          pageNumbers: { start: 3, formatType: "decimal" }
        }
      }
    },
    // Page 4: Présentation offre technique
    {
      headers: {
        default: createHeader()
      },
      footers: footer ? {
        default: footer
      } : undefined,
      children: page4Content,
      properties: {
        page: {
          pageNumbers: { start: 4, formatType: "decimal" }
        }
      }
    },
    // Page 5: Conditions tarifaires
    {
      headers: {
        default: createHeader()
      },
      footers: footer ? {
        default: footer
      } : undefined,
      children: page5Content,
      properties: {
        page: {
          pageNumbers: { start: 5, formatType: "decimal" }
        }
      }
    },
    // Page 6: Délais Projet & Réserves
    {
      headers: {
        default: createHeader()
      },
      footers: footer ? {
        default: footer
      } : undefined,
      children: page6Content,
      properties: {
        page: {
          pageNumbers: { start: 6, formatType: "decimal" }
        }
      }
    },
    // Page 7: Conditions de réalisation
    {
      headers: {
        default: createHeader()
      },
      footers: footer ? {
        default: footer
      } : undefined,
      children: page7Content,
      properties: {
        page: {
          pageNumbers: { start: 7, formatType: "decimal" }
        }
      }
    },
    // Page 8: Images and annexes
    {
      headers: {
        default: createHeader()
      },
      footers: footer ? {
        default: footer
      } : undefined,
      children: imagesPageContent,
      properties: {
        page: {
          pageNumbers: { start: 8, formatType: "decimal" }
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