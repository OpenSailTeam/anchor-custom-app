import { EmptyState, Layout, Spinner, Card, Button } from "@shopify/polaris";
import { ProductCard } from "./ProductCard";
import { useAppQuery } from "../hooks";

export const ProductList = ({ data, isLoading, isRefetching }) => {
  if (isLoading || isRefetching) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  
  return (
    <Layout>
      <Layout.Section>
      <Card
        sectioned
        primaryFooterAction={{
          content: "test",
        }}
      >
        <p>{data.products.body.data.bulkOperationRunQuery.bulkOperation.id}</p>

      </Card>
      </Layout.Section>
    </Layout>
  );
};
