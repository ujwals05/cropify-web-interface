import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Leaf, 
  X, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  BarChart3, 
  AlertTriangle,
  ChevronDown,
  Check,
  RotateCcw
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { detectDisease, type DiseaseResult } from '@/api/disease';

export default function DiseaseDetector() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    } else {
      setError("Please select a valid image file (JPG, PNG, or WEBP)");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    setResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await detectDisease(selectedFile);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background min-h-screen pb-32"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Section 1 — Page Header */}
        <div className="pt-28 md:pt-32 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs tracking-widest uppercase mb-5"
          >
            <Sparkles size={14} />
            <span>AI Powered</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-heading font-extrabold text-primary tracking-tight mb-5"
          >
            Plant Disease Detector
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-primary/50 max-w-2xl mx-auto font-medium"
          >
            Upload a clear photo of your plant leaf to detect diseases instantly and get AI-powered treatment recommendations
          </motion.p>
        </div>

        {/* Section 2 — Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 md:p-10 rounded-3xl border border-muted/30 shadow-xl max-w-[600px] mx-auto"
        >
          <div className="space-y-6">
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer group relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
                  isDragging ? 'border-accent bg-accent/5' : 'border-muted/30 hover:border-accent hover:bg-black/5'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  isDragging ? 'bg-accent text-white' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white'
                }`}>
                  <Leaf size={32} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">Drop your plant image here</h3>
                <p className="text-primary/40 font-medium text-sm">or click to browse files</p>
                <p className="text-[11px] text-primary/30 mt-4 font-bold uppercase tracking-widest">JPG, PNG, WEBP — Max size 10MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={imagePreviewUrl || ''}
                  alt="Plant Preview"
                  className="w-full max-h-[300px] object-cover rounded-2xl shadow-md"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            )}

            {selectedFile && (
              <div className="flex items-center justify-between px-1">
                <div className="text-xs font-medium text-primary/40 truncate max-w-[200px]">
                  {selectedFile.name}
                </div>
                <div className="text-xs font-bold text-primary/30">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Analyzing plant image..."
              className="w-full py-5 text-base shadow-lg group"
              disabled={!selectedFile || loading}
            >
              Detect Disease
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* Section 4 — Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-[600px] mx-auto mt-6 p-5 rounded-2xl bg-red-50 border-l-4 border-l-red-500 flex items-center justify-between gap-3 text-red-800"
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={20} />
                <div>
                  <p className="text-sm font-bold">Detection Failed</p>
                  <p className="text-xs font-medium opacity-80">{error}</p>
                </div>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-xs font-bold uppercase tracking-wider hover:underline"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section */}
        <div className="max-w-[600px] mx-auto mt-10">
          <button
            onClick={() => setTipsOpen(!tipsOpen)}
            className="flex items-center gap-2 text-primary/40 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mx-auto"
          >
            Tips for best results
            <motion.div
              animate={{ rotate: tipsOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {tipsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Use clear, well-lit photos",
                    "Focus on the affected leaf area",
                    "Avoid blurry or dark images",
                    "One leaf per photo works best"
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-muted/30 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} className="text-accent" />
                      </div>
                      <span className="text-xs font-bold text-primary/60">{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 3 — Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-6"
            >
              {/* Results Card 1 — Primary Detection Result */}
              <div className={`p-8 md:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden ${
                result.is_healthy ? 'bg-primary' : 'bg-red-800'
              }`}>
                <div className="absolute top-6 right-6 md:top-8 md:right-8">
                  <div className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest ${
                    result.is_healthy ? 'bg-accent text-primary' : 'bg-white text-red-800'
                  }`}>
                    {result.is_healthy ? 'Healthy \u2713' : 'Disease Detected'}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-60 mb-4">Detection Result</h3>
                    <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1">{result.plant}</div>
                    <div className="flex items-center gap-2 text-xl md:text-2xl font-bold opacity-90">
                      {!result.is_healthy && <AlertTriangle size={24} className="text-white" />}
                      {result.disease}
                    </div>
                  </div>

                  <div className="relative group/conf">
                    <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover/conf:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex flex-col items-end">
                      <div className="text-3xl md:text-4xl font-black tracking-tighter">
                        {(result.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                        <BarChart3 size={12} strokeWidth={3} />
                        Confidence Level
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Card 2 — Top 3 Predictions */}
              <div className="bg-white p-8 rounded-3xl border border-muted/30 shadow-lg">
                <div className="flex items-center gap-2 mb-8">
                  <BarChart3 size={18} className="text-accent" />
                  <h3 className="text-sm font-bold text-primary/40 uppercase tracking-widest">Top 3 Predictions</h3>
                </div>
                
                <div className="space-y-6">
                  {result.top_3.map((pred, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-sm font-bold text-primary">{pred.plant}</div>
                          <div className="text-xs font-medium text-primary/40">{pred.disease}</div>
                        </div>
                        <div className="text-sm font-extrabold text-primary">{(pred.confidence * 100).toFixed(1)}%</div>
                      </div>
                      <div className="h-3 w-full bg-muted/20 rounded-full overflow-hidden p-[2px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pred.confidence * 100}%` }}
                          transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 + (i * 0.1) }}
                          className={`h-full rounded-full relative ${
                            pred.is_healthy 
                              ? 'bg-gradient-to-r from-accent to-[#D4FF70]' 
                              : 'bg-gradient-to-r from-red-600 to-red-400'
                          }`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                      {i < result.top_3.length - 1 && <div className="pt-2 border-b border-muted/10" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Card 3 — Treatment Recommendation */}
              <div className={`bg-white p-8 rounded-3xl border border-muted/30 border-l-4 shadow-lg ${
                result.is_healthy ? 'border-l-accent' : 'border-l-red-500'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    result.is_healthy ? 'bg-accent/10 text-accent' : 'bg-red-50 text-red-600'
                  }`}>
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Treatment Recommendation</h3>
                </div>

                {result.is_healthy ? (
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <p className="text-lg font-bold text-primary mb-2">Your plant is healthy!</p>
                    <p className="text-primary/70 font-medium text-sm leading-relaxed max-w-md">
                      {result.treatment}
                    </p>
                  </div>
                ) : (
                  <p className="text-primary/70 font-medium text-base leading-relaxed">
                    {result.treatment}
                  </p>
                )}
              </div>

              {/* Results Card 4 — Analyze Another */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="group"
                >
                  <RotateCcw size={16} className="mr-2 group-hover:-rotate-45 transition-transform" />
                  Analyze Another Plant →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
