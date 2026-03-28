'use client'
import React, { useState } from 'react';
import { X, Download, MapPin, Users, Home, AlertTriangle, CheckCircle2, Loader2, Navigation, Waves, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useDisasterContext } from '@/context/DisasterContext';

export default function EvacuationMapModal() {
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, loading, success, error
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const {predictedResources} = useDisasterContext();

  const handleDownload = async () => {
    setDownloadStatus('loading');
    setProgress(10);
    setErrorMessage('');

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 12;
      });
    }, 18000); // Update every 18 seconds

    try {
      // Call your backend API endpoint (no body needed)
      const response = await fetch(`/api/evacuation-map/${predictedResources?.resourcePlanId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate evacuation map');
      }

      // Get the HTML blob from response
      const blob = await response.blob();
      
      // Extract filename from Content-Disposition header (set by your backend)
      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFileName = 'evacuation_map.html'; // fallback
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          downloadFileName = filenameMatch[1];
        }
      }

      setFileName(downloadFileName);
      setProgress(95);

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setProgress(100);
      setDownloadStatus('success');

    } catch (err:any) {
      clearInterval(progressInterval);
      setDownloadStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred');
      setProgress(0);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🗺️ Evacuation Map</h1>
                <p className="text-sm text-gray-600">Kendrapara District - Interactive Route Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl">
          
          {/* Content */}
          <div className="p-6 lg:p-8">
            {/* Map Preview Info */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 lg:p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-7 h-7 text-blue-600" />
                  What's Included in This Map
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Zone Partitions</p>
                      <p className="text-sm text-gray-600">32 zones mapped</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Home className="w-10 h-10 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Shelters</p>
                      <p className="text-sm text-gray-600">56 shelter locations</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Zone Nodes</p>
                      <p className="text-sm text-gray-600">Critical junction points</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Navigation className="w-10 h-10 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Road Routes</p>
                      <p className="text-sm text-gray-600">Zone to zone connections</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Waves className="w-10 h-10 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">River Routes</p>
                      <p className="text-sm text-gray-600">Waterway evacuation paths</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-10 h-10 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Evacuation Paths</p>
                      <p className="text-sm text-gray-600">Optimized routes to shelters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Features Legend */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                Map Legend & Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Road Route (Zone→Zone)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">River Route (Zone→Zone)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Evacuation Road → Shelter</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-1.5 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Evacuation River → Shelter</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700 font-medium">Zone Node</span>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">Shelter Point (56 total)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Navigation className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700 font-medium">Direction of Travel</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 shadow-sm">
                <p className="text-sm text-blue-700 font-semibold mb-2 uppercase tracking-wide">Risk Score</p>
                <p className="text-4xl font-bold text-blue-900">37.45</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200 shadow-sm">
                <p className="text-sm text-purple-700 font-semibold mb-2 uppercase tracking-wide">Total Zones</p>
                <p className="text-4xl font-bold text-purple-900">32</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 shadow-sm">
                <p className="text-sm text-green-700 font-semibold mb-2 uppercase tracking-wide">Shelters</p>
                <p className="text-4xl font-bold text-green-900">56</p>
              </div>
            </div>

            {/* Download Button */}
            {downloadStatus === 'idle' && (
              <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-5 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] text-lg"
              >
                <Download className="w-7 h-7" />
                <span>Generate & Download Map</span>
              </button>
            )}

            {/* Loading State */}
            {downloadStatus === 'loading' && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200">
                  <div className="flex items-center gap-4 mb-6">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="font-bold text-blue-900 text-lg">Generating evacuation map...</span>
                  </div>
                  
                  <div className="w-full bg-blue-200 rounded-full h-4 overflow-hidden mb-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 ease-out rounded-full shadow-lg"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700 font-medium">
                      {progress < 30 && 'Collecting disaster data...'}
                      {progress >= 30 && progress < 60 && 'Computing evacuation routes...'}
                      {progress >= 60 && progress < 90 && 'Creating interactive map...'}
                      {progress >= 90 && 'Finalizing...'}
                    </span>
                    <span className="font-bold text-blue-900 text-lg">{progress}%</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 text-center bg-amber-50 border border-amber-200 rounded-lg p-4">
                  ⏱️ This may take 2-5 minutes. Please don't close this window.
                </p>
              </div>
            )}

            {/* Success State */}
            {downloadStatus === 'success' && (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                  <div className="flex items-center gap-4 mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                    <div>
                      <h3 className="font-bold text-green-900 text-2xl">Download Successful!</h3>
                      <p className="text-sm text-green-700 mt-1">Your evacuation map is ready.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-300 mb-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1 font-semibold">Downloaded file:</p>
                    <p className="font-mono text-sm text-gray-900 break-all">{fileName}</p>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-green-800 bg-green-100 rounded-lg p-4 border border-green-300">
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="font-medium">Open the HTML file in your browser to view the interactive evacuation map.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-white border-2 border-blue-600 text-blue-600 font-bold py-4 px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Download Again
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-center"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Error State */}
            {downloadStatus === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
                  <div className="flex items-start gap-4 mb-4">
                    <AlertTriangle className="w-10 h-10 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-red-900 text-2xl mb-2">Generation Failed</h3>
                      <p className="text-sm text-red-700 bg-red-100 rounded-lg p-3 border border-red-200">{errorMessage}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Try Again
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg text-center"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {downloadStatus === 'idle' && (
              <div className="mt-8 bg-amber-50 rounded-xl p-6 border-2 border-amber-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-amber-900">
                    <p className="font-bold mb-3 text-base">Important Notes:</p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>The map is an interactive HTML file that works offline</li>
                      <li>Share this file with field teams for coordinated evacuation</li>
                      <li>Map includes real-time risk scores and optimal routes</li>
                      <li>File size: ~2-5 MB (works on mobile devices)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}