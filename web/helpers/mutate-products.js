export default async function readAndModifyJsonlFile(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.trim().split("\n");

    //convert each line to a JSON object and create a map/dictionary
    const idMap = {};
    const missingRelated = {};
    const missingComplementary = {};

    lines.forEach((line) => {
      const product = JSON.parse(line);
      if (product.handle) {
        idMap[product.handle.value] = product.id;
      }
    });

    //loop through each line and update the relatedHandles and complementaryHandles fields
    const updatedLines = lines.map((line) => {
      const product = JSON.parse(line);

      if (product.relatedHandles) {
        const relatedHandles = product.relatedHandles.value.split(",");
        const updatedRelatedHandles = relatedHandles.reduce((accumulator, handle) => {
          if (idMap[handle]) {
            accumulator.push(idMap[handle]);
          } else {
            if (!missingRelated[product.handle.value]) {
              missingRelated[product.handle.value] = [];
            }
            missingRelated[product.handle.value].push(handle);
          }
          return accumulator;
        }, []);
        product.relatedHandles.value = updatedRelatedHandles.join(",");
      }

      if (product.complementaryHandles) {
        const complementaryHandles = product.complementaryHandles.value.split(",");
        const updatedComplementaryHandles = complementaryHandles.reduce((accumulator, handle) => {
          if (idMap[handle]) {
            accumulator.push(idMap[handle]);
          } else {
            if (!missingComplementary[product.handle.value]) {
              missingComplementary[product.handle.value] = [];
            }
            missingComplementary[product.handle.value].push(handle);
          }
          return accumulator;
        }, []);
        product.complementaryHandles.value = updatedComplementaryHandles.join(",");
      }

      return JSON.stringify(product);
    });

    console.log("Missing related: ", missingRelated);
    console.log("Missing complementary: ", missingComplementary);

    return updatedLines;

  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}
