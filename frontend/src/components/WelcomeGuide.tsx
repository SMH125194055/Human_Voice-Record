import React, { useState } from 'react';
import { X, Mic, FileText, Play, Search, CheckCircle } from 'lucide-react';

interface WelcomeGuideProps {
  onClose: () => void;
  onStartRecording: () => void;
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onClose, onStartRecording }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Human Record!',
      description: 'Create, manage, and organize your voice recordings with ease.',
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            This app helps you create professional voice recordings with organized scripts. 
            Perfect for podcasts, presentations, voice-overs, and more!
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Key Features:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• High-quality voice recording with pause/resume</li>
              <li>• Script organization and management</li>
              <li>• Search and filter your recordings</li>
              <li>• Responsive design for all devices</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Create Your First Recording',
      description: 'Start by creating a new record with your script.',
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Click the "New Record" button to get started. You'll need to provide:
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Title</h4>
                <p className="text-gray-600 text-sm">A descriptive name for your recording</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Script</h4>
                <p className="text-gray-600 text-sm">The text you'll be recording</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Description (Optional)</h4>
                <p className="text-gray-600 text-sm">Additional notes or context</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Record Your Audio',
      description: 'Use the voice recorder to capture your audio.',
      icon: <Mic className="w-8 h-8 text-red-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Once you've filled out the form, use the voice recorder to capture your audio:
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Mic className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Start Recording</h4>
                <p className="text-gray-600 text-sm">Click the red button to begin</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-medium">⏸</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Pause/Resume</h4>
                <p className="text-gray-600 text-sm">Take breaks if needed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Preview</h4>
                <p className="text-gray-600 text-sm">Listen to your recording before saving</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-1">Recording Tips:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Find a quiet environment</li>
              <li>• Speak clearly and at a normal pace</li>
              <li>• Keep the microphone at a consistent distance</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Manage Your Records',
      description: 'Search, filter, and organize your recordings.',
      icon: <Search className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Once you have recordings, you can easily manage them:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Search & Filter</h4>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Search by title or content</li>
                <li>• Filter by audio availability</li>
                <li>• Sort by date or title</li>
              </ul>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Actions</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Edit existing records</li>
                <li>• Copy scripts to clipboard</li>
                <li>• Download audio files</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-700 text-sm">
              <strong>Pro tip:</strong> Use the grid/list view toggle to change how your records are displayed!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToRecording = () => {
    onClose();
    onStartRecording();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {steps[currentStep].icon}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep].title}</h2>
              <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            {currentStep === 0 && (
              <button
                onClick={skipToRecording}
                className="btn-primary"
              >
                Start Recording Now
              </button>
            )}
            
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="btn-secondary"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="btn-primary"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;
