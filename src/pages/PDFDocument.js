import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logoImage from '../Images/logo.png'; 

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF', 
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
    textAlign: 'center', 
    color: '#1F1300', 
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#1F1300', 
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    color: '#F7B05B', 
  },
  signatureContainer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    flexDirection: 'column',
  },
  signatureField: {
    marginBottom: 10,
    color: '#1F1300', 
  },
  date: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    color: '#1F1300', 
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

export default PDFDocument;
