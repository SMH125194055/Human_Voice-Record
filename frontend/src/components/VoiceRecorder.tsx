import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Volume2, AlertCircle, RotateCcw, VolumeX } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  existingAudioUrl?: string | null;
  onRemoveAudio?: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  isRecording,
  setIsRecording,
  existingAudioUrl,
  onRemoveAudio,
}) => {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasRemovedExisting, setHasRemovedExisting] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Set existing audio URL when editing
  useEffect(() => {
    if (existingAudioUrl && !hasRemovedExisting) {
      setAudioURL(existingAudioUrl);
    }
  }, [existingAudioUrl, hasRemovedExisting]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        onRecordingComplete(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);
      setCurrentTime(0);
      setIsPaused(false);

      // Start timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Unable to access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const playAudio = () => {
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
    console.error('Audio failed to load');
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

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `recording_${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetRecording = () => {
    setAudioURL(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setError(null);
    setIsPaused(false);
    setHasRemovedExisting(true);
    if (onRemoveAudio) {
      onRemoveAudio();
    }
  };

  // Check if we should show the start recording button
  const shouldShowStartButton = !audioURL && !isRecording;
  // Check if we should show existing audio
  const shouldShowExistingAudio = existingAudioUrl && !audioURL && !hasRemovedExisting;

  return (
    <div className="card animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-responsive-lg font-semibold flex items-center">
          <Volume2 className="w-5 h-5 mr-2 text-primary-600" />
          Voice Recorder
        </h3>
        <div className="text-responsive-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-auto">
          {formatTime(isRecording ? duration : currentTime)}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-responsive-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Existing Audio Display */}
      {shouldShowExistingAudio && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-responsive-base font-medium text-blue-900 flex items-center">
              <Volume2 className="w-4 h-4 mr-2" />
              Existing Audio
            </h4>
            <button
              onClick={resetRecording}
              className="text-blue-600 hover:text-blue-800 text-responsive-sm font-medium"
            >
              Remove & Re-record
            </button>
          </div>
          <audio
            ref={audioRef}
            src={existingAudioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleAudioError}
            className="w-full"
            controls
          />
        </div>
      )}

      {/* Recording Controls */}
      {shouldShowStartButton && (
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <button
            onClick={startRecording}
            className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 text-responsive-base"
            disabled={isRecording}
          >
            <Mic className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        </div>
      )}

      {isRecording && (
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex space-x-2">
            {isPaused ? (
              <button
                onClick={resumeRecording}
                className="btn-primary flex items-center justify-center space-x-2 text-responsive-base"
              >
                <Play className="w-5 h-5" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                onClick={pauseRecording}
                className="btn-secondary flex items-center justify-center space-x-2 text-responsive-base"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={stopRecording}
              className="btn-danger flex items-center justify-center space-x-2 text-responsive-base"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-scale-in">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-700 font-medium text-responsive-base">
              {isPaused ? 'Recording Paused' : 'Recording...'}
            </span>
          </div>
          <div className="mt-2 text-red-600 text-responsive-sm">
            {isPaused ? 'Click Resume to continue recording' : 'Speak clearly into your microphone'}
          </div>
        </div>
      )}

      {/* Audio Playback */}
      {audioURL && (
        <div className="space-responsive animate-slide-up">
          <div className="bg-gray-50 rounded-lg p-4">
            <audio
              ref={audioRef}
              src={audioURL}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleAudioEnded}
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleAudioError}
              className="audio-player-responsive"
              controls
            />
          </div>
          
          {/* Custom Audio Controls */}
          <div className="mt-4 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-responsive-sm text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={seekTo}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
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
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-responsive-sm text-gray-600 w-8">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={playAudio}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2 text-responsive-sm"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play</span>
                  </>
                )}
              </button>
              
              <button
                onClick={restartAudio}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2 text-responsive-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart</span>
              </button>
              
              <button
                onClick={downloadAudio}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2 text-responsive-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button
                onClick={resetRecording}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center space-x-2 text-responsive-sm"
              >
                <Mic className="w-4 h-4" />
                <span>Record Again</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-responsive-sm font-medium text-blue-900 mb-1">Recording Tips:</h4>
        <ul className="text-blue-700 text-responsive-sm space-y-1">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Find a quiet environment for better quality</li>
          <li>• Keep the microphone at a consistent distance</li>
          <li>• You can pause and resume recording if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecorder;
