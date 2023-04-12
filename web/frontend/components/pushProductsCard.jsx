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
  import mutateProducts from "../../helpers/mutate-products";
  import readAndModifyJsonlFile from "../../helpers/mutate-products";
  
  export const PushProductsCard = () => {
  
    return (
      <>
          <Card
            sectioned
          >
            <p>Pushing...</p>
          </Card>
      </>
    );
  };
  