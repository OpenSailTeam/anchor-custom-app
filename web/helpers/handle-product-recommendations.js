export default async function handleProductRecommendations(body) {
    //console.log("handle");
    //console.log(body);
    //console.log(JSON.parse(body));
    const productId = JSON.parse(body).id;
    const recommendationMetafield = JSON.parse(body).metafields.find(mf => mf.key === 'recommendationhandles');
    const recommendationHandles = recommendationMetafield.value;
    console.log("Updated/Created Product Id: " + productId);
    console.log("recommendationhandles Metafield Value: " + recommendationHandles);

    return recommendationHandles.split(",");
}