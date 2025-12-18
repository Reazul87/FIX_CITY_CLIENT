import React from "react";

import { Document, Page, Text, Image, StyleSheet } from "@react-pdf/renderer";
import logo from "./FIX_CITY.png";

const InvoicePDF = ({ user }) => {
  const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    text: { fontSize: 12, marginBottom: 10 },
  });
  //console.log(user);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Fix City Premium Invoice</Text>
        <Image
          src={logo}
          style={{ width: 100, marginBottom: 20, alignSelf: "center" }}
        />
        <div style={{ width: 360, marginTop: 20, alignSelf: "center" }}>
          <Text style={styles.text}>Name : {user.user_name}</Text>
          <Text style={styles.text}>Email : {user.customer_email}</Text>
          <Text style={styles.text}>
            Plan : Premium ({user.amount / 100} {user.currency.toUpperCase()})
          </Text>
          <Text style={styles.text}>Transaction Id : {user.transactionId}</Text>
          <Text style={styles.text}>Date : {user.paidAt}</Text>
        </div>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

// Example usage in component
{
  /* <PDFDownloadLink
  document={<InvoiceDocument user={user} />}
  fileName="invoice.pdf"
>
  {({ loading }) => (loading ? "Generating..." : "Download Invoice")}
</PDFDownloadLink>; */
}
