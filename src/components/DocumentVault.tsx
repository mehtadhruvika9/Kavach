import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Folder, 
  FolderOpen, 
  FileText, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Download, 
  Eye, 
  X, 
  ShieldAlert, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { VaultDocument, ScreenId } from '../types';

interface VaultProps {
  documents: VaultDocument[];
  onAddDocument: (doc: VaultDocument) => void;
  onNavigate: (screen: ScreenId) => void;
  addLog: (message: string, type: 'info' | 'success' | 'warning' | 'action') => void;
}

export const DocumentVault: React.FC<VaultProps> = ({
  documents,
  onAddDocument,
  onNavigate,
  addLog
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Policies': true,
    'Claims': false,
    'Payments': false,
    'Personal': false
  });
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [scanningPhase, setScanningPhase] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<'Policies' | 'Claims' | 'Payments' | 'Personal'>('Policies');

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const handleOpenDoc = (doc: VaultDocument) => {
    addLog(`Opening secure file viewer for: ${doc.name}`, 'action');
    setSelectedDoc(doc);
  };

  const handleTriggerMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Start mock upload
    setIsUploading(true);
    setUploadProgress(10);
    setScanningPhase('Uploading file to bank secure enclave...');
    addLog(`Uploading document: ${file.name}`, 'info');

    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress < 70) {
        setUploadProgress(currentProgress);
      } else if (currentProgress >= 70 && currentProgress < 95) {
        setUploadProgress(currentProgress);
        setScanningPhase('AES-256 Document Encryption & Malware Audit...');
      } else {
        clearInterval(interval);
        setUploadProgress(100);
        setScanningPhase('Auto-indexing file to vault folders...');
        
        setTimeout(() => {
          const newDoc: VaultDocument = {
            id: `doc-${Date.now()}`,
            name: file.name,
            category: uploadCategory,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` === '0.0 MB' ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            dateAdded: '16 Jul 2026'
          };
          onAddDocument(newDoc);
          setIsUploading(false);
          setUploadProgress(0);
          addLog(`Added ${file.name} to vault category: ${uploadCategory}`, 'success');
        }, 1200);
      }
    }, 400);
  };

  const categories: Array<'Policies' | 'Claims' | 'Payments' | 'Personal'> = [
    'Policies',
    'Claims',
    'Payments',
    'Personal'
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="screen-vault-container">
      {/* Header */}
      <div className="bg-[#8B1A1A] text-white pt-5 pb-4 px-4 shadow-sm shrink-0" id="vault-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              id="vault-back-btn"
              onClick={() => onNavigate('dashboard')} 
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-base font-display font-semibold">Document Vault</h1>
          </div>
          <Lock className="h-5 w-5 text-amber-400" />
        </div>
        <p className="text-[10px] text-white/70 mt-1 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Secured by IndusInd Bank • AES-256 Encrypted
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar" id="vault-scroll-content">
        
        {/* Upload Block */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-3 shadow-3xs space-y-2.5" id="vault-uploader-box">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Secure Document Upload</h3>
            <select 
              id="upload-category-selector"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as any)}
              className="text-[9px] font-bold text-[#8B1A1A] border border-slate-200 rounded px-2 py-0.5 outline-none bg-slate-50"
            >
              <option value="Policies">Folder: Policies</option>
              <option value="Claims">Folder: Claims</option>
              <option value="Payments">Folder: Payments</option>
              <option value="Personal">Folder: Personal</option>
            </select>
          </div>

          {isUploading ? (
            <div className="border-2 border-dashed border-[#8B1A1A]/30 rounded-lg p-4 bg-slate-50 text-center space-y-2 animate-pulse" id="uploader-progress-state">
              <div className="flex justify-center">
                <UploadCloud className="h-7 w-7 text-[#8B1A1A] animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-slate-800">{scanningPhase}</p>
                <p className="text-[9px] text-slate-400">Security Check Status: {uploadProgress}%</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1 max-w-xs mx-auto overflow-hidden">
                <div className="bg-[#8B1A1A] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          ) : (
            <label 
              id="file-dropzone-label"
              className="border-2 border-dashed border-slate-300 hover:border-[#8B1A1A] rounded-lg p-4 bg-slate-50 text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <UploadCloud className="h-7 w-7 text-slate-400" />
              <p className="text-xs font-bold text-slate-700">Tap to Upload Documents</p>
              <p className="text-[9px] text-slate-400">PDF, JPG or PNG up to 10MB • Direct Vault filing</p>
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleTriggerMockUpload}
                className="hidden" 
                id="vault-file-input"
              />
            </label>
          )}
        </div>

        {/* Expandable Folder List */}
        <div className="space-y-2" id="folders-accordion">
          {categories.map((cat) => {
            const isExpanded = expandedFolders[cat];
            const catFiles = documents.filter(doc => doc.category === cat);

            return (
              <div key={cat} className="bg-white border border-slate-200/60 rounded-lg overflow-hidden shadow-3xs" id={`folder-${cat}`}>
                {/* Folder Header */}
                <div 
                  onClick={() => toggleFolder(cat)}
                  className="px-3 py-2 bg-slate-50 flex justify-between items-center cursor-pointer border-b border-slate-100 hover:bg-slate-100/50 transition-colors"
                  id={`folder-trigger-${cat}`}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <FolderOpen className="h-4.5 w-4.5 text-[#8B1A1A]" />
                    ) : (
                      <Folder className="h-4.5 w-4.5 text-slate-400" />
                    )}
                    <span className="text-[11px] font-bold text-slate-800">{cat}</span>
                    <span className="text-[9px] bg-slate-200 text-slate-600 font-semibold px-2 py-0.2 rounded-full">
                      {catFiles.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                  )}
                </div>

                {/* Folder Files (Accordion) */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100" id={`folder-contents-${cat}`}>
                    {catFiles.length === 0 ? (
                      <div className="p-3 text-center text-[10px] text-slate-400 font-medium">
                        No documents added to this folder yet.
                      </div>
                    ) : (
                      catFiles.map((doc) => (
                        <div 
                          key={doc.id}
                          onClick={() => handleOpenDoc(doc)}
                          className="px-3 py-2 flex justify-between items-center hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-900 truncate group-hover:text-[#8B1A1A] transition-colors">{doc.name}</p>
                              <p className="text-[9px] text-slate-400 font-bold">Added {doc.dateAdded} • {doc.size}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-slate-100 group-hover:bg-[#8B1A1A]/10 px-1.5 py-0.5 rounded transition-colors text-[9px] font-bold text-slate-600 group-hover:text-[#8B1A1A]">
                            <Eye className="h-3 w-3" /> View
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security Info Card */}
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 flex items-start gap-2" id="vault-security-disclaimer">
          <Lock className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-[10px] text-slate-500 leading-relaxed space-y-0.5 font-medium">
            <p className="font-bold text-slate-700">AES-256 Secure Cloud Vault</p>
            <p>
              Your documents are encrypted prior to being stored inside our sovereign vault infrastructure. Under no circumstances are files accessible by third parties or unverified agents.
            </p>
          </div>
        </div>

      </div>

      {/* Secure Document Viewer Modal */}
      {selectedDoc && (
        <div className="absolute inset-0 bg-black/75 z-40 flex flex-col justify-end" id="doc-viewer-backdrop">
          <div className="bg-white rounded-t-2xl p-5 space-y-4 shadow-2xl h-[90%] flex flex-col animate-slideUp" id="doc-viewer-modal">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#8B1A1A]" />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{selectedDoc.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{selectedDoc.category} • Secured Access</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Content (Stylized Mock PDF Paper) */}
            <div className="flex-1 overflow-y-auto bg-slate-100 rounded-xl p-4 flex justify-center items-start no-scrollbar" id="doc-paper-container">
              <div className="bg-white border border-slate-200 shadow-md w-full max-w-md p-6 font-mono text-[9px] text-slate-700 space-y-4 rounded-md">
                
                {/* Header Letterhead */}
                <div className="text-center border-b border-dashed border-slate-300 pb-4 space-y-1">
                  <p className="font-bold text-xs tracking-wider uppercase">INDUSIND BANK INSURANCE SERVICE</p>
                  <p className="text-[8px] text-slate-400">NARIMAN POINT EXECUTIVE OFFICE, MUMBAI, INDIA</p>
                  <p className="text-[8px] text-slate-400">TELEPHONE: +91 22 6641 2200 | SUPPORT@INDUSIND.COM</p>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-slate-500 py-1">
                  <div>
                    <span className="block font-bold">DOCUMENT TYPE:</span>
                    <span>{selectedDoc.category.toUpperCase()} LEDGER COPY</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold">SECURE REF ID:</span>
                    <span className="font-bold text-[#8B1A1A]">IND-DS-{selectedDoc.id.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="block font-bold">DATE ATTESTED:</span>
                    <span>{selectedDoc.dateAdded}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold">SECURITY ENCRYPTION:</span>
                    <span>AES-256 LEVEL III</span>
                  </div>
                </div>

                <div className="border-t border-b border-dashed border-slate-300 py-4 space-y-2">
                  <p className="font-bold text-slate-900">CERTIFICATE OF PROTECTION COVERAGE</p>
                  <p className="leading-relaxed text-slate-600">
                    This document verifies that client <strong className="text-slate-800">Rahul Sharma</strong>, residing at Flat 402, Sea Breeze Residency, Bandra West, Mumbai - 400050, maintains a fully secure asset indemnity arrangement under the IndusInd Bank Kavach Protection wallet framework.
                  </p>
                </div>

                {/* Visual Verification Badge */}
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">VERIFICATION STAMP</p>
                    <p className="text-[8px] text-slate-500">AUDITED BY INDUS KAVACH RISK DESK</p>
                  </div>
                  <div className="h-10 w-10 border-2 border-emerald-600 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[7px] text-center uppercase tracking-tight transform rotate-12">
                    PASSED SECURITY
                  </div>
                </div>

                {/* Footer seal */}
                <div className="text-center pt-2 text-slate-400 text-[8px] border-t border-dashed border-slate-200">
                  <p>© 2026 IndusInd Bank Ltd. All rights reserved.</p>
                  <p>Aadhaar authenticated & electronically ledgered.</p>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 shrink-0">
              <button 
                onClick={() => { addLog(`Downloaded local copy of ${selectedDoc.name}`, 'success'); setSelectedDoc(null); }}
                className="flex-1 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 cursor-pointer"
              >
                <Download className="h-4.5 w-4.5" /> Download PDF
              </button>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="flex-1 bg-[#8B1A1A] hover:bg-brand-maroon-dark text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
