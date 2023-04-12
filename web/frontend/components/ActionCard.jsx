import { useState, useEffect, useCallback } from "react";
import { Card, Badge } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery } from "../hooks";
import readAndModifyJsonlFile from "../../helpers/mutate-products";
import { useAuthenticatedFetch } from "../hooks";

export function ActionCard() {
  const fetch = useAuthenticatedFetch();
  const [showNewOperation, setShowNewOperation] = useState(false);
  const [showCurrentOperation, setShowCurrentOperation] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [isConverting, setIsConverting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [convertStatus, setConvertStatus] = useState(false)
  const [bulkUrl, setBulkUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const toggleError = useCallback(() => setError((error) => !error), []);
  const toastError = error ? (
    <Toast content="An unexpected error occured. Shopify may have provided the wrong document." error onDismiss={toggleError} />
  ) : null;
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Products updated successfully" onDismiss={toggleActive} />
  ) : null;
  const {
    data: bulkData,
    isLoading: isBulkLoading,
    refetch: bulkRefetch,
  } = useAppQuery({
    url: "/api/bulk/current",
  });

  useEffect(() => {
    setIsLoading(true);
    const intervalId = setInterval(() => {
      setBulkStatus("COMPLETED");
      if (
        bulkData?.data?.body?.data?.currentBulkOperation?.status === "COMPLETED"
      ) {
        setBulkStatus("COMPLETED");
        setIsLoading(false);
        setBulkUrl(bulkData?.data?.body?.data?.currentBulkOperation?.url);
        clearInterval(intervalId);
      } else {
        bulkRefetch();
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [bulkData]);

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

  const handleConvertClick = async () => {
    setConvertStatus(false);
    setIsConverting(true)
    const products = await readAndModifyJsonlFile(bulkUrl);
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (error) {
      toggleError();
      console.error("Error updating products:", error);
    }
    setSuccess(true);
    toggleActive();
    setIsConverting(false)
    setConvertStatus(true);
  };
  
  const onUpdate = async () => {
  
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
        <p>{bulkData?.data?.body?.data?.currentBulkOperation?.id}</p><br/>
        <Badge>{bulkData?.data?.body?.data?.currentBulkOperation?.status}</Badge>
      </Card>
    </>
  );
}
