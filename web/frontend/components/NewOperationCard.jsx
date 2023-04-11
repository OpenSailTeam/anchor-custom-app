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
