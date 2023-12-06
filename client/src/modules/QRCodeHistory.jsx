import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/qr-history.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import ViewQRHistory from '../components/ViewQRHistory';

const QRCodeHistory = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isQRHistoryOpen, setQRHistoryOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const confirmationDialogRef = useRef(null);

  const handleViewQR = (employeeData) => {
    setSelectedEmployee(employeeData);
    setQRHistoryOpen(true);
  };

  const handleQRHistoryClose = () => {
    setQRHistoryOpen(false);
  };

  const handleDeleteSelected = (qrCodeId) => {
    setConfirmDeleteId(qrCodeId);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:5000/qr-code-history/${confirmDeleteId}`)
      .then((response) => {
        toast.success('Selected history deleted successfully', {
          autoClose: 300,
          pauseOnHover: false,
        });
        setConfirmDeleteId(null);
        fetchHistory();
      })
      .catch((error) => {
        console.error('Error deleting selected history', error);
        toast.error('Error deleting selected history', {
          autoClose: 300,
          pauseOnHover: false,
        });
        setConfirmDeleteId(null);
      });
  };

  const handleDeleteAll = () => {
    if (window.confirm('All data will be deleted. Continue?')) {
      axios.delete('http://localhost:5000/qr-code-history')
        .then((response) => {
          toast.success('All history deleted successfully', {
            autoClose: 300,
            pauseOnHover: false,
          });
          fetchHistory();
        })
        .catch((error) => {
          console.error('Error deleting all history', error);
          toast.error('Error deleting all history', {
            autoClose: 300,
            pauseOnHover: false,
          });
        });
    }
  };

  const fetchHistory = () => {
    axios.get('http://localhost:5000/qr-code-history')
      .then((response) => {
        setHistoryData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching QR code generation history', error);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      hour12: true, 
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        confirmationDialogRef.current &&
        !confirmationDialogRef.current.contains(event.target)
      ) {
        setConfirmDeleteId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className='history-header-wrap'>
        <h2>QR Code Generation History</h2>
        <button onClick={handleDeleteAll}>
          Clear History <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className='qr-history-wrap'>
        <table>
          <thead>
            <tr>
              <th>QR Code ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Generated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((entry) => (
              <tr key={entry.qrCodeId}>
                <td>{entry.qrCodeId}</td>
                <td>{entry.employeeId}</td>
                <td>{entry.employeeName}</td>
                <td>{formatDateTime(entry.generatedAt)}</td>
                <td>
                  <button onClick={() => handleViewQR(entry)}>
                    View recent QR <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button onClick={() => handleDeleteSelected(entry.qrCodeId)}>
                    Delete <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ViewQRHistory
        isOpen={isQRHistoryOpen}
        onClose={handleQRHistoryClose}
        selectedEmployee={selectedEmployee}
      />
      {confirmDeleteId && (
        <div className="confirmation-dialog">
          <div className='confirm-inner' ref={confirmationDialogRef}>
            <p>Are you sure you want to delete this history?</p>
            <div className='button-container'>
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={() => setConfirmDeleteId(null)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeHistory;
