import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils/cropImage';
import axios from 'axios';
import { getToken } from '../components/getToken';
import { useTranslation } from 'react-i18next';
import '../styles/UsetProfile.css';

const CompanyPhotoCropper = ({ src, onComplete }) => {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (src) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(src);
    }
  }, [src]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const uploadCroppedImage = async () => {
    try {
      setLoading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('company_photo', croppedImageBlob, 'cropped_image.jpg');

      const token = getToken();
      await axios.post('http://127.0.0.1:8000/api/company/photo/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(t("upload_success"));
      onComplete();
    } catch (error) {
      alert(t("upload_error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!imageSrc) return null;

  return (
    <div className="cropper-overlay">
      <div className="cropper-container">
        <div className="crop-area">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition={true}
            cropShape="rect"
            showGrid={true}
            minZoom={1}
            maxZoom={3}
            objectFit="horizontal-cover"
          />
        </div>
        <div className="controls">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <button onClick={uploadCroppedImage} disabled={loading}>
            {loading ? t("uploading") : t("save")}
          </button>
          <button onClick={onComplete} className="btn btn-secondary">
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyPhotoCropper;
