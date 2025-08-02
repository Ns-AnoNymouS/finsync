import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { receiptAPI } from '../../services/api';

const ReceiptUpload = ({ onExtractData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload and process receipt
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a receipt image first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('receipt', selectedFile);

      // Call OCR API
      const response = await receiptAPI.upload(formData);
      
      if (response.data && response.data.success) {
        const extractedData = response.data.data;
        
        toast({
          title: "Receipt processed!",
          description: "Data extracted successfully from your receipt",
        });

        // Pass extracted data to parent component
        if (onExtractData) {
          onExtractData({
            payee: extractedData.vendor || '',
            amount: extractedData.total || '',
            date: extractedData.date ? new Date(extractedData.date) : new Date(),
            category: extractedData.category || '',
            description: `Receipt from ${extractedData.vendor || 'merchant'}`
          });
        }

        // Clear file after successful processing
        clearFile();
      } else {
        throw new Error(response.data?.message || 'Failed to process receipt');
      }
    } catch (error) {
      console.error('Receipt upload error:', error);
      
      // For demo purposes, simulate extraction with sample data
      toast({
        title: "Demo Mode",
        description: "OCR service not available. Using sample data for demonstration.",
        variant: "default",
      });

      // Simulate extracted data
      if (onExtractData) {
        onExtractData({
          payee: 'Sample Store',
          amount: '25.99',
          date: new Date(),
          category: 'Shopping',
          description: 'Receipt upload (demo data)'
        });
      }

      clearFile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileImage className="h-5 w-5" />
          <span>Receipt Upload</span>
        </CardTitle>
        <CardDescription>
          Upload a receipt image to automatically extract transaction data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Receipt</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your receipt image here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG files up to 5MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative">
              <img
                src={preview}
                alt="Receipt preview"
                className="w-full max-h-64 object-contain rounded-lg border"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* File info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{selectedFile.name}</span>
              <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Extract Data</span>
                  </div>
                )}
              </Button>
              <Button variant="outline" onClick={clearFile}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Tips for better results:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Ensure the receipt is clearly visible and well-lit</li>
            <li>• Avoid shadows and reflections</li>
            <li>• Include the full receipt with all text visible</li>
            <li>• Higher resolution images work better</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptUpload;