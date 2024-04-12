import React, { useEffect, useState } from 'react';
import ShirtInventoryForm from './ShirtInventoryForm';
import SkirtInventoryForm from './SkirtInventoryForm';

function InventoryPage() {
  const [ShirtInventory, setShirtInventory] = useState([]);
  const [SkirtInventory, setSkirtInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Shirt inventory data from backend
    fetch('/ShirtInventory')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch shirt inventory');
        }
        return response.json();
      })
      .then(data => {
        setShirtInventory(data);
      })
      .catch(error => {
        console.error('Error fetching Shirt inventory:', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch Skirt inventory data from backend
    fetch('/SkirtInventory')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch skirt inventory');
        }
        return response.json();
      })
      .then(data => {
        setSkirtInventory(data);
      })
      .catch(error => {
        console.error('Error fetching Skirt inventory:', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Shirt Inventory</h2>
      <ShirtInventoryForm inventory={ShirtInventory} />

      <h2>Skirt Inventory</h2>
      <SkirtInventoryForm inventory={SkirtInventory} />
    </div>
  );
}

export default InventoryPage;
