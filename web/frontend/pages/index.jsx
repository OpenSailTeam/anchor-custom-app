import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { ProductCard, ProductsCard } from "../components";
import { useAppQuery } from "../hooks";
import { ProductList } from "../components/ProductList";

export default function HomePage() {
  const { data, isLoading, refetch, isRefetching } = useAppQuery({
    url: "/api/products",
  });

  const { update } = useAppQuery({
    url: "/api/webhook/subscribe/products/update",
  });

  const { create } = useAppQuery({
    url: "/api/webhook/subscribe/products/create",
  });

  console.log("data: ", data);
  console.log("update-data: ", update);
  console.log("create-data: ", create);

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
        <Layout.Section>
          <ProductList
            data={data}
            isLoading={isLoading}
            isRefetching={isRefetching}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
