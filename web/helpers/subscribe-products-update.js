import { Shopify } from "@shopify/shopify-api";

const SUBCRIBE_PRODUCTS_UPDATE_QUERY = `mutation ($url: URL!) {
    webhookSubscriptionCreate(
      topic: PRODUCTS_UPDATE
      webhookSubscription: {
        callbackUrl: $url
        format: JSON
        metafieldNamespaces: "custom"
    })
    {
      webhookSubscription {
        id
      }
      userErrors {
        message
      }
    }
  }
`;

const formatGqlResponse = (res) => {
  const edges = res?.body?.data?.products?.edges || [];

  if (!edges.length) return [];

  console.log("LOG: " + node.webhookSubscription.id);

  return node.webhookSubscription.id;
  
};

export default async function subscribeProductsUpdate(session, callbackUrl) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  try {
    const res = await client.query({
      data: {
        query: SUBCRIBE_PRODUCTS_UPDATE_QUERY,
        variables: {
            url: callbackUrl
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
