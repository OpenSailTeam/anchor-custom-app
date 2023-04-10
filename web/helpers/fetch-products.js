import { Shopify } from "@shopify/shopify-api";

const FETCH_PRODUCTS_QUERY = `mutation {
  bulkOperationRunQuery(
   query: """
   {
    products {
      edges {
        node {
          id
          metafield (namespace: "custom" key: "recommendationHandles") {
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

const formatGqlResponse = (res) => {

  return res;
};

export default async function fetchProducts(session) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  try {
    const res = await client.query({
      data: {
        query: FETCH_PRODUCTS_QUERY,
      },
    });

    return formatGqlResponse(res);
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
