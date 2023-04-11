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
  
  export const BulkOperationCheckerCard = () => {

  
    return (
      <>
        {bulkData?.products?.body?.data?.bulkOperationRunQuery?.bulkOperation
          .id ? (
          <Card>
            <p>{}</p>
            
          </Card>
        ) : (
          <Card sectioned>
            <p></p>
          </Card>
        )}
      </>
    );
  };
  