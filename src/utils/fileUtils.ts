import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import apiRoot from 'src/services/util/apiRoot';
import { MomentRange } from './dateUtils';

type PDFOrientation = 'portrait' | 'landscape';

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

export const createImageFromComponent = async <T extends HTMLElement>(
  element: T
): Promise<string> => {
  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/png', 1.0);
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

export const createPdfFromComponent = async (
  component: HTMLDivElement,
  orientation: PDFOrientation = 'portrait',
  header?: string
): Promise<string> => {
  const pdf = new jsPDF(orientation, 'pt', 'a4', true);
  const imgFile = await createImageFromComponent(component);
  const imgProperties = pdf.getImageProperties(imgFile);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
  if (header) {
    pdf.text(header, 15, 40);
    pdf.addImage(
      imgFile,
      'PNG',
      15,
      70,
      pdfWidth * 0.95,
      pdfHeight * 0.95,
      'FAST'
    );
  } else {
    pdf.addImage(
      imgFile,
      'PNG',
      15,
      40,
      pdfWidth * 0.95,
      pdfHeight * 0.95,
      'FAST'
    );
  }

  return URL.createObjectURL(pdf.output('blob'));
};


export const getExcelFromApi = (
  httpMethod: string,
  api: string,
  fileName: string,
  reqBody?: object
) => {
  const xhr = new XMLHttpRequest();
  xhr.open(httpMethod, `${apiRoot}${api}`, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.responseType = 'arraybuffer';
  xhr.onload = function (e) {
    if (this.status === 200) {
      const blob = new Blob([this.response], {
        type: 'application/octet-stream'
      });
      downloadFile(window.URL.createObjectURL(blob), fileName);
    }
  };
  xhr.send(JSON.stringify(reqBody));
};

export const getExcelFromApiWithDate = (
  httpMethod: string,
  api: string,
  fileName: string,
  dateRange: MomentRange
) => {
  const timeFilter = {
    time_from: dateRange[0].format(),
    time_to: dateRange[1].format()
  };
  const xhr = new XMLHttpRequest();
  xhr.open(httpMethod, `${apiRoot}${api}`, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.responseType = 'arraybuffer';
  xhr.onload = function (e) {
    if (this.status === 200) {
      const blob = new Blob([this.response], {
        type: 'application/octet-stream'
      });
      downloadFile(window.URL.createObjectURL(blob), fileName);
    }
  };
  xhr.send(JSON.stringify(timeFilter));
};
