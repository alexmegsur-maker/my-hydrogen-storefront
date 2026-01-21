export const COLLECTION_BY_IDS_QUERY = `#graphql
  query CollectionsByIds($ids:[ID!]!){
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
        products(first:20){
          edges{
            node{
              id
              title
              availableForSale
              featuredImage{
                altText
                url
              }
              variants(first:1){
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
                    nombre:metafield(namespace:"custom",key:"name_style_secret"){
                      id  
                      value
                    }
                    tooltip:metafield(namespace:"custom",key:"tooltip"){
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
` as const 