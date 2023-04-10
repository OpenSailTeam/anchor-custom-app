import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useSubscription, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useState } from "react";

const BULK_OPERATION_QUERY = gql`
  mutation ($query: String!, $operationName: String!) {
    bulkOperationRunQuery(query: $query, operationName: $operationName) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const BULK_OPERATION_SUBSCRIPTION = gql`
  subscription ($id: ID!) {
    bulkOperationStatus(id: $id) {
      id
      status
      result {
        url
      }
      errorCode
      createdAt
    }
  }
`;

export default function PageName() {
  const [operationId, setOperationId] = useState(null);
  const [bulkQueryResult, setBulkQueryResult] = useState(null);

  const [runBulkQuery] = useMutation(BULK_OPERATION_QUERY);


  return (
    <Page>
      <TitleBar
        title="Page name"
        primaryAction={{
          content: "Primary action",
          onAction: () => console.log("Primary action"),
        }}
        secondaryActions={[
          {
            content: "Secondary action",
            onAction: () => console.log("Secondary action"),
          },
        ]}
      />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Heading>Heading 1</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}


