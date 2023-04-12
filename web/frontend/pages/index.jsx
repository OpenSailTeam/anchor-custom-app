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
import { useAuthenticatedFetch } from "../hooks";
import { useAppQuery } from "../hooks";
import { ActionCard } from "../components/ActionCard";

export default function HomePage() {
  const fetch = useAuthenticatedFetch();

  useAppQuery({
    url: "/api/webhook/subscribe/products/export",
  })

  const onUpdate = async () => {
    try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        });
        console.log(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  return (
    <Page 
    title="Bulk updates dashboard"
    primaryAction={
      {
        content: 'Bulk fetch products',
        onAction: onUpdate
      }
    }
    >
      <Layout>
        <Layout.Section>
          <ActionCard></ActionCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
