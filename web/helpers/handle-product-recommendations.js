import { Shopify } from "@shopify/shopify-api";
import * as https from "https";

export default async function handleProductRecommendations(body) {
  console.log("handle");
  //console.log(body);
  //console.log(JSON.parse(body));
  //const productId = JSON.parse(body).id;
  //const recommendationMetafield = JSON.parse(body).metafields.find(
  //  (mf) => mf.key === "recommendationhandles"
  //);
  //const recommendationHandles = recommendationMetafield.value;
  //console.log("Updated/Created Product Id: " + productId);
  //console.log(
  //  "recommendationhandles Metafield Value: " + recommendationHandles
  //);
  //const handleArray = recommendationHandles.split(",");
  //
  //handleArray.forEach((handle) => {
  //  console.log(handle);
  //});


  const path = `/admin/api/${Shopify.Context.API_VERSION}/graphql.json`;
  const data = `query {
    shop {
      name
      primaryDomain {
        url
        host
      }
    }
  }`;
  const host = process.env.HOST
    ? process.env.HOST.replace(/https?:\/\//, "")
    : "localhost";

  console.log("host: " + host);

  let options;
  if (host === "localhost") {
    options = {
      protocol: 'https:',
      hostname: "localhost",
      port: 64999,
      path: path,
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
      },
      //clientPort: 64999,
    };
  } else {
    options = {
      protocol: 'https:',
      hostname: host,
      port: process.env.FRONTEND_PORT,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_SECRET,
      },
      //clientPort: 443,
    };
  }


    const postBody = {
        "query": "query { shop { name primaryDomain { url host } } }"
      }
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                console.log(body)
                if (res.statusCode / 2 === 100 ) {
                    console.log('success')
                    resolve('Success');
                }
                else {
                    console.log('failed: ' + res.statusCode);
                    resolve('Failure');
                }
            });
            res.on('error', () => {
                console.log('error');
                reject(Error('HTTP call failed'));
            });
        });
        // The below 2 lines are most important part of the whole snippet.
        req.write(JSON.stringify(postBody));
        req.end();
    })
}
