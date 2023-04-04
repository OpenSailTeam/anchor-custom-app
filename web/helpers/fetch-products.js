import { Shopify } from "@shopify/shopify-api";

const FETCH_PRODUCTS_QUERY = `{
  products(first: 10, reverse: true) {
    edges {
      node {
        id
        description
        title
        legacyResourceId
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              price
              title
            }
          }
        }
      }
    }
  }
}
`;

const formatGqlResponse = (res) => {
  const edges = res?.body?.data?.products?.edges || [];

  if (!edges.length) return [];

  return edges.map(({ node }) => ({
    id: node.id,
    legacyId: node.legacyResourceId,
    title: node.title,
    description: node.description,
    image:
      node.images.edges[0]?.node?.url ||
      "", // add empty image link here
    variants: node.variants.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      price: node.price,
    })),
  }));
};

export default async function fetchProducts(session) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  try {
    const bulkOperation = await client.bulkOperationRunQuery({
      data: {
        query: FETCH_PRODUCTS_QUERY,
      },
    });

    const operationId = bulkOperation.id;

    // Wait until the operation is complete
    const { status, errorCode, resultUrl } = await client.bulkOperationGet(operationId);

    while (status !== "COMPLETED") {
      if (status === "FAILED") {
        throw new Error(`Bulk operation failed with error code ${errorCode}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
      const operation = await client.bulkOperationGet(operationId);
      status = operation.status;
      errorCode = operation.errorCode;
      resultUrl = operation.resultUrl;
    }

    // Download the result
    const result = await client.bulkOperationFetch(resultUrl);

    return formatGqlResponse(result);
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
