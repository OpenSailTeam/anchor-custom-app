import {
  Card,
} from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const NewOperationCard = () => {
  const { data: bulkData, isLoading: isBulkLoading, refetch: bulkRefetch } = useAppQuery({
    url: "/api/products",
  });

  return (
    <>
      {bulkData?.products?.body?.data?.bulkOperationRunQuery?.bulkOperation
        .id ? (
        <Card
          sectioned
        >
          <p>
            {
              bulkData?.products?.body?.data?.bulkOperationRunQuery?.bulkOperation.id
            }
          </p>
        </Card>
      ) : (
        <Card sectioned>
          <p>Generating Bulk Operation Id...</p>
        </Card>
      )}
    </>
  );
};
