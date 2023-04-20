import { useState } from "react";
import {
  Page,
  Layout,
  Spinner,
  Card,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";
import { useAppQuery } from "../hooks";
import { ActionCard } from "../components/ActionCard";
import { ConvertCard } from "../components/ConvertCard";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const fetch = useAuthenticatedFetch();

  //Establishes the webhook necessary to receive bulk product fetches
  useAppQuery({
    url: "/api/webhook/subscribe/products/export",
  })

  //makes a bulk fetch request to the endpoint
  const fetchBulk = async () => {
    setIsLoading(true);
    try {
        const response = await fetch("/api/products/bulk", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsLoading(false);
  };

  return (
    <Page 
    title="Bulk updates dashboard"
    primaryAction={
      {
        content: 'Bulk fetch products',
        onAction: fetchBulk,
        loading: isLoading
      }
    }
    >
      <Layout>
        <Layout.Section>
          {isLoading  ? (
            <Spinner accessibilityLabel="Spinner example" size="large" />

          ) : (
            <ActionCard></ActionCard>
          )}
        </Layout.Section>
        <Layout.Section>
          <ConvertCard></ConvertCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
