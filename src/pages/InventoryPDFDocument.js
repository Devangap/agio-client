import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logoImage from '../Images/logo.png';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#f0f0f0', // Light gray background color
    padding: 40,
  },
  logo: {
    width: 100,
    height: 'auto',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center', // Center align the title
    color: '#1F1300', // Dark brown color
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#1F1300', // Dark brown color
  },
  signatureContainer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    flexDirection: 'column',
  },
  signatureField: {
    marginBottom: 10,
    color: '#1F1300', // Dark brown color
  },
  date: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    color: '#1F1300', // Dark brown color
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    color: '#F7B05B', 
  },
});
// Create PDF document component
const InventoryPDFDocument = ({ shirtInventory, skirtInventory }) => (
  <Document>
    <Page size="A4" style={styles.page}>
    <Image src={logoImage} style={styles.logo} />
    <Text style={styles.title}>Inventory Overview</Text>
      <View style={styles.section}>
        <Text style={styles.subtitle}>T-Shirt Inventory</Text>
        {shirtInventory.map((item, index) => (
          <Text key={index} style={styles.listItem}>{item.size}: {item.quantity}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Skirt Inventory</Text>
        {skirtInventory.map((item, index) => (
          <Text key={index} style={styles.listItem}>Waist Size {item.waistSize}: {item.quantity}</Text>
        ))}
      </View>
      
      {/* Signature */}
      <View style={styles.signatureContainer}>
        <Text style={styles.signatureField}>Name: __________________________</Text>
        <Text style={styles.signatureField}>Position: ________________________</Text>
        <Text style={styles.signatureField}>Signature: _______________________</Text>
      </View>
      
      {/* Date */}
      <Text style={styles.date}>Date: {new Date().toLocaleDateString()}</Text>
    </Page>
  </Document>
);

export default InventoryPDFDocument;
