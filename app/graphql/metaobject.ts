export const GET_MATERIALS_QUERY=`#graphql
  query GetMaterials{
    metaobjects(type:"material",first:10){
      edges{
        node{
          id
          handle
          fields{
            key
            value
            reference{
              ... on MediaImage{
                id
                image{
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
` as const;