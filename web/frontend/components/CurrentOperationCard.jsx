import {
  Button,
  Card,
  Collapsible,
  FormLayout,
  Stack,
  TextField,
  EmptyState,
  Layout,
  Spinner,
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { Variants } from "./Variants";
import { useNavigate, Toast } from "@shopify/app-bridge-react";
import { useAppQuery } from "../hooks";

export const CurrentOperationCard = () => {
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkUrl, setBulkUrl] = useState("");
  const { data: bulkData, isLoading: isBulkLoading, refetch: bulkRefetch } = useAppQuery({
    url: "/api/bulk/current",
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (bulkData?.data?.body?.data?.currentBulkOperation?.status === "COMPLETED") {
        setBulkStatus("COMPLETED");
        setBulkUrl(bulkData?.data?.body?.data?.currentBulkOperation?.url);
        console.log("Finished")
        clearInterval(intervalId);
      } else {
        console.log("In progress...");
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

  const handleConvertClick = () => {
    
  };

  return (
    <>
      {bulkData?.data?.body?.data?.currentBulkOperation?.id ? (
        <Card
          sectioned
        >
          <p>
            Status of {bulkData?.data?.body?.data?.currentBulkOperation?.id} is {bulkData?.data?.body?.data?.currentBulkOperation?.status}
          </p>
          {bulkStatus === "COMPLETED" ? (
            <>
            <Button onClick={handleDownloadClick}>Download JSON</Button>
            <Button onClick={handleConvertClick}>Convert products</Button>
            </>
          
          ) : (
          <></>
          )}
        </Card>
      ) : (
        <Card sectioned>
          <p>Pinging current bulk operation...</p>
        </Card>
      )}
    </>
  );
};
