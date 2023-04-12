import { useState } from "react";
import { Card, Layout } from "@shopify/polaris";
import { Toast, useNavigate } from "@shopify/app-bridge-react";
import { NewOperationCard } from "./NewOperationCard";
import { CurrentOperationCard } from "./CurrentOperationCard";


export function ActionCard() {
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
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
        {showNewOperation ? (
          <Card>
            <NewOperationCard></NewOperationCard>
          </Card>
      ) : (

            <></>

      )}
        {showCurrentOperation ? (
          <Card>
            <CurrentOperationCard></CurrentOperationCard>
          </Card>
      ) : (

            <></>

      )}
      </Card>
    </>
  );
}
