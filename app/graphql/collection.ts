import { MEDIA_FRAGMENT } from "./fragments";

export const COLLECTION_BY_IDS_SECRET_QUERY = `#graphql
  query CollectionsByIdslist($ids:[ID!]!){
    nodes(ids: $ids){
      ... on Collection{
        id
        handle
        title
        description
        image{
          altText
          url      
        }
        filtro:metafield(namespace:"custom",key:"filtro"){
          id
          value
        }
        products(first:20){
          edges{
            node{
              id
              title
              handle
              description
              availableForSale
              options(first:5){
                id
                name
                optionValues{
                  id
                  name
                }
              }
              featuredImage{
                altText
                url
              }
              logoMetafield:metafield(namespace:"custom",key:"logo") {
                key
                value
                reference{
                  ... on Media{
                    previewImage{
                      altText  
                      url
                    } 
                  }
                }
              }
              imagenes360:metafield(namespace:"custom",key:"imagen360") {
                key
                value
                references(first:50){
                  nodes{
                    ... on Media{
                      previewImage{
                        altText  
                        url
                      }
                    }
                  }
                }
              }
              videosMetafield:metafield(namespace:"custom",key:"videos"){
                id
                type
                references(first:2){
                  nodes{
                    ... on Video{
                      id
                      alt
                      sources{
                        url
                      }
                    }
                  }
                }
              }
              pageMetafield:metafield(namespace:"custom",key:"page"){
                id
                type
                value
                reference{
                  ... on Page{
                    id
                    title
                    body
                    onlineStoreUrl
                  }
                }
              }
              
              nombre:metafield(namespace:"custom",key:"name_style_secret"){
                id  
                value
              }
              tooltip:metafield(namespace:"custom",key:"tooltip"){
                id
                value
              }
              media(first: 50) {
                nodes {
                  ...Media
                }
              }
              material:metafield(namespace:"custom",key:"material") {
                key
                type
                value
              }
              variants(first:10){
                edges{
                  node{
                    id
                    title
                    availableForSale
                    sku
                    quantityAvailable
                    selectedOptions{
                      name
                      value
                    }
                    price{
                      amount
                      currencyCode
                    }
                    compareAtPrice{
                      amount
                      currencyCode
                    }
                    tooltip:metafield(namespace:"custom",key:"tooltip"){
                      id
                      value
                    }
                    fechaReserva:metafield(namespace:"custom",key:"fecha_reserva"){
                      id
                      value
                    }
                    totalReserva:metafield(namespace:"custom",key:"preventa_total"){
                      id
                      value
                    }
                    pedidosReserva:metafield(namespace:"custom",key:"preventa_pedidos"){
                      id
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
` as const 