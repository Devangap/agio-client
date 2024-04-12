// ShirtInventoryForm.js
import React from 'react';

function ShirtInventoryForm({ inventory }) {
  return (
    <form>
      {inventory.map(item => (
        <div key={item._id}>
          <label>{item.Size}</label>
          <input type="number" value={item.Quantity} readOnly />
        </div>
      ))}
    </form>
  );
}

export default ShirtInventoryForm;
