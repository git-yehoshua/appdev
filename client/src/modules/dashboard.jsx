import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import EmployeeSearch from "../components/EmployeeSearch";
import "../styles/dashboard-styles.css";
import QRCode from "qrcode.react";
import * as htmlToImage from 'html-to-image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isQRGenerated, setIsQRGenerated] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const qrCodeRef = useRef(null);
  const [employeeData, setEmployeeData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeData();
  }, [selectedEmployee]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setEmployeeData(response.data);
      const viewResponse = await axios.get(`http://localhost:5000/view-employee/${selectedEmployee.id}`);
      setEmployeeData(viewResponse.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };


  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
  
    try {
      const response = await axios.get(`http://localhost:5000/view-employee/${selectedEmployee.id}`);
      setEmployeeData(response.data);
      setIsQRGenerated(true);
      setIsGeneratingQR(false);
      toast.success('QR code generated.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Error fetching employee details', error);
      setIsGeneratingQR(false);
      toast.error('Failed to generate QR code.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };
  

  const handleDownloadQR = () => {
    if (qrCodeRef.current) {
      htmlToImage.toPng(qrCodeRef.current)
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.download = 'qrcode.png';
          link.href = dataUrl;
          link.click();
          toast.info('Downloading...', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        })
        .catch(function (error) {
          console.error('Error while downloading QR code.', error);
          toast.error('Error while downloading QR code.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        });
    } else {
      console.error('QR code not available');
    }
  };
  
  const handleCopyQR = () => {
    if (qrCodeRef.current) {
      htmlToImage.toPng(qrCodeRef.current)
        .then(function (dataUrl) {
          const img = new Image();
          img.src = dataUrl;
          img.crossOrigin = "Anonymous"; // Handle CORS
          img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function (blob) {
              const item = new ClipboardItem({ "image/png": blob });
              navigator.clipboard.write([item]).then(
                function () {
                  console.log("QR code copied to clipboard successfully");
                  toast.success('QR code copied to clipboard successfully', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  });
                },
                function (err) {
                  console.error("Unable to copy QR code to clipboard", err);
                  toast.error('Unable to copy QR code to clipboard', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  });
                }
              );
            });
          };
        })
        .catch(function (error) {
          console.error("Error while copying QR code", error);
        });
    } else {
      console.error("QR code not available");
    }
  };
  
  const handleNavigateToAdmin = () => {
    navigate('/admin');
  }

  return (
    <div className="main-wrap">
      <div className="db-wrap">
        <h2>Employee Dashboard</h2>
        <div className="search-wrap">
          <EmployeeSearch setSearch={setSearch} setSelectedEmployee={setSelectedEmployee} />
        </div>
      {selectedEmployee && (
        <div className="employeeData">
          <h3>Employee Details</h3>
          <p>Employee ID: {employeeData.employeeId}</p>
          <p>Name: {employeeData.name}</p>
          <p>Department: {employeeData.department}</p>
          <p>Designation: {employeeData.designation}</p>
          <button onClick={handleGenerateQR}>Generate QR</button>
        </div>
      )}
      </div>
      {isQRGenerated && (
        <div className="generatedQR">
          <h3>Generated QR Code</h3>
          <div className="qr-code" ref={qrCodeRef}>
            <QRCode value={JSON.stringify(selectedEmployee)} />
          </div>
          <button onClick={handleDownloadQR}>Download</button>
          <button onClick={handleCopyQR}>Copy QR</button>
          <button onClick={handleNavigateToAdmin}>Add employee</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;