import { useState, useEffect, useCallback } from "react";
import { Card, Badge } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery } from "../hooks";
import readAndModifyJsonlFile from "../../helpers/mutate-products";
import { useAuthenticatedFetch } from "../hooks";

//main dashboard component for current operation
export function ActionCard() {
  const fetch = useAuthenticatedFetch();
  const [isConverting, setIsConverting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bulkUrl, setBulkUrl] = useState("");
  const [bulkStatus, setBulkStatus] = useState("Unknown");
  const [bulkId, setBulkId] = useState("No current ID");
  const [error, setError] = useState(false);
  const [active, setActive] = useState(false);

  //toast component for error occurance
  const toggleError = useCallback(() => setError((error) => !error), []);
  const toastError = error ? (
    <Toast content="An unexpected error has occured. See console for details." error onDismiss={toggleError} />
  ) : null;

  //toast component for success
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Products updated successfully" onDismiss={toggleActive} />
  ) : null;

  //fetch current bulk operation status etc.
  const {
    data: bulkData,
    isLoading: isBulkLoading,
    refetch: bulkRefetch,
  } = useAppQuery({
    url: "/api/bulk/current",
  });

  //on component load, poll the bulk operation endpoint for a favorable response
  useEffect(() => {
    setIsLoading(true);
    const intervalId = setInterval(() => {
      try {
        //if the endpoint responds withat a bulk operation status of COMPLETED
        if (
          bulkData?.data?.body?.data?.currentBulkOperation?.status === "COMPLETED"
        ) {
          //set new states for completion
          setIsLoading(false);
          setBulkUrl(bulkData?.data?.body?.data?.currentBulkOperation?.url);
          setBulkStatus("Complete");
          setBulkId(bulkData?.data?.body?.data?.currentBulkOperation?.id);
          clearInterval(intervalId);
          //set new states for running and poll again
        } else {
          setBulkStatus("Running");
          setBulkId(bulkData?.data?.body?.data?.currentBulkOperation?.id);
          bulkRefetch();
        }
        //if the endpoint responds with no bulk operation, an error is caught and states are updated
      } catch (error) {
        setIsLoading(false);
        setBulkUrl("No current bulk operation found.");
        clearInterval(intervalId);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [bulkData]);

  //download the JSON file in browser for manual inspection
  //this came in handy for debugging
  const handleDownloadClick = () => {
    const url = bulkUrl;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  //handles the main action of the component
  const handleConvertClick = async () => {
    //udpate state
    setIsConverting(true)
    //takes the json file provided by the bulk operation
    //and converts the product handles to existings product IDs
    const products = await readAndModifyJsonlFile(bulkUrl);
    //then pushes the updated product recommendations
    try {
      for (const product of products) {
        const response = await fetch("/api/products/update", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: product,
        });
        console.log(response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (error) {
      toggleError();
      console.error("Error updating products:", error);
    }
    toggleActive();
    setIsConverting(false)
  };

  return (
    <>
      {toastMarkup}
      {toastError}
      
      <Card
        title="Current operation"
        sectioned
        primaryFooterAction={{
          content: "Convert and push changes",
          onAction: handleConvertClick,
          loading: isConverting,
          disabled: isLoading
        }}
        secondaryFooterActions={[
          {
            content: "Download JSON",
            onAction: handleDownloadClick,
            disabled: isLoading
          },
        ]}
      >
        <p>{bulkId}</p><br/>

        {bulkStatus === "Complete" ? (
          <Badge status="success">{bulkStatus}</Badge>
        ) : (
          <Badge>{bulkStatus}</Badge>
        )}
      </Card>
    </>
  );
}
