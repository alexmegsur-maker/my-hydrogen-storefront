import { createSchema } from "@weaverse/hydrogen";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

export default function Medidas(props:SectionProps){
  const {children, ...rest}=props
  return(
    <Section {...rest}>
      {children}
    </Section>
  )
}

export const schema= createSchema({
  type:"medidas",
  title:"medidas container",
  settings:sectionSettings,
  enabledOn:{
    groups:['*']
  },
  childTypes:[
    'subheading',
    'heading',
    'paragraph',
    'image-with-text',
    'group-elements'
  ],
  presets:{
    width: "stretch",
    verticalPadding: "small",
    children: [
      {
        type: "subheading",
        content: "Monarch Remaster · Medidas",
        alignment: "left"
      },
      {
        type: "heading",
        content: "Dos tallas, medidas al centímetro.",
        size: "custom",
        mobileSize: "2rem",
        desktopSize: "3.5rem",
        alignment: "left"
      },
      {
        type: "paragraph",
        content: "<p><span style=\"background-color: rgb(5, 5, 5); color: rgb(183, 185, 192);\">Elige R o XL para ver sus medidas, o compáralas. Pasa por una medida para localizarla en el dibujo.</span></p>",
        width: "full",
        alignment: "left"
        
      },
      {
        type: "group-elements",
        width: "full",
        gap: 0,
        verticalPadding: "custom",
        paddingSelect: "y",
        paddingText: "",
        marginSelect: "y",
        marginText: "2rem",
        showBorderBottom: true,
        gapCont: 0,
        mbDirection: "column",
        mbGapCont: 0,
        mbAlignContent: "center",
        children: [
          {
            type: "image-with-text--content",
            alignment: "center",
            widthDesktop: "100%",
            width: "full",
            verticalPadding: "none",
            children: [
              {
                type: "group-elements",
                width: "full",
                verticalPadding: "custom",
                paddingText: "1rem",
                showBorder: false,
                direction: "column",
                gapCont: 0,
                mbDirection: "column",
                mbGapCont: 0.5,
                children: [
                  {
                    type: "subheading",
                    alignment: "left",
                    marginText: "0rem"
                  },
                  {
                    type: "heading",
                    size: "custom",
                    mobileSize: "2rem",
                    desktopSize: "3rem",
                    alignment: "left",
                    marginText: "0.5rem"                    
                  }
                ]
              },
            ]
          },
          {
            type: "image-with-text--content",
            alignment: "center",
            widthDesktop: "100%",
            width: "full",
            verticalPadding: "none",
            children: [
              {
                type: "group-elements",
                width: "full",
                verticalPadding: "custom",
                paddingText: "1em",
                showBorder: false,
                showBorderLeft: true,
                showBorderRight: true,
                direction: "column",
                gapCont: 0,
                mbDirection: "column",
                mbGapCont: 0.5,
                children: [
                 
                  {
                    type: "subheading",
                    alignment: "left",
                    marginText: "0rem"
                  },
                  {
                    type: "heading",
                    size: "custom",
                    mobileSize: "2rem",
                    desktopSize: "3rem",
                    alignment: "left",
                    marginText: "0.5rem"
                  },
                ]              
              }
            ]
          },
          {
            type: "image-with-text--content",
            alignment: "center",
            widthDesktop: "100%",
            width: "full",
            verticalPadding: "none",
            children: [
              {
                type: "group-elements",
                width: "full",
                verticalPadding: "custom",
                paddingText: "1rem",
                marginSelect: "b",
                marginText: "",
                showBorder: false,
                direction: "column",
                gapCont: 0,
                mbDirection: "column",
                mbGapCont: 0.5,
                children: [
                  {
                    type: "subheading",
                    alignment: "left",
                    marginText: "0rem"
                  },
                  {
                    type: "heading",
                    size: "custom",
                    mobileSize: "2rem",
                    desktopSize: "3rem",
                    alignment: "left",
                    marginText: "0.5rem"
                  },
                ]
              },
            ]
          },
        ]
      },
      {
        type: "image-with-text",
        clName: "",
        width: "full",
        verticalPadding: "none",
        backgroundFor: "content",
        backgroundColor: "#00000000",
        contentDist: 52,
        gapCont: 2.5,
        children: [
          {
            type: "columns-with-posts--items",
            gap: 16,
            maxColumns: 2,
            widthContainer: 58,
            mbGap: 16,
            children: [
              {
                type: "column-with-post--item",
                  image: {
                    url: "https://cdn.shopify.com/s/files/1/0777/6370/7216/files/3410_jucavare_2.jpg?v=1793005340",
                    width: 1298,
                    height: 1732,
                    altText: "3410_jucavare_2.jpg"
                  },
                  size: "col1",
                  rowSize: "row1"
                
              },
              {
                type: "column-with-post--item",
                  image: {
                    url: "https://cdn.shopify.com/s/files/1/0777/6370/7216/files/silla.png?v=1792487614",
                    width: 1080,
                    height: 1350,
                    altText: ""
                  },
                  size: "col1",
                  rowSize: "row1",
                
              },
            ]
          },
         
          {
            type: "image-with-text--content",
            alignment: "center",
            widthDesktop: "100%",
            width: "full",
            verticalPadding: "none",
            children: [
              {
                type: "group-elements",
                width: "full",
                verticalPadding: "none",
                showBorder: false,
                enableMaxHeight: true,
                maxHeight: "80vh",
                displayDiv: "grid",
                columnsGrid: 1,
                mbDisplayDiv: "grid",
                mbDirection: "column",
                mbColumnsGrid: 1,
                mbGapCont: 0,
                mbAlignContent: "center",
                children: [
                
                  {
                    type: "simple-table",
                    
                      clName: "",
                      width: "full",
                      gap: 8,
                    verticalPadding: "none",
                   
                    children: [
                      {
                        type: "cookie-table-row",
                        
                        rowType: "head",
                        showBorderBottom: false,
                        borderColor: "rgba(255,255,255,0.1)",
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p><br></p>",
                            cellType: "th",
                            colSpan: "9",
                            color: "#ffa637"                            
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>Talla r</p>",
                            cellType: "th",
                            colSpan: "3",
                            color: "#ffa637",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>Talla xl</p>",
                            cellType: "th",
                            colSpan: "3",
                            color: "#ffa637",
                            alignment: "right"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        rowType: "head",
                        borderColor: "rgba(255,255,255,0.1)",
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>PARA QUIEN</p>",
                            cellType: "th",
                            color: "#ffa637"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>A</p>",
                            colSpan: "1",
                            color: "#FFFFFF",
                            fontWeight: "500",
                            alignment: "center",
                            padding: "1.5rem 0 0 0"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p><strong style=\"color: rgb(255, 255, 255);\">Altura del usuario</strong></p><p>Recomendada</p>",
                            colSpan: "8"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            color: "#22c55e",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            alignment: "right"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        showBorderBottom: false,
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>A</p>",
                            colSpan: "1",
                            color: "#FFFFFF",
                            fontWeight: "500",
                            alignment: "center",
                            padding: "1.5rem 0 0 0"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p><strong style=\"color: rgb(255, 255, 255);\">Altura del usuario</strong></p><p>Recomendada</p>",
                            colSpan: "8"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            color: "#22c55e",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            alignment: "right"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        rowType: "head",
                        borderColor: "rgba(255,255,255,0.1)",
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>PARA QUIEN</p>",
                            cellType: "th",
                            color: "#ffa637"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>A</p>",
                            colSpan: "1",
                            color: "#FFFFFF",
                            fontWeight: "500",
                            alignment: "center",
                            padding: "1.5rem 0 0 0"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p><strong style=\"color: rgb(255, 255, 255);\">Altura del usuario</strong></p><p>Recomendada</p>",
                            colSpan: "8"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            color: "#22c55e",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            alignment: "right"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        showBorderBottom: false,
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>A</p>",
                            colSpan: "1",
                            color: "#FFFFFF",
                            fontWeight: "500",
                            alignment: "center",
                            padding: "1.5rem 0 0 0"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p><strong style=\"color: rgb(255, 255, 255);\">Altura del usuario</strong></p><p>Recomendada</p>",
                            colSpan: "8"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            color: "#22c55e",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            alignment: "right"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        rowType: "head",
                        borderColor: "rgba(255,255,255,0.1)",
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>PARA QUIEN</p>",
                            cellType: "th",
                            color: "#ffa637"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>A</p>",
                            colSpan: "1",
                            color: "#FFFFFF",
                            fontWeight: "500",
                            alignment: "center",
                            padding: "1.5rem 0 0 0"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p><strong style=\"color: rgb(255, 255, 255);\">Altura del usuario</strong></p><p>Recomendada</p>",
                            colSpan: "8"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            color: "#22c55e",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            alignment: "right"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        showBorderBottom: false,
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>A</p>",
                            colSpan: "1",
                            color: "#FFFFFF",
                            fontWeight: "500",
                            alignment: "center",
                            padding: "1.5rem 0 0 0"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p><strong style=\"color: rgb(255, 255, 255);\">Altura del usuario</strong></p><p>Recomendada</p>",
                            colSpan: "8"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            color: "#22c55e",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            alignment: "right"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        rowType: "head",
                        borderColor: "rgba(255,255,255,0.1)",
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>PARA QUIEN</p>",
                            cellType: "th",
                            color: "#ffa637"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>A</p>",
                            colSpan: "1",
                            color: "#FFFFFF",
                            fontWeight: "500",
                            alignment: "center",
                            padding: "1.5rem 0 0 0"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p><strong style=\"color: rgb(255, 255, 255);\">Altura del usuario</strong></p><p>Recomendada</p>",
                            colSpan: "8"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            color: "#22c55e",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            alignment: "right"
                          },
                        ]
                      },
                      {
                        type: "cookie-table-row",
                        showBorderBottom: false,
                        enableGrid: true,
                        numColumns: 15,
                        children: [
                          {
                            type: "cookie-table-cell",
                            content: "<p>A</p>",
                            colSpan: "1",
                            color: "#FFFFFF",
                            fontWeight: "500",
                            alignment: "center",
                            padding: "1.5rem 0 0 0"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p><strong style=\"color: rgb(255, 255, 255);\">Altura del usuario</strong></p><p>Recomendada</p>",
                            colSpan: "8"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            color: "#22c55e",
                            alignment: "right"
                          },
                          {
                            type: "cookie-table-cell",
                            content: "<p>[x,xx-x,xx] cm</p>",
                            colSpan: "3",
                            alignment: "right"
                          },
                        ]
                      },
                    ]
                  },
                ]
              },
            ]
          },
        ]
      },
    ]
  }
}) 