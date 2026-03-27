export const GET_VARIANT_OPTIONS = `#graphql
  query GetVariantsOptions ($handle:String!) {
    metaobjects(type: $handle, first: 10) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            # Para campos de referencia UNICA (como 'guia')
            reference {
              ... on Metaobject {
                id
                handle
                fields {
                  key
                  value
                  imagenes:references(first:10){
                    edges{
                      node{
                        ... on MediaImage {
                          id
                          image {
                            url
                            altText
                          }
                        }
                        
                      }
                    }
                  }
                  metaobjetos:references(first:10){
                    edges{
                      node{
                        ... on Metaobject{
                          id
                          handle
                          fields {
                            key
                            value
                          }
                        }
                        
                      }
                    }
                  }
                }
              }
            }
            # Para campos de LISTA de referencias (como 'material' o 'imagenes')
            references(first: 10) {
              edges {
                node {
                  ... on Metaobject {
                    id
                    handle
                    fields {
                      key
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
` as const;