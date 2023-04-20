import { useState, useCallback, useEffect } from "react";
import { Card, TextField, Stack, Button } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";

//dashboard component for converting MPNs
export function ConvertCard() {
  const [brand, setBrand] = useState("");
  const [mpn, setMpn] = useState("");
  const [result, setResult] = useState("");
  const [active, setActive] = useState(false);

  //toast component for success
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Result copied to clipboard" onDismiss={toggleActive} />
  ) : null;

  const brandChange = useCallback((newBrand) => setBrand(newBrand), []);

  const mpnChange = useCallback((newMpn) => setMpn(newMpn), []);

  const replaceSpecialCharactersAndSpaces = (str) => {
    return str.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  };

  const removeSpecialCharactersAndSpaces = (str) => {
    return str.replace(/[^a-z0-9-]+/gi, '').toLowerCase();
  };

  const concatenateStrings = (brand, mpn) => {
    const sanitizedStr = removeSpecialCharactersAndSpaces(mpn);
    const combinedStr = `${brand}-${sanitizedStr}`;
    const dashedStr = replaceSpecialCharactersAndSpaces(combinedStr);
    return dashedStr;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toggleActive();
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  useEffect(() => {
    // Update the result value based on the new brand and mpn values.
    // You can modify the logic inside this function according to your requirements.
    setResult(concatenateStrings(brand, mpn));
  }, [brand, mpn]);

  return (
    <>
    {toastMarkup}
      <Card title="Convert MPN" sectioned>
        <Stack vertical>
        <Stack distribution="fillEvenly">
          <TextField
            label="Brand name"
            value={brand}
            onChange={brandChange}
            autoComplete="off"
          />
          <TextField
            label="Manufacturer product number"
            value={mpn}
            onChange={mpnChange}
            autoComplete="off"
          />
          <TextField
            label="Result"
            disabled
            value={result}
            autoComplete="off"
            labelAction={{content: 'Copy to clipboard', onAction: copyToClipboard}}
          />
        </Stack>
        <p>
          Place this value in the recommendationHandle metafield of the product
          that it belongs to, and add it to the relatedHandles or
          complementaryHandles metafield of any product you'd like it to show up
          beneath. Once you've updated those fields, re-fetch and bulk update
          products above.
        </p>
        </Stack>
      </Card>
    </>
  );
}
