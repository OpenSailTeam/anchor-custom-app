export default async function readAndModifyJsonlFile(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.trim().split("\n");

    // Step 1: Convert each line to a JSON object and create a map/dictionary
    const idMap = {};
    lines.forEach((line) => {
      const product = JSON.parse(line);
      idMap[product.handle.value] = product.id;
    });

    // Step 2: Loop through each line and update the relatedHandles and complementaryHandles fields
    const updatedLines = lines.map((line) => {
      const product = JSON.parse(line);
      const relatedHandles = product.relatedHandles.value.split(",");
      const updatedRelatedHandles = relatedHandles.map((handle) => {
        return idMap[handle];
      });
      product.relatedHandles.value = updatedRelatedHandles.join(",");
      const complementaryHandles = product.complementaryHandles.value.split(",");
      const updatedComplementaryHandles = complementaryHandles.map((handle) => {
        return idMap[handle];
      });
      product.complementaryHandles.value = updatedComplementaryHandles.join(",");
      return JSON.stringify(product);
    });

    return updatedLines;

  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}
