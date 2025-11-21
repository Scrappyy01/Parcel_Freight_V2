'use client';

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/ui/Button";
import Modal from "@/components/ui/ui/Modal";

const Fedex_Tracking_Record = ({ freight_id, consignment_number }) => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = async () => {
    setShow(true);
    setLoading(true);
    setError(null);

    try {
      // Fetch the content from an API or external resource
      const response = await axiosInstance.post(
        `/freight/${freight_id}/get_fedex_tracking`,
        {
          Con: consignment_number,
        }
      );
      setContent(response.data);
    } catch (err) {
      setError("Failed to load content.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setContent(null); // Clear content on close
  };

  const handleLabel = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/freight/${freight_id}/get_fedex_label`,
        {},
        {
          responseType: "blob",
          transformResponse: [(data) => data],
        }
      );

      if (!(response.data instanceof Blob)) {
        throw new Error("Failed to generate label, response is not a Blob.");
      }

      const pdfUrl = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "fedex_label.pdf"; // Set the desired file name
      link.style.display = "none"; // Hide the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl); // Clean up the URL object
    } catch (err) {
      setError("Failed to generate label.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleOpen}
        className="w-full sm:w-auto px-6 py-2.5 text-white font-medium rounded-lg transition-all"
        style={{ 
          background: 'linear-gradient(to right, #1e3d5a, #132B43)',
          border: 'none'
        }}
      >
        Tracking
      </button>
      <button
        onClick={handleLabel}
        className="w-full sm:w-auto px-6 py-2.5 text-white font-medium rounded-lg transition-all ml-0 sm:ml-2"
        style={{ 
          background: 'linear-gradient(to right, #FF7D44, #ff9066)',
          border: 'none'
        }}
      >
        Generate Label
      </button>

      <Modal
        isOpen={show}
        onClose={handleClose}
        title="FedEx Tracking Information"
      >
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {content && (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </Modal>
    </div>
  );
};

export default Fedex_Tracking_Record;



