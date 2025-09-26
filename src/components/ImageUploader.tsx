import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  defaultImageUrl?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, defaultImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(defaultImageUrl || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultImageUrl) {
      setImageUrl(defaultImageUrl);
    }
  }, [defaultImageUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar uma imagem para enviar.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(filePath);
      
      setImageUrl(publicUrl);
      onUpload(publicUrl);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    onUpload('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-brand-light mb-2">Imagem do Imóvel</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-accent/50 border-dashed rounded-md">
        {imageUrl ? (
          <div className="relative group">
            <img src={imageUrl} alt="Imóvel enviado" className="h-48 w-auto rounded-md object-cover" />
            <div 
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-brand-light" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-brand-secondary rounded-md font-medium text-brand-cta hover:text-sky-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-cta p-1"
              >
                <span>Envie um arquivo</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={uploading} accept="image/*" />
              </label>
              <p className="pl-1 text-brand-light">ou arraste e solte</p>
            </div>
            <p className="text-xs text-brand-light">PNG, JPG, GIF até 10MB</p>
            {uploading && <p className="text-sm text-brand-cta">Enviando...</p>}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;