import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import EmployeeSearch from "../components/EmployeeSearch";
import "../styles/dashboard-styles.css";
import "../styles/display-emp.css";
import QRCode from "qrcode.react";
import * as htmlToImage from 'html-to-image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FloatingAddButton from "../components/FloatingAddButton";
import { mirage } from 'ldrs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight, faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";
import FloatingHistoryButton from "../components/FloatingHistoryButton";


mirage.register();

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isQRGenerated, setIsQRGenerated] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const qrCodeRef = useRef(null);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchEmployeeData();
      setIsQRGenerated(false);
    }
  }, [selectedEmployee]);

  const fetchEmployeeData = async () => {
    try {
      const viewResponse = await axios.get(`http://localhost:5000/view-employee/${selectedEmployee.id}`);
      setEmployeeData(viewResponse.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };


  const handleGenerateQR = async () => {    
    setIsGeneratingQR(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const response = await axios.get(`http://localhost:5000/view-employee/${selectedEmployee.id}`);
      setEmployeeData(response.data);
      setIsQRGenerated(true);
      setIsGeneratingQR(false);
      
      const qrCodeData = JSON.stringify(selectedEmployee);
    
      await axios.post('http://localhost:5000/qr-codes', {
      employeeId: selectedEmployee.id,
      codeData: qrCodeData,
    });
      toast.success('QR code generated.', {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 300,
        pauseOnHover:false,
      });
    } catch (error) {
      console.error('Error fetching employee details', error);
      setIsGeneratingQR(false);
      toast.error('Failed to generate QR code.', {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 300,
        pauseOnHover:false,
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
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose:  200,
            pauseOnHover:false,
          });
        })
        .catch(function (error) {
          console.error('Error while downloading QR code.', error);
          toast.error('Error while downloading QR code.', {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 300,
            pauseOnHover:false,
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
          img.crossOrigin = "Anonymous"; 
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
                  console.log("Copied to clipboard successfully");
                  toast.success('Copied to clipboard successfully', {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 300,
                    pauseOnHover:false,
                  });
                },
                function (err) {
                  console.error("Unable to copy QR code.", err);
                  toast.error('Unable to copy QR code.', {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 300,
                    pauseOnHover:false,
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
      <div className="title-wrap">
      <h1>QR ID</h1 >
      <h4>Employee QR Code Generator</h4>
      </div>
        <div className="search-wrap">
          <EmployeeSearch setSearch={setSearch} setSelectedEmployee={setSelectedEmployee} />
        </div>
      <div className="action-wrap">
      <div className={`db-wrap ${selectedEmployee ? 'with-box-shadow' : ''}`}>
        {selectedEmployee && (
          <div className="employeeData">
            <h3>Employee Details</h3>
            <p>Employee ID: {employeeData.employeeId}</p>
            <p>Name: {employeeData.name}</p>
            <p>Department: {employeeData.department}</p>
            <p>Designation: {employeeData.designation}</p>
          </div>
        )}
        {selectedEmployee && ( 
          <button className="generate-qr-button" onClick={handleGenerateQR}>
            Generate QR <FontAwesomeIcon icon={faArrowAltCircleRight}/>
          </button>
        )}
      </div>
      {isGeneratingQR ? (
        <div className="loading-state">
          <l-mirage size="60" speed="2.5" color="black"></l-mirage>
          <p>Generating...</p>
        </div>
      ) : (
        isQRGenerated && (
          <div className={`generatedQR ${selectedEmployee ? 'with-box-shadow' : ''}`}>
            <h3>Generated QR Code</h3>
            <div className="qr-code" ref={qrCodeRef}> 
              <QRCode value={JSON.stringify(selectedEmployee)} size={250} />
            </div>
            <div className="button-wrap">
              <button onClick={handleDownloadQR}>
                Download <FontAwesomeIcon icon={faDownload}/></button>
              <button onClick={handleCopyQR}>
                Copy QR <FontAwesomeIcon icon={faCopy}/> </button>
            </div>
          </div>
        )
      )}
      </div>

      <div className="float-wrap">
      <FloatingAddButton/>
      </div>
      <div>
      <FloatingHistoryButton/>
      </div>
    </div>
  );
};

export default Dashboard;