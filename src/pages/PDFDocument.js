// PDFDocument.js

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logoImage from '../Images/logo.png'; // Ensure the correct path to the logo image

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
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const PDFDocument = ({ executiveShirtTotals, factoryWorkerShirtTotals, factoryWorkerSkirtTotals }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logo Header */}
      <Image src={logoImage} style={styles.logo} />

      {/* Content */}
      <Text style={styles.title}>Total Uniform Orders</Text>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Executive T-Shirts</Text>
        {executiveShirtTotals.map((total, index) => (
          <Text key={index} style={styles.listItem}>
            {total._id}: {total.totalShirts}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Factory Worker T-Shirts</Text>
        {factoryWorkerShirtTotals.map((total, index) => (
          <Text key={index} style={styles.listItem}>
            {total._id}: {total.totalShirts}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Factory Worker Skirts</Text>
        {factoryWorkerSkirtTotals.map((total, index) => (
          <Text key={index} style={styles.listItem}>
            {total._id}: {total.totalSkirts}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFDocument;
