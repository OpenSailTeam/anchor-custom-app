import { useState } from "react";
import { Card, TextContainer } from "@shopify/polaris";
import { Toast, useNavigate } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { NewOperationCard } from "./NewOperationCard";
import { CurrentOperationCard } from "./CurrentOperationCard";
import { Layout } from "@shopify/polaris";


export function ActionCard() {
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [showNewOperation, setShowNewOperation] = useState(false);
  const [showCurrentOperation, setShowCurrentOperation] = useState(false);

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
        title="Bulk Fetch"
        sectioned
        primaryFooterAction={{
          content: "New bulk fetch",
          onAction: handleNewBulkFetch,
          //loading: isLoading,
        }}
        secondaryFooterActions={[
          {
            content: "Check current status",
            onAction: handleCurrentBulkFetch,
          },
        ]}
      >
        {showNewOperation ? (
          <Card>
            <NewOperationCard></NewOperationCard>
          </Card>
      ) : (
        <Card>
            <Layout><p>No new fetch operation</p></Layout>
        </Card>
      )}
        {showCurrentOperation ? (
          <Card>
            <CurrentOperationCard></CurrentOperationCard>
          </Card>
      ) : (
        <Card>
            <Layout><p>No current fetch operation</p></Layout>
        </Card>
      )}
      </Card>
    </>
  );
}
