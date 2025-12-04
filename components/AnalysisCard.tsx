import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, Youtube, TrendingUp, Scissors, Copy, Check, Download, PlayCircle, Bookmark } from 'lucide-react';
import { SearchResult, VideoMetadata } from '../types';

interface AnalysisCardProps {
  result: SearchResult;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ result }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Load saved clips on mount to set initial state
  useEffect(() => {
    try {
      const stored = localStorage.getItem('viral_saved_clips');
      if (stored) {
        const parsed = JSON.parse(stored);
        const ids = new Set(parsed.map((v: any) => v.id));
        setSavedIds(ids as Set<string>);
      }
    } catch (e) {
      console.error("Error loading saved clips", e);
    }
  }, []);

  const copyToClipboard = (id: string) => {
    const url = `https://www.youtube.com/watch?v=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveClip = (video: VideoMetadata) => {
    try {
      const stored = localStorage.getItem('viral_saved_clips');
      const currentSaved = stored ? JSON.parse(stored) : [];
      
      // Avoid duplicates
      if (!currentSaved.some((v: any) => v.id === video.id)) {
        const newSaved = [...currentSaved, { ...video, savedAt: new Date().toISOString() }];
        localStorage.setItem('viral_saved_clips', JSON.stringify(newSaved));
        setSavedIds(prev => {
          const newSet = new Set(prev);
          newSet.add(video.id);
          return newSet;
        });
      }
    } catch (e) {
      console.error("Error saving clip", e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Viral Clips Gallery - Displayed FIRST for immediate access */}
      {result.videos.length > 0 && (
        <div className="bg-[#1f1f1f] rounded-xl border border-[#333] p-6 shadow-xl">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-600 rounded-lg">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Viral Clips Gallery</h2>
              <p className="text-sm text-gray-400">Review clips and copy links for your downloader tool.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.videos.map((video) => (
              <div key={video.id} className="bg-black rounded-lg overflow-hidden border border-[#333] flex flex-col">
                <div className="relative pt-[56.25%] bg-black group">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="p-3 bg-[#2a2a2a] space-y-3">
                  <h3 className="text-sm font-medium text-white line-clamp-1" title={video.title}>{video.title}</h3>
                  
                  <div className="flex items-center justify-between gap-2">
                    {/* Copy Link */}
                    <button 
                      onClick={() => copyToClipboard(video.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded bg-[#333] hover:bg-[#444] text-xs font-medium text-gray-300 transition-colors"
                      title="Copy YouTube Link"
                    >
                      {copiedId === video.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === video.id ? 'Copied' : 'Link'}</span>
                    </button>

                     {/* Save Clip */}
                    <button 
                      onClick={() => handleSaveClip(video)}
                      disabled={savedIds.has(video.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded text-xs font-medium transition-colors ${
                        savedIds.has(video.id) 
                          ? 'bg-green-900/30 text-green-400 cursor-default' 
                          : 'bg-[#333] hover:bg-[#444] text-gray-300'
                      }`}
                      title="Save to Bookmarks"
                    >
                      <Bookmark className={`w-3 h-3 ${savedIds.has(video.id) ? 'fill-current' : ''}`} />
                      <span>{savedIds.has(video.id) ? 'Saved' : 'Save'}</span>
                    </button>
                    
                    {/* Download / Open */}
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors"
                      title="Open on YouTube"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Analysis Section */}
      <div className="bg-[#1f1f1f] rounded-xl border border-[#333] p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4 border-b border-[#333] pb-4">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Viral Opportunities Analysis</h2>
        </div>
        
        <div className="prose prose-invert max-w-none prose-headings:text-red-400 prose-a:text-blue-400">
          <ReactMarkdown
            components={{
              h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-6 mb-3 text-red-400 flex items-center gap-2" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
            }}
          >
            {result.text}
          </ReactMarkdown>
        </div>
      </div>

      {/* Sources Section */}
      <div className="bg-[#1f1f1f] rounded-xl border border-[#333] p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Youtube className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">All Source Links</h2>
        </div>
        
        {result.sources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.sources.map((source, index) => (
              <a 
                key={index}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-all duration-200 border border-transparent hover:border-red-500/50"
              >
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-200 group-hover:text-white line-clamp-2">
                    {source.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 truncate group-hover:text-gray-400">
                    {source.uri}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No direct sources returned. Try a broader search.</p>
        )}
      </div>

      {/* Editing Tips Reminder */}
      <div className="bg-gradient-to-r from-red-900/40 to-black rounded-xl border border-red-900/30 p-6">
        <div className="flex items-center gap-3 mb-2">
           <Scissors className="w-5 h-5 text-red-400" />
           <h3 className="font-bold text-red-100">Pro Editor Tip</h3>
        </div>
        <p className="text-sm text-gray-300">
          When editing these clips for Shorts, always ensure the most engaging moment happens within the first <strong>3 seconds</strong> to maximize retention. Use large subtitles (font: Montserrat/Bangers) centered in the middle.
        </p>
      </div>

    </div>
  );
};