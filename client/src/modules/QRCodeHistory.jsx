import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/qr-history.css';
import QRCode from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

const QRCodeHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  // const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/qr-code-history');
        setHistoryData(response.data);
      } catch (error) {
        console.error('Error fetching QR code generation history', error);
      }
    };

    fetchHistory();
  }, []);

  // const handleDownloadQR = async (qrCodeData) => {
  //   if (qrCodeRef.current) {
  //     try {
  //       const dataUrl = await htmlToImage.toPng(qrCodeRef.current);
  //       console.log('dataUrl:', dataUrl);
  
  //       const link = document.createElement('a');
  //       link.download = 'recent-qrcode.png';
  //       link.href = dataUrl;
  //       link.click();
  //     } catch (error) {
  //       console.error('Error generating QR code image:', error);
  //     }
  //   }
  // };
  

  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      hour12: true, // Use 12-hour clock format
    };
  
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <div>
      <div className='header-wrap'>
      <h2>QR Code Generation History</h2>
      </div>
      <div className='qr-history-wrap'>
      <table>
        <thead>
          <tr>
            <th>QR Code ID</th>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Generated At</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
            {historyData.map((entry) => (
              <tr key={entry.qrCodeId}>
                <td>{entry.qrCodeId}</td>
                <td>{entry.employeeId}</td>
                <td>{entry.employeeName}</td>
                <td>{formatDateTime(entry.generatedAt)}</td>
                {/* <td>
                  <button onClick={() => handleDownloadQR(entry.qrCodeData)}>
                    Download <FontAwesomeIcon icon={faDownload} />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
      </table>
      {/* <div className='recent-qr-wrap'>
      <div className='qr-code' ref={qrCodeRef}>
          {historyData.map((entry) => (
            <QRCode key={entry.qrCodeId} value={entry.qrCodeData} size={250} />
          ))}
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default QRCodeHistory;
