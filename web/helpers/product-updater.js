import { Shopify } from "@shopify/shopify-api";

const UPDATE_PRODUCT_MUTATION = `
mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      key
      value
      namespace
    }
    userErrors {
      field
      message
    }
  }
}
`;

export default async function productUpdater(session, productData) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);



  try {
    await client.query({
      data: {
        query: UPDATE_PRODUCT_MUTATION,
        variables: {
          metafields: [
            {
              key: "complementary_products",
              value: productData.complementaryHandles ? (JSON.stringify(productData.complementaryHandles.value.split(","))) : (""),
              type: "list.product_reference",
              namespace: "shopify--discovery--product_recommendation",
              ownerId: productData.id
            },
            {
              key: "related_products",
              value: productData.relatedHandles ? (JSON.stringify(productData.relatedHandles.value.split(","))) : (""),
              type: "list.product_reference",
              namespace: "shopify--discovery--product_recommendation",
              ownerId: productData.id
            }
          ]
        },
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
