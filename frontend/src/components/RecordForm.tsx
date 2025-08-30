import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, AlertCircle, CheckCircle, Loader, Mic, MicOff } from 'lucide-react';
import { Record, CreateRecordRequest } from '../types';

interface RecordFormProps {
  onSubmit: (data: CreateRecordRequest) => Promise<void>;
  initialData?: Record;
  submitText?: string;
  hasAudio?: boolean;
}

const RecordForm: React.FC<RecordFormProps> = ({
  onSubmit,
  initialData,
  submitText = 'Create Record',
  hasAudio = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<CreateRecordRequest>({
    mode: 'onChange',
    defaultValues: {
      title: initialData?.title || '',
      script: initialData?.script || '',
      description: initialData?.description || '',
    },
  });

  const watchedScript = watch('script');
  const watchedTitle = watch('title');

  useEffect(() => {
    setCharCount(watchedScript?.length || 0);
    setWordCount(watchedScript?.trim().split(/\s+/).filter(word => word.length > 0).length || 0);
  }, [watchedScript]);

  const handleFormSubmit = async (data: CreateRecordRequest) => {
    // Check if audio is required and not provided
    if (!hasAudio) {
      setSubmitError('Audio recording is required. Please record your audio before saving.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(data);
      reset();
    } catch (error) {
      setSubmitError('Failed to save record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitleStatus = () => {
    if (!watchedTitle) return 'empty';
    if (watchedTitle.length < 3) return 'short';
    if (watchedTitle.length > 100) return 'long';
    return 'good';
  };

  const getScriptStatus = () => {
    if (!watchedScript) return 'empty';
    if (watchedScript.length < 10) return 'short';
    if (watchedScript.length > 5000) return 'long';
    return 'good';
  };

  const titleStatus = getTitleStatus();
  const scriptStatus = getScriptStatus();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Audio Requirement Notice */}
      {!hasAudio && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <MicOff className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium text-responsive-sm">Audio Required</span>
          </div>
          <p className="text-red-600 text-responsive-sm mt-1">
            You must record audio before you can save this record.
          </p>
        </div>
      )}

      {/* Audio Status */}
      {hasAudio && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Mic className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium text-responsive-sm">Audio Ready</span>
          </div>
          <p className="text-green-600 text-responsive-sm mt-1">
            Your audio recording is ready. You can now save this record.
          </p>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-responsive-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <div className="relative">
          <input
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
              maxLength: { value: 100, message: 'Title must be less than 100 characters' },
            })}
            type="text"
            id="title"
            className={`input-field pr-10 ${
              errors.title ? 'border-red-300 focus:ring-red-500' : 
              titleStatus === 'good' ? 'border-green-300 focus:ring-green-500' : ''
            }`}
            placeholder="Enter a descriptive title for your recording"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {titleStatus === 'good' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {titleStatus === 'short' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
            {titleStatus === 'long' && <AlertCircle className="w-5 h-5 text-red-500" />}
          </div>
        </div>
        {errors.title && (
          <p className="mt-1 text-red-600 text-responsive-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.title.message}
          </p>
        )}
        {watchedTitle && !errors.title && (
          <p className="mt-1 text-gray-500 text-responsive-sm">
            {watchedTitle.length}/100 characters
          </p>
        )}
      </div>

      {/* Script Field */}
      <div>
        <label htmlFor="script" className="block text-responsive-sm font-medium text-gray-700 mb-2">
          Script *
        </label>
        <div className="relative">
          <textarea
            {...register('script', {
              required: 'Script is required',
              minLength: { value: 10, message: 'Script must be at least 10 characters' },
              maxLength: { value: 5000, message: 'Script must be less than 5000 characters' },
            })}
            id="script"
            rows={6}
            className={`input-field pr-10 resize-none ${
              errors.script ? 'border-red-300 focus:ring-red-500' : 
              scriptStatus === 'good' ? 'border-green-300 focus:ring-green-500' : ''
            }`}
            placeholder="Enter your script content here. This will be the text you'll be recording."
          />
          <div className="absolute top-3 right-3 flex items-center">
            {scriptStatus === 'good' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {scriptStatus === 'short' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
            {scriptStatus === 'long' && <AlertCircle className="w-5 h-5 text-red-500" />}
          </div>
        </div>
        {errors.script && (
          <p className="mt-1 text-red-600 text-responsive-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.script.message}
          </p>
        )}
        {watchedScript && !errors.script && (
          <div className="mt-1 flex items-center justify-between text-gray-500 text-responsive-sm">
            <span>{charCount}/5000 characters</span>
            <span>{wordCount} words</span>
          </div>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-responsive-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          {...register('description', {
            maxLength: { value: 500, message: 'Description must be less than 500 characters' },
          })}
          id="description"
          rows={3}
          className={`input-field ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
          placeholder="Add any additional notes or context about this recording"
        />
        {errors.description && (
          <p className="mt-1 text-red-600 text-responsive-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.description.message}
          </p>
        )}
        {watch('description') && !errors.description && (
          <p className="mt-1 text-gray-500 text-responsive-sm">
            {watch('description')?.length}/500 characters
          </p>
        )}
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-responsive-sm">{submitError}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-600 text-responsive-sm">
          <FileText className="w-4 h-4" />
          <span>All fields marked with * are required</span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !isValid || !hasAudio}
          className={`btn-primary flex items-center space-x-2 ${
            isSubmitting || !isValid || !hasAudio ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitText}</span>
          )}
        </button>
      </div>

      {/* Form Tips */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-responsive-sm font-medium text-blue-900 mb-1">Form Tips:</h4>
        <ul className="text-blue-700 text-responsive-sm space-y-1">
          <li>• Write a clear, descriptive title that summarizes your recording</li>
          <li>• Prepare your script in advance for better recording quality</li>
          <li>• Keep your script concise but comprehensive</li>
          <li>• Add a description to help organize your recordings</li>
          <li>• <strong>Audio recording is required</strong> - you must record audio before saving</li>
        </ul>
      </div>
    </form>
  );
};

export default RecordForm;
