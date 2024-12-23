import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Papa from "papaparse";

const DengueDataList = ({ uploadedData = [], onDataUpdate = () => {} }) => {
  const [dengueData, setDengueData] = useState([]);
  const [formData, setFormData] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  /**
   * ✅ Fetch data from Firebase on Mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dengueCollection = collection(db, "dengueData");
        const dengueSnapshot = await getDocs(dengueCollection);
        const firebaseData = dengueSnapshot.docs.map((doc) => ({
          id: doc.id,
          location: doc.data().location || "N/A",
          cases: Number(doc.data().cases) || 0,
          deaths: Number(doc.data().deaths) || 0,
          date: doc.data().date || "N/A",
          regions: doc.data().regions || "N/A",
        }));
        setDengueData(firebaseData);
        onDataUpdate(firebaseData); // Update parent graph data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [onDataUpdate]);

  /**
   * ✅ Handle CSV Upload
   */
  useEffect(() => {
    if (uploadedData.length > 0) {
      const formattedData = uploadedData.map((row) => ({
        location: row.location?.trim() || row.loc?.trim() || "N/A",
        cases: Number(row.cases || 0),
        deaths: Number(row.deaths || 0),
        date: row.date || "N/A",
        regions: row.regions?.trim() || row.region?.trim() || "N/A",
      }));
      setDengueData((prevData) => {
        const newData = [...prevData, ...formattedData];
        onDataUpdate(newData); // Notify parent with updated data
        return newData;
      });
    }
  }, [uploadedData, onDataUpdate]);

  /**
   * ✅ Add Manual Data Entry
   */
  const handleAddData = async () => {
    const { location, cases, deaths, date, regions } = formData;

    if (!location || !cases || !deaths || !date || !regions) {
      alert("Please fill in all fields.");
      return;
    }

    const newData = {
      location,
      cases: Number(cases),
      deaths: Number(deaths),
      date,
      regions,
    };

    try {
      const docRef = await addDoc(collection(db, "dengueData"), newData);
      setDengueData((prevData) => {
        const updatedData = [...prevData, { id: docRef.id, ...newData }];
        onDataUpdate(updatedData); // Notify parent with updated data
        return updatedData;
      });
      setFormData({ location: "", cases: "", deaths: "", date: "", regions: "" });
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add data. Please try again.");
    }
  };

  /**
   * ✅ Pagination Logic
   */
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = dengueData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(dengueData.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value)); // Update rows per page dynamically
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  return (
    <section>
      <h2></h2>

      {/* ✅ Manual Input Form */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Add Dengue Data</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddData();
          }}
        >
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Cases"
            value={formData.cases}
            onChange={(e) => setFormData({ ...formData, cases: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Deaths"
            value={formData.deaths}
            onChange={(e) => setFormData({ ...formData, deaths: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Regions"
            value={formData.regions}
            onChange={(e) => setFormData({ ...formData, regions: e.target.value })}
            required
          />
          <button type="submit">Add Data</button>
        </form>
      </div>

      

      {/* ✅ Data Table with Pagination */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Location</th>
              <th>Cases</th>
              <th>Deaths</th>
              <th>Date</th>
              <th>Regions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((data, index) => (
              <tr key={index}>
                <td>{indexOfFirstRow + index + 1}</td>
                <td>{data.location}</td>
                <td>{data.cases}</td>
                <td>{data.deaths}</td>
                <td>{data.date}</td>
                <td>{data.regions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DengueDataList;
