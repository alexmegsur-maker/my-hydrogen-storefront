export const RESERVA_QUERY = `#graphql
  query product(
    $handle: String!
  ){
    product(handle: $handle) {
      
      total:metafield(namespace:"custom",key:"preventa_total"){
        id
        value
      }
      vendido:metafield(namespace:"custom",key:"preventa_pedidos"){
        id
        value
      }
      fecha:metafield(namespace:"custom",key:"fecha_recepcion"){
        id
        value
      }
    }
    
  }
` as const;


