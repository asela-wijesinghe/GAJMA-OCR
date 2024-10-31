// DocumentExtractor.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './images/logo.png'

function DocumentExtractor() {
  const [file, setFile] = useState(null);
  const [dataFields, setDataFields] = useState({
    invDate: '',
    invNo: '',
    customerName: '',
    invoiceCategory: '',
    invValue: '',
    partPayment: '',
    paymentDate: '',
    pendingValue: '',
    creditLimit: '',
    creditDays: '',
    billDueDate: '',
    dueDays: '',
    exceededDays: '',
    status: '',
    range_0_30: '',
    range_31_45: '',
    range_46_60: '',
    range_61_90: '',
    range_90plus: '',
    pdCheque: '',
    pdcDate: '',
    finalAmount: '',
    prNo: '',
    remarks: '',
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
    const baseUrl = require('./baseUrl');
    try {
      const response = await fetch(`${baseUrl}/api/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Extraction failed");

      const result = await response.json();
      console.log(result)

      if(result.imagePreviewUrl){
        setImagePreview(`${baseUrl}/${result.imagePreviewUrl}`);
      }

      setDataFields({
        invDate: result.templateData?.invDate || '',
        invNo: result.templateData?.invNo || '',
        customerName: result.templateData?.customerName || '',
        invoiceCategory: result.templateData?.invoiceCategory || '',
        invValue: result.templateData?.invValue || '',
        partPayment: result.templateData?.partPayment || '',
        paymentDate: result.templateData?.paymentDate || '',
        pendingValue: result.templateData?.pendingValue || '',
        creditLimit: result.templateData?.creditLimit || '',
        creditDays: result.templateData?.creditDays || '',
        billDueDate: result.templateData?.billDueDate || '',
        dueDays: result.templateData?.dueDays || '',
        exceededDays: result.templateData?.exceededDays || '',
        status: result.templateData?.status || '',
        range_0_30: result.templateData?.range_0_30 || '',
        range_31_45: result.templateData?.range_31_45 || '',
        range_46_60: result.templateData?.range_46_60 || '',
        range_61_90: result.templateData?.range_61_90 || '',
        range_90plus: result.templateData?.range_90plus || '',
        pdCheque: result.templateData?.pdCheque || '',
        pdcDate: result.templateData?.pdcDate || '',
        finalAmount: result.templateData?.finalAmount || '',
        prNo: result.templateData?.prNo || '',
        remarks: result.templateData?.remarks || '',
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

      {/* logo here */}
      <div className="text-center mb-4">
        <img src={logo} alt="Company Logo" style={{ width: '350px', height: 'auto' }} />
      </div>
      
      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="d-flex flex-column align-items-center">
          <div className="border rounded p-3" style={{ width: '500px', height: '700px', backgroundColor: '#e8eff5' }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Document preview" className="w-100 h-100" style={{ objectFit: 'cover', borderRadius: '10px' }} />
            ) : (
              <small className="text-center mt-2" style={{ color: '#7d8597' }}>Upload a document to see the preview</small>
            )}
          </div>
        </div>

        <div className="ms-4" style={{ width: '850px' }}>
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
              <input type="text" id="invoiceNo" className="form-control" value={dataFields.invNo || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="invDate" className="form-label" style={{ color: '#334e68' }}>Date</label>
              <input type="text" id="invDate" className="form-control" value={dataFields.invDate || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="customerName" className="form-label" style={{ color: '#334e68' }}>Customer Name</label>
              <input type="text" id="customerName" className="form-control" value={dataFields.customerName || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="invValue" className="form-label" style={{ color: '#334e68' }}>Total Value</label>
              <input type="text" id="invValue" className="form-control" value={dataFields.invValue || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="partPayment" className="form-label" style={{ color: '#334e68' }}>Part Payment</label>
              <input type="text" id="partPayment" className="form-control" value={dataFields.partPayment || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
              <label htmlFor="paymentDate" className="form-label" style={{ color: '#334e68' }}>Payment Date</label>
              <input type="text" id="paymentDate" className="form-control" value={dataFields.paymentDate || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
            </div>
            <div className="col-6">
            <label htmlFor="pendingValue" className="form-label" style={{ color: '#334e68' }}>Pending Value</label>
            <input type="text" id="pendingValue" className="form-control" value={dataFields.pendingValue || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="creditLimit" className="form-label" style={{ color: '#334e68' }}>Credit Limit</label>
            <input type="text" id="creditLimit" className="form-control" value={dataFields.creditLimit || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="creditDays" className="form-label" style={{ color: '#334e68' }}>Credit Days</label>
            <input type="text" id="creditDays" className="form-control" value={dataFields.creditDays || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="billDueDate" className="form-label" style={{ color: '#334e68' }}>Bill Due Date</label>
            <input type="text" id="billDueDate" className="form-control" value={dataFields.billDueDate || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="dueDays" className="form-label" style={{ color: '#334e68' }}>Due Days</label>
            <input type="text" id="dueDays" className="form-control" value={dataFields.dueDays || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="exceededDays" className="form-label" style={{ color: '#334e68' }}>Exceeded Days</label>
            <input type="text" id="exceededDays" className="form-control" value={dataFields.exceededDays || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="status" className="form-label" style={{ color: '#334e68' }}>Status</label>
            <input type="text" id="status" className="form-control" value={dataFields.status || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="range_0_30" className="form-label" style={{ color: '#334e68' }}>Range 0-30 Days</label>
            <input type="text" id="range_0_30" className="form-control" value={dataFields.range_0_30 || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="range_31_45" className="form-label" style={{ color: '#334e68' }}>Range 31-45 Days</label>
            <input type="text" id="range_31_45" className="form-control" value={dataFields.range_31_45 || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="range_46_60" className="form-label" style={{ color: '#334e68' }}>Range 46-60 Days</label>
            <input type="text" id="range_46_60" className="form-control" value={dataFields.range_46_60 || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="range_61_90" className="form-label" style={{ color: '#334e68' }}>Range 61-90 Days</label>
            <input type="text" id="range_61_90" className="form-control" value={dataFields.range_61_90 || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="range_90plus" className="form-label" style={{ color: '#334e68' }}>Range 90+ Days</label>
            <input type="text" id="range_90plus" className="form-control" value={dataFields.range_90plus || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="pdCheque" className="form-label" style={{ color: '#334e68' }}>PD Cheque</label>
            <input type="text" id="pdCheque" className="form-control" value={dataFields.pdCheque || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="pdcDate" className="form-label" style={{ color: '#334e68' }}>PDC Date</label>
            <input type="text" id="pdcDate" className="form-control" value={dataFields.pdcDate || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="finalAmount" className="form-label" style={{ color: '#334e68' }}>Final Amount</label>
            <input type="text" id="finalAmount" className="form-control" value={dataFields.finalAmount || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-6">
            <label htmlFor="prNo" className="form-label" style={{ color: '#334e68' }}>PR No</label>
            <input type="text" id="prNo" className="form-control" value={dataFields.prNo || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          <div className="col-12">
            <label htmlFor="remarks" className="form-label" style={{ color: '#334e68' }}>Remarks</label>
            <textarea id="remarks" className="form-control" value={dataFields.remarks || ''} readOnly style={{ borderColor: '#c0d6e4' }} />
          </div>
          </div>
        </div>
      </div>
      
      {error && <p className="text-danger text-center mt-3">{error}</p>}

      <div className="mt-5">
        <h5 style={{ color: '#334e68' }}>JSON Extraction</h5>
        <div className="border rounded p-3" style={{ backgroundColor: '#2d3748', color: '#e2e8f0', height: '500px', overflowY: 'auto' }}>
          <pre>{jsonOutput ? JSON.stringify(jsonOutput, null, 2) : "No JSON data available"}</pre>
        </div>
      </div>
    </div>
  );
}

export default DocumentExtractor;
