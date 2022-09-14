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
