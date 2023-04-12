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
import { PushProductsCard } from "./pushProductsCard";

export const CurrentOperationCard = () => {
  const fetch = useAuthenticatedFetch();
  const [convertStatus, setConvertStatus] = useState(false)
  const [convertedProducts, setConvertedProducts] = useState("")
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

  const handleConvertClick = async () => {
    const products = await readAndModifyJsonlFile(bulkUrl);
    setConvertedProducts(products);
    setConvertStatus(true);
  };
  
  const onUpdate = async () => {
    try {
      for (const product of convertedProducts) {
        console.log("product: ", product);
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
      console.error("Error updating products:", error);
    }
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
          {convertStatus === true ? (
            <Button onClick={onUpdate}>Push Products</Button>
          
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
