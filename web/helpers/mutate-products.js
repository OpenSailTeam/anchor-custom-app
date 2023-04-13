export default async function readAndModifyJsonlFile(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.trim().split("\n");

    //convert each line to a JSON object and create a map/dictionary
    const idMap = {};
    lines.forEach((line) => {
      const product = JSON.parse(line);
      idMap[product.handle.value] = product.id;
    });

    //loop through each line and update the relatedHandles and complementaryHandles fields
    const updatedLines = lines.map((line) => {
      const product = JSON.parse(line);
      console.log("product start", product);
      console.log("");

      const relatedHandles = product.relatedHandles.value.split(",");
      console.log("relatedHandles", relatedHandles);
      const updatedRelatedHandles = relatedHandles.map((handle) => {
        return idMap[handle];
      });
      console.log("updatedRelatedHandles", updatedRelatedHandles);
      product.relatedHandles.value = updatedRelatedHandles.join(",");
      console.log("");

      const complementaryHandles = product.complementaryHandles.value.split(",");
      console.log("complementaryHandles", complementaryHandles);
      const updatedComplementaryHandles = complementaryHandles.map((handle) => {
        return idMap[handle];
      });
      console.log("updatedComplementaryHandles", updatedComplementaryHandles);
      product.complementaryHandles.value = updatedComplementaryHandles.join(",");
      console.log("");

      console.log("product end", product);
      console.log("");
      console.log("");
      return JSON.stringify(product);
    });

    return updatedLines;

  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}
