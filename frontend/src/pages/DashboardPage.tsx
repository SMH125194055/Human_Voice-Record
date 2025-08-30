import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LogOut, User, Menu, X, Mic, MicOff, Search, Filter, SortAsc, SortDesc, Grid, List, HelpCircle, FileText } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { Record, CreateRecordRequest } from '../types';
import RecordCard from '../components/RecordCard';
import RecordForm from '../components/RecordForm';
import VoiceRecorder from '../components/VoiceRecorder';
import WelcomeGuide from '../components/WelcomeGuide';
import toast from 'react-hot-toast';

type SortOption = 'newest' | 'oldest' | 'title' | 'title-desc';
type ViewMode = 'grid' | 'list';
type FilterOption = 'all' | 'with-audio' | 'without-audio';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  useEffect(() => {
    fetchRecords();
    // Show welcome guide for new users (no records)
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomeGuide(true);
    }
  }, []);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getRecords();
      setRecords(data);
      
      // Hide welcome guide if user has records
      if (data.length > 0) {
        localStorage.setItem('hasSeenWelcome', 'true');
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load records');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered and sorted records
  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.script.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply audio filter
    if (filterBy === 'with-audio') {
      filtered = filtered.filter(record => record.audio_file_path);
    } else if (filterBy === 'without-audio') {
      filtered = filtered.filter(record => !record.audio_file_path);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [records, searchQuery, sortBy, filterBy]);

  const handleCreateRecord = async (data: CreateRecordRequest) => {
    // Check if audio is required and not provided
    if (!currentAudioBlob) {
      toast.error('Audio recording is required. Please record your audio before saving.');
      return;
    }

    try {
      // First create the record
      const newRecord = await apiService.createRecord(data);
      
      // Upload the audio file
      const audioFile = new File([currentAudioBlob], 'recording.wav', { type: 'audio/wav' });
      await apiService.uploadAudio(newRecord.id, audioFile);
      // Always refresh records after audio upload to get the updated record with audio info
      await fetchRecords();
      
      // Reset form state
      setShowCreateForm(false);
      setCurrentAudioBlob(null);
      setIsRecording(false);
      
      toast.success('Record created successfully!');
    } catch (error) {
      console.error('Error creating record:', error);
      toast.error('Failed to create record');
    }
  };

  const handleUpdateRecord = async (data: CreateRecordRequest) => {
    if (!editingRecord) return;
    
    try {
      const updatedRecord = await apiService.updateRecord(editingRecord.id, data);
      
      // If there's new audio, upload it
      if (currentAudioBlob) {
        const audioFile = new File([currentAudioBlob], 'recording.wav', { type: 'audio/wav' });
        await apiService.uploadAudio(updatedRecord.id, audioFile);
        // Always refresh records after audio upload to get the updated record with audio info
        await fetchRecords();
      } else {
        setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
      }
      
      setEditingRecord(null);
      setCurrentAudioBlob(null);
      setIsRecording(false);
      toast.success('Record updated successfully!');
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await apiService.deleteRecord(recordId);
      setRecords(records.filter(r => r.id !== recordId));
      toast.success('Record deleted successfully!');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    setCurrentAudioBlob(audioBlob);
    toast.success('Audio recorded successfully!');
  };

  const handleRemoveAudio = () => {
    setCurrentAudioBlob(null);
    toast.success('Audio removed. You can record new audio.');
  };

  const handleStartCreate = () => {
    setShowCreateForm(true);
    setEditingRecord(null);
    setCurrentAudioBlob(null);
    setIsRecording(false);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setEditingRecord(null);
    setCurrentAudioBlob(null);
    setIsRecording(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    setFilterBy('all');
  };

  const closeWelcomeGuide = () => {
    setShowWelcomeGuide(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-responsive-base">Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-responsive">
          <div className="nav-responsive py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-responsive-xl font-semibold text-gray-900">Human Record</h1>
              <button
                onClick={handleStartCreate}
                className="btn-primary flex items-center space-x-2 text-responsive-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Record</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowWelcomeGuide(true)}
                className="p-2 text-gray-600 hover:text-gray-900 focus-visible"
                title="Help & Tutorial"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 text-responsive-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name}</span>
                <span className="sm:hidden">{user?.name?.split(' ')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center space-x-2 text-responsive-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Screen */}
      <div className="container-responsive py-responsive">
        {/* Header with stats */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-responsive-2xl font-bold text-gray-900 mb-2">Your Records</h2>
              <p className="text-gray-600 text-responsive-base">
                {filteredRecords.length === 0 
                  ? 'No records found' 
                  : `${filteredRecords.length} of ${records.length} record(s)`
                }
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search records by title, script, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Records</option>
                  <option value="with-audio">With Audio</option>
                  <option value="without-audio">Without Audio</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>

                {(searchQuery || filterBy !== 'all' || sortBy !== 'newest') && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 text-responsive-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Records Grid/List - Full Screen */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-responsive-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No records found' : 'No records yet'}
            </h3>
            <p className="text-gray-600 mb-4 text-responsive-base">
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'Create your first voice record with script input.'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleStartCreate}
                className="btn-primary"
              >
                Create First Record
              </button>
            )}
          </div>
        ) : (
          <div className={`space-responsive ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-6'
          }`}>
            {filteredRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onEdit={setEditingRecord}
                onDelete={handleDeleteRecord}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form Popup */}
      {(showCreateForm || editingRecord) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-responsive-xl font-semibold text-gray-900">
                {editingRecord ? 'Edit Record' : 'Create New Record'}
              </h3>
              <button
                onClick={handleCancelCreate}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Voice Recorder Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-responsive-lg font-medium text-gray-900 flex items-center">
                      <Mic className="w-5 h-5 mr-2" />
                      Voice Recording
                    </h4>
                    {(currentAudioBlob || editingRecord?.audio_file_path) && (
                      <span className="text-green-600 text-responsive-sm flex items-center">
                        <MicOff className="w-4 h-4 mr-1" />
                        Audio Ready
                      </span>
                    )}
                  </div>
                  
                  <VoiceRecorder
                    onRecordingComplete={handleRecordingComplete}
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    existingAudioUrl={editingRecord?.audio_file_path || null}
                    onRemoveAudio={handleRemoveAudio}
                  />
                </div>

                {/* Record Form Section */}
                <div className="space-y-6">
                  <h4 className="text-responsive-lg font-medium text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Record Details
                  </h4>
                  
                  <RecordForm
                    onSubmit={editingRecord ? handleUpdateRecord : handleCreateRecord}
                    initialData={editingRecord || undefined}
                    submitText={editingRecord ? 'Update Record' : 'Create Record'}
                    hasAudio={!!(currentAudioBlob || editingRecord?.audio_file_path)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Guide */}
      {showWelcomeGuide && (
        <WelcomeGuide
          onClose={closeWelcomeGuide}
          onStartRecording={handleStartCreate}
        />
      )}
    </div>
  );
};

export default DashboardPage;
