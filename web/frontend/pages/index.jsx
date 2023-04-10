import { useState } from "react";
import { useEffect } from "react";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";

import { ProductCard, ProductsCard } from "../components";
import { useAppQuery } from "../hooks";
import { ProductList } from "../components/ProductList";

export default function HomePage() {
  const [bulkStatus, setBulkStatus] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const { data, isLoading, refetch } = useAppQuery({
    url: "/api/products",
  });

  const { data: bulkData, isLoading: isBulkLoading, refetch: bulkRefetch } = useAppQuery({
    url: "/api/bulk/current",
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (bulkData?.data?.body?.data?.currentBulkOperation?.status === "COMPLETED") {
        setBulkStatus("COMPLETED");
        clearInterval(intervalId);
      } else {
        bulkRefetch();
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [bulkData]);

  const handleConvertClick = () => {
    setIsConverting(true);
    handleStartBulkOperation()
      .then(() => {
        setIsConverting(false);
        bulkRefetch();
      })
      .catch((error) => {
        console.error(error);
        setIsConverting(false);
      });
  };

  const handleDownloadClick = () => {
    const url = bulkData?.data?.body?.data?.currentBulkOperation?.url;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
        <Layout.Section>
          <TextContainer>
            {bulkStatus !== "COMPLETED" ? (
              <p>Bulk operation status: {bulkData?.data?.body?.data?.currentBulkOperation?.status}</p>
            ) : (
              <Stack>
                <p>Bulk operation is completed!</p>
                {!isConverting && (
                  <Stack spacing="tight" wrap={false}>
                    <Button onClick={handleConvertClick} primary>
                      Convert Now
                    </Button>
                    <Button onClick={handleDownloadClick}>Download JSON</Button>
                  </Stack>
                )}
              </Stack>
            )}
          </TextContainer>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
