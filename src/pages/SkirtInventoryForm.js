// SkirtInventoryForm.js
import React from 'react';

function SkirtInventoryForm({ inventory }) {
  return (
    <form>
      {inventory.map(item => (
        <div key={item._id}>
          <label>Waist Size: {item.WaistSize}</label>
          <input type="number" value={item.Quantity} readOnly />
        </div>
      ))}
    </form>
  );
}

export default SkirtInventoryForm;
