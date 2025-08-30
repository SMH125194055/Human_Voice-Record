import React, { useState, useRef } from 'react';
import { Edit, Trash2, Play, Calendar, Clock, Volume2, Eye, EyeOff, Copy, Check, FileText, Pause, RotateCcw, VolumeX } from 'lucide-react';
import { Record } from '../types';

interface RecordCardProps {
  record: Record;
  onEdit: (record: Record) => void;
  onDelete: (recordId: string) => void;
}

const RecordCard: React.FC<RecordCardProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullScript, setShowFullScript] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds || !isFinite(seconds)) return 'No audio';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      if (isFinite(audioDuration) && audioDuration > 0) {
        setDuration(audioDuration);
      } else {
        setDuration(0);
      }
    }
  };

  const handleAudioError = () => {
    console.error('Audio failed to load:', record.audio_file_path);
    setDuration(0);
    setIsPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const seekTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getScriptPreview = () => {
    if (showFullScript) return record.script;
    return record.script.length > 150
      ? `${record.script.substring(0, 150)}...`
      : record.script;
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 animate-fade-in group">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-responsive-lg font-semibold text-gray-900 mb-2 break-words group-hover:text-primary-600 transition-colors">
            {record.title}
          </h3>
          {record.description && (
            <p className="text-gray-600 text-responsive-sm mb-3 break-words">{record.description}</p>
          )}
        </div>
        <div className="flex space-x-2 self-start sm:self-auto">
          <button
            onClick={() => onEdit(record)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 focus-visible group-hover:scale-105"
            title="Edit record"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus-visible group-hover:scale-105"
            title="Delete record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Script Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-responsive-sm font-medium text-gray-700 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Script Preview
          </h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(record.script)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy script"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowFullScript(!showFullScript)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={showFullScript ? "Show less" : "Show more"}
            >
              {showFullScript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="text-responsive-sm text-gray-800 break-words leading-relaxed">
            {getScriptPreview()}
          </p>
          {record.script.length > 150 && (
            <button
              onClick={() => setShowFullScript(!showFullScript)}
              className="mt-2 text-primary-600 hover:text-primary-700 text-responsive-sm font-medium transition-colors"
            >
              {showFullScript ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {/* Audio Player Section */}
      {record.audio_file_path && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-responsive-sm font-medium text-gray-700 flex items-center">
              <Volume2 className="w-4 h-4 mr-2 text-primary-600" />
              Audio Player
            </h4>
          </div>
          
          {/* Audio Player with All Controls */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* Basic Audio Player */}
            <audio
              ref={audioRef}
              src={record.audio_file_path}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleAudioEnded}
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleAudioError}
              className="w-full mb-4"
              controls
            />
            
            {/* Custom Audio Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-responsive-sm text-gray-700 font-medium">
                  <span>Progress</span>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={seekTo}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-responsive-sm text-gray-700 font-medium">
                  <span>Volume</span>
                  <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleMute}
                    className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4 pt-2">
                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-sm"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={restartAudio}
                  className="p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors shadow-sm"
                  title="Restart"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-responsive-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(record.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{formatDuration(record.duration)}</span>
          </div>
        </div>

        {/* Audio Status */}
        {record.audio_file_path ? (
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-responsive-sm flex items-center">
              <Volume2 className="w-4 h-4 mr-1" />
              Audio Available
            </span>
            {isPlaying && (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-500 text-responsive-sm">No audio available</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-gray-500 text-responsive-sm">
            {record.script.length} characters • {record.script.trim().split(/\s+/).filter(word => word.length > 0).length} words
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(record.title)}
              className="text-gray-400 hover:text-gray-600 text-responsive-sm transition-colors"
            >
              Copy Title
            </button>
            <button
              onClick={() => copyToClipboard(record.script)}
              className="text-gray-400 hover:text-gray-600 text-responsive-sm transition-colors"
            >
              Copy Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
