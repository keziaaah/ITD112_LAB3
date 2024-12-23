import React, { useState } from 'react';
import LoadCSVModal from './LoadCSVModal';

const ParentComponent = () => {
  const [csvData, setCsvData] = useState([]);

  // Handle CSV Upload Callback
  const handleCSVUpload = (data) => {
    console.log('✅ CSV Data Received in Parent Component:', data);
    setCsvData(data); // Store uploaded CSV data in state
  };

  return (
    <div>
      <h1>Dengue Data Management</h1>
      <LoadCSVModal onUpload={handleCSVUpload} />
      <h2>Uploaded Data:</h2>
      <pre>{JSON.stringify(csvData, null, 2)}</pre>
    </div>
  );
};

export default ParentComponent;
