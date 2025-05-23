"use client";

import { createConfirmation } from "react-confirm";
import Modal from "./Modal";
import { useState } from "react";

const ConfirmBody = ({ proceed, cancel, title, message }: any) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => proceed(true), 300); // simulate delay
  };

  const handleCancel = () => {
    cancel(false);
  };

  return (
    <Modal isShowing={true} onClose={handleCancel} title={title} size="sm" loading={loading}>
        <div className="space-y-6">
            <p className="text-gray-700">{message}</p>
            <div className="flex justify-end gap-2">
                <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    Confirm
                </button>
            </div>
        </div>
    </Modal>
  );
};

const confirm = createConfirmation(ConfirmBody);

export default confirm;
