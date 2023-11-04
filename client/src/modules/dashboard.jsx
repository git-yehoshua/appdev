import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import EmployeeSearch from "../components/EmployeeSearch";
import "../styles/dashboard-styles.css";
import QRCode from "qrcode.react";
import * as htmlToImage from 'html-to-image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isQRGenerated, setIsQRGenerated] = useState(false);
  const qrCodeRef = useRef(null);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };


  const handleGenerateQR = () => {
    setIsQRGenerated(true);
    toast.info('QR code generating.', {
      position: toast.POSITION.TOP_CENTER,
    });
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
          });
        })
        .catch(function (error) {
          console.error('Error while downloading QR code.', error);
          toast.error('Error while downloading QR code.', {
            position: toast.POSITION.TOP_CENTER,
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
                    position: toast.POSITION.TOP_CENTER
                  });
                },
                function (err) {
                  console.error("Unable to copy QR code to clipboard", err);
                  toast.error('Unable to copy QR code to clipboard', {
                    position: toast.POSITION.TOP_CENTER,
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
  

  return (
    <div className="main-wrap">
      <div className="db-wrap">
        <h2>Employee Dashboard</h2>
        <div className="search-wrap">
          <EmployeeSearch setSearch={setSearch} setSelectedEmployee={setSelectedEmployee} />
        </div>
      {selectedEmployee && (
        <div className="employeeDetails">
          <h3>Employee Details</h3>
          <p>Name: {selectedEmployee.name}</p>
          <p>Department: {selectedEmployee.department}</p>
          <p>Designation: {selectedEmployee.designation}</p>
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
        </div>
      )}
    </div>
  );
};

export default Dashboard;