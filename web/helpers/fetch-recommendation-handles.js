import { Shopify } from "@shopify/shopify-api";

const FETCH_ID_QUERY = `query ($handle : String!) {
    productByHandle(handle: $handle) {
      id
    }
  }
`;

const formatGqlResponse = (res) => {
  const edges = res?.body?.data || [];

  if (!edges.length) return [];

  return edges.map(({ node }) => ({
    id: node.product.id,
  }));
};

export default async function fetchIdFromHandle(session, body) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  const handle = JSON.parse(body);

  try {
    const res = await client.query({
      data: {
        query: FETCH_ID_QUERY,
        variables: {
            handle: handle,
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
