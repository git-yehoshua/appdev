import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import QRCode from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import { useRef } from 'react';
import { faClose, faDownload } from '@fortawesome/free-solid-svg-icons';
import '../styles/qr-popup.css';

const ViewQRHistory = ({isOpen, onClose, selectedEmployee}) => {
    const qrCodeRef = useRef(null);

    const handleDownloadQR = async () => {
        if (qrCodeRef.current) {
          try {
            const dataUrl = await htmlToImage.toPng(qrCodeRef.current);
            console.log('dataUrl:', dataUrl);
      
            const link = document.createElement('a');
            link.download = 'recent-qrcode.png';
            link.href = dataUrl;
            link.click();
          } catch (error) {
            console.error('Error generating QR code image:', error);
          }
        }
      };
      
  return (
    isOpen && (
        <div className='view-history-popup'>
        <div className='view-history-inner'>
        <h2>Recent QR</h2>
        <div className='recent-qr-wrap'>
            <div className='qr-code' ref={qrCodeRef}>
                {selectedEmployee && (
                    <QRCode key={selectedEmployee.qrCodeId} value={selectedEmployee.qrCodeData} size={250} />
                )}
            </div>
        </div>
        <button className='download-button' onClick={() => handleDownloadQR(selectedEmployee.qrCodeData)}>
            Download <FontAwesomeIcon icon={faDownload} />
        </button>
        <button className='close-button' type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faClose}/>
          </button>
        </div>
    </div>
    )
  );
};

export default ViewQRHistory;
