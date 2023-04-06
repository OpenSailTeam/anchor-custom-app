import { Shopify } from "@shopify/shopify-api";

export default async function handleProductRecommendations(body) {
  const fetch = useAuthenticatedFetch();
  //console.log("handle");
  //console.log(body);
  //console.log(JSON.parse(body));
  const productId = JSON.parse(body).id;
  const recommendationMetafield = JSON.parse(body).metafields.find(
    (mf) => mf.key === "recommendationhandles"
  );
  const recommendationHandles = recommendationMetafield.value;
  console.log("Updated/Created Product Id: " + productId);
  console.log(
    "recommendationhandles Metafield Value: " + recommendationHandles
  );
  const handleArray = recommendationHandles.split(",");

  const storeName = "anchor-managed-solutions";

  handleArray.forEach((handle) => {
    console.log(handle)
  });

  return;
}
