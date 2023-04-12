import { Shopify } from "@shopify/shopify-api";

const FETCH_PRODUCTS_QUERY = `mutation {
  bulkOperationRunQuery(
   query: """
   {
    products {
      edges {
        node {
          id
          handle: metafield (namespace: "custom" key: "MPNHandle") {
            value
          }
          relatedHandles: metafield (namespace: "custom" key: "recommendationHandles") {
            value
          }
          complementaryHandles: metafield (namespace: "custom" key: "complementaryHandles") {
            value
          }
        }
      }
    }
  }
    """
  ) {
    bulkOperation {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}
`;

export default async function fetchProducts(session) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  try {
    await client.query({
      data: {
        query: FETCH_PRODUCTS_QUERY,
      },
    });
  } catch (error) {
    if (error instanceof Shopify.Errors.GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
