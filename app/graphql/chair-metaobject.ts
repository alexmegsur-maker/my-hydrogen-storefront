export const CHAIR_METAOBJECT_QUERY = `#graphql
  query ChairSection($handle: String!) {
    metaobject(handle: { handle: $handle, type: "scroll_chair" }) {
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
        references(first: 50) {
          nodes {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;