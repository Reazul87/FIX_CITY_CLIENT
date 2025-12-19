import React from "react";

import { Document, Page, Text, Image, StyleSheet } from "@react-pdf/renderer";
import logo from "./FIX_CITY.png";

const InvoicePDFBoost = ({ issue }) => {
  const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    text: { fontSize: 12, marginBottom: 10 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Fix City Issue Boost Invoice</Text>
        <Image
          src={logo}
          style={{ width: 100, marginBottom: 20, alignSelf: "center" }}
        />
        <div style={{ width: 290, marginTop: 20, alignSelf: "center" }}>
          <Text style={styles.text}>Id : {issue?.issue_id}</Text>
          <Text style={styles.text}>Email : {issue?.customer_email}</Text>
          <Text style={styles.text}>
            Plan : Issue Boost ({issue?.amount} {issue?.currency.toUpperCase()})
          </Text>
          <Text style={styles.text}>
            Transaction Id : {issue?.transactionId}
          </Text>
          <Text style={styles.text}>Date : {issue?.paidAt}</Text>
        </div>
      </Page>
    </Document>
  );
};

export default InvoicePDFBoost;

// Example usage in component
{
  /* <PDFDownloadLink
  document={<InvoiceDocument issue={issue} />}
  fileName="invoice.pdf"
>
  {({ loading }) => (loading ? "Generating..." : "Download Invoice")}
</PDFDownloadLink>; */
}
