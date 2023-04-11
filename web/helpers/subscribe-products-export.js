import { Shopify } from "@shopify/shopify-api";

const SUBCRIBE_PRODUCTS_EXPORT_QUERY = `mutation ($url: URL!) {
    webhookSubscriptionCreate(
        topic: BULK_OPERATIONS_FINISH
        webhookSubscription: {
          format: JSON,
          callbackUrl: $url}
      ) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
`;

const formatGqlResponse = (res) => {

  console.log("response: ", res)

  if (res?.body?.data?.webhookSubscriptionCreate.webhookSubscription) {
    return res?.body?.data?.webhookSubscriptionCreate.webhookSubscription.id;
  } else {
    return
  }
  
};

export default async function subscribeProductsExport(session, callbackUrl) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  try {
    const res = await client.query({
      data: {
        query: SUBCRIBE_PRODUCTS_EXPORT_QUERY,
        variables: {
            url: callbackUrl,
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
