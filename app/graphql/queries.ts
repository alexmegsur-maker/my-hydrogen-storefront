import { MEDIA_FRAGMENT, PRODUCT_OPTION_FRAGMENT } from "~/graphql/fragments";

export const PRODUCT_QUERY = `#graphql
  query product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      publishedAt
      descriptionHtml
      description
      summary: description(truncateAt: 200)
      encodedVariantExistence
      encodedVariantAvailability
      tags
      featuredImage {
        id
        url
        altText
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      badges: metafields(identifiers: [
        { namespace: "custom", key: "best_seller" }
      ]) {
        key
        namespace
        value
      }
      options {
        ...ProductOption
      }
      selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariant
      }
      variants(first:1){
        nodes{
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
        }
      }
      adjacentVariants(selectedOptions: $selectedOptions) {
        ...ProductVariant
      }
      # Check if the product is a bundle
      isBundle: selectedOrFirstAvailableVariant(ignoreUnknownOptions: true, selectedOptions: { name: "", value: ""}) {
        ...on ProductVariant {
          requiresComponents
          components(first: 100) {
             nodes {
                productVariant {
                  ...ProductVariant
                }
                quantity
             }
          }
          groupedBy(first: 100) {
            nodes {
                id
              }
            }
          }
      }
      media(first: 50) {
        nodes {
          ...Media
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_OPTION_FRAGMENT}
` as const;

export const MEDIA_QUERY = `#graphql
  query MediaImagesByIds($ids:[ID!]!){
    nodes(ids:$ids){
      ... on MediaImage{
        id
        mediaContentType
        image{
          url
          altText
          width
          height
        }
        previewImage{
          url
          altText
        }
      }
    }
  }
` as const 

export const MEDIA_QUERY_BY_ID = `#graphql
  query MediaImagesById($id:ID!){
    node(id:$id){
      ... on MediaImage{
        id
        mediaContentType
        image{
          url
          altText
          width
          height
        }
        previewImage{
          url
          altText
        }
      }
    }
  }
` as const 

export const PAGE_QUERY_BY_ID = `#graphql
  query PageById($id:ID!){
    node(id:$id){
      ... on Page{
        id
        body
      }
    }
  }
` as const 