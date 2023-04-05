import { Shopify } from "@shopify/shopify-api";

const FETCH_RECOMMENDATIONS_QUERY = `query ($id : ID!) {
    product(id: $id) {
      handle
      metafield(namespace: "custom", key: "recommendationHandles") {
        value
      }
    }
  }
`;

const formatGqlResponse = (res) => {
  const edges = res?.body?.data || [];

  if (!edges.length) return [];

  return edges.map(({ node }) => ({
    handle: node.product.handle,
  }));
};

export default async function fetchRecommendations(session, body) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  const productId = JSON.parse(body);

  try {
    const res = await client.query({
      data: {
        query: FETCH_RECOMMENDATIONS_QUERY,
        variables: {
            id: productId,
        }
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
