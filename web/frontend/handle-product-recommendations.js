//import { useAuthenticatedFetch } from "./hooks";

export default async function handleProductRecommendations(body) {
    //const fetch = useAuthenticatedFetch();
    console.log("handle");
    console.log(body);
    console.log(JSON.parse(body));
    const productId = JSON.parse(body).id;
    console.log(productId);

    const response = await fetch("/api/products/fetch/recommendations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productId),
      });
    
    console.log("response: " + response);

}