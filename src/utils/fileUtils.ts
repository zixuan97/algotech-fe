import html2canvas from 'html2canvas';
import React from 'react';

export const getBase64 = (
  file: File | null,
  onSuccess: (result: string | ArrayBuffer | null) => void,
  onError?: (err: DOMException | null) => void
) => {
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => onSuccess(reader.result);
    if (onError) {
      reader.onerror = () => onError(reader.error);
    }
  }
};

export const getHtml2Canvas = async <T extends HTMLElement>(
  element: T,
  fileName: string
) => {
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL(fileName, 1.0);
  downloadFile(image, fileName);
};

export const downloadFile = (blob: string, fileName: string) => {
  const link = window.document.createElement('a');
  link.style.display = 'none';
  link.download = fileName;
  link.href = blob;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  link.remove();
};
