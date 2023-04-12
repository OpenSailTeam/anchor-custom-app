import { useState, useEffect } from "react";
import { Card, Layout } from "@shopify/polaris";
import { Toast, useNavigate } from "@shopify/app-bridge-react";
import { NewOperationCard } from "./NewOperationCard";
import { CurrentOperationCard } from "./CurrentOperationCard";
import { useAppQuery } from "../hooks";


export function ActionCard() {
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [showNewOperation, setShowNewOperation] = useState(false);
  const [showCurrentOperation, setShowCurrentOperation] = useState(false);
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

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handleNewBulkFetch = () => {
    setShowNewOperation(true);
  }

  const handleCurrentBulkFetch = () => {
    setShowCurrentOperation(true);
  }



  return (
    <>
      {toastMarkup}
      
      <Card
        title="Operations list"
        sectioned
        primaryFooterAction={{
          content: "New bulk fetch",
          onAction: handleNewBulkFetch,
        }}
        secondaryFooterActions={[
          {
            content: "Check current status",
            onAction: handleCurrentBulkFetch,
          },
        ]}
      >
        <p>
              Status of {bulkData?.data?.body?.data?.currentBulkOperation?.id} is{" "}
              {bulkData?.data?.body?.data?.currentBulkOperation?.status}
            </p>
      </Card>
    </>
  );
}
