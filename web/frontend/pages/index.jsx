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
  Spinner,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";
import { useAppQuery } from "../hooks";
import { ActionCard } from "../components/ActionCard";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const fetch = useAuthenticatedFetch();

  useAppQuery({
    url: "/api/webhook/subscribe/products/export",
  })

  const onUpdate = async () => {
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
        onAction: onUpdate,
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
      </Layout>
    </Page>
  );
}
