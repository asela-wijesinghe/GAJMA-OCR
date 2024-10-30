// DocumentExtractor.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function DocumentExtractor() {
  const [file, setFile] = useState(null);
  const [dataFields, setDataFields] = useState({
    invoiceNo: '',
    date: '',
    billTo: '',
    total: '',
    bankAccount: '',
    bankName: ''
  });

  const [extraData, setExtraData] = useState([]);
  const [jsonOutput, setJsonOutput] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile))
  };

  const handleExtract = async () => {
    if (!file) {
      setError("Please upload a file before extraction.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Extraction failed");

      const result = await response.json();
      console.log(result)

      if(result.imagePreviewUrl){
        setImagePreview(`http://localhost:5000/${result.imagePreviewUrl}`);
      }

      setDataFields({
        invoiceNo: result.templateData?.invoiceNo || '',
        date: result.templateData?.date || '',
        billTo: result.templateData?.billTo || '',
        total: result.templateData?.total || '',
        bankAccount: result.templateData?.bankAccount || '',
        bankName: result.templateData?.bankName || '',
      }); 

      //Set additional data
      setExtraData(result.allData || []);
      setJsonOutput(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setDataFields({});
      setExtraData([]);
      setJsonOutput(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', padding: '20px', borderRadius: '10px' }}>
      <h4 className="text-center" style={{ color: '#334e68', fontWeight: 'bold', marginBottom: '20px' }}>Gajma Document Extractor</h4>
      
      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="d-flex flex-column align-items-center">
          <div className="border rounded p-3" style={{ width: '300px', height: '400px', backgroundColor: '#e8eff5' }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Document preview" className="w-100 h-100" style={{ objectFit: 'cover', borderRadius: '10px' }} />
            ) : (
              <small className="text-center mt-2" style={{ color: '#7d8597' }}>Upload a document to see the preview</small>
            )}
          </div>
        </div>

        <div className="ms-4" style={{ width: '350px' }}>
          <h5 style={{ color: '#334e68' }}>Upload Document</h5>
          <div className="input-group mb-3">
            <input type="file" className="form-control" onChange={handleFileChange} style={{ borderColor: '#c0d6e4' }} />
          </div>
          
          <button className="btn btn-primary w-100 mb-4" onClick={handleExtract} disabled={loading} style={{ backgroundColor: '#5271ff', borderColor: '#5271ff', color: '#fff', fontWeight: 'bold', borderRadius: '5px', transition: '0.3s' }}>
            {loading ? "Extraction Processing..." : "Begin Extraction"}
          </button>
          
          <div className="row g-2">
            <div className="col-6">
              <label htmlFor="invoiceNo" className="form-label" style={{ color: '#334e68' }}>Invoice No</label>
              <input type="text" id="invoiceNo" className="form-control" value={dataFields.invoiceNo || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="date" className="form-label" style={{ color: '#334e68' }}>Date</label>
              <input type="text" id="date" className="form-control" value={dataFields.date || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="billTo" className="form-label" style={{ color: '#334e68' }}>Bill To</label>
              <input type="text" id="billTo" className="form-control" value={dataFields.billTo || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="total" className="form-label" style={{ color: '#334e68' }}>Total</label>
              <input type="text" id="total" className="form-control" value={dataFields.total || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="bankAccount" className="form-label" style={{ color: '#334e68' }}>Account Number</label>
              <input type="text" id="bankAccount" className="form-control" value={dataFields.bankAccount || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="bankName" className="form-label" style={{ color: '#334e68' }}>Bank Name</label>
              <input type="text" id="bankName" className="form-control" value={dataFields.bankName || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
          </div>
        </div>
      </div>
      
      {error && <p className="text-danger text-center mt-3">{error}</p>}

      <div className="mt-5">
        <h5 style={{ color: '#334e68' }}>JSON Extraction</h5>
        <div className="border rounded p-3" style={{ backgroundColor: '#2d3748', color: '#e2e8f0', height: '200px', overflowY: 'auto' }}>
          <pre>{jsonOutput ? JSON.stringify(jsonOutput, null, 2) : "No JSON data available"}</pre>
        </div>
      </div>
    </div>
  );
}

export default DocumentExtractor;
