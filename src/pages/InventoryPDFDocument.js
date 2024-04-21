import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  item: {
    marginBottom: 5
  }
});

// Create PDF document component
const InventoryPDFDocument = ({ shirtInventory, skirtInventory }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>T-Shirt Inventory</Text>
        {shirtInventory.map((item, index) => (
          <Text key={index} style={styles.item}>{item.size}: {item.quantity}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Skirt Inventory</Text>
        {skirtInventory.map((item, index) => (
          <Text key={index} style={styles.item}>Waist Size {item.waistSize}: {item.quantity}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default InventoryPDFDocument;
