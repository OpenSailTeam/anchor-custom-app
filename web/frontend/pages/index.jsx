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
import { ActionCard } from "../components/ActionCard";

export default function HomePage() {

  useAppQuery({
    url: "/api/webhook/subscribe/products/export",
  })


  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <ActionCard></ActionCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
