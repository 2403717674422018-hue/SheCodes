import { useState, useEffect } from "react";
import axios from "axios";
import { LandingPage } from "@/pages/LandingPage";
import { Dashboard } from "@/pages/Dashboard";
import { NewEntry } from "@/pages/NewEntry";
import { History } from "@/pages/History";
import { Navigation } from "@/components/Navigation";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { SummaryDialog } from "@/components/SummaryDialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import "@/App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [contributions, setContributions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    hours: 0,
    text: 0,
    voice: 0,
    breakdown: {}
  });
  const [voiceActive, setVoiceActive] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (!showLanding) {
      loadContributions();
    }
  }, [showLanding]);

  const loadContributions = async () => {
    try {
      const response = await axios.get(`${API}/contributions`);
      setContributions(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error loading contributions:', error);
      toast.error('Failed to load contributions');
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const hours = data.reduce((sum, c) => sum + c.time_spent, 0) / 60;
    const text = data.filter(c => c.input_mode === 'text').length;
    const voice = data.filter(c => c.input_mode === 'voice').length;
    
    const breakdown = {};
    data.forEach(c => {
      breakdown[c.contribution_type] = (breakdown[c.contribution_type] || 0) + c.time_spent;
    });

    setStats({ total, hours, text, voice, breakdown });
  };

  const handleNewEntry = async (formData) => {
    try {
      const payload = {
        date: formData.date,
        contribution_type: formData.contributionType,
        reference: formData.reference || null,
        time_spent: parseInt(formData.timeSpent),
        description: formData.description,
        input_mode: voiceActive ? 'voice' : 'text'
      };

      await axios.post(`${API}/contributions`, payload);
      toast.success('Contribution saved successfully!');
      loadContributions();
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Error saving contribution:', error);
      toast.error('Failed to save contribution');
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      const payload = {
        date: formData.date,
        contribution_type: formData.contributionType,
        reference: formData.reference || null,
        time_spent: parseInt(formData.timeSpent),
        description: formData.description
      };

      await axios.put(`${API}/contributions/${id}`, payload);
      toast.success('Contribution updated successfully!');
      loadContributions();
    } catch (error) {
      console.error('Error updating contribution:', error);
      toast.error('Failed to update contribution');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contribution?')) {
      return;
    }

    try {
      await axios.delete(`${API}/contributions/${id}`);
      toast.success('Contribution deleted successfully!');
      loadContributions();
    } catch (error) {
      console.error('Error deleting contribution:', error);
      toast.error('Failed to delete contribution');
    }
  };

  const handleSummarize = async () => {
    if (contributions.length === 0) {
      toast.error('No contributions to summarize');
      return;
    }

    setSummaryLoading(true);
    try {
      const response = await axios.post(`${API}/summarize`, {
        contributions: contributions
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-background vhs-noise scanline-bg">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {currentPage === 'dashboard' && <Dashboard stats={stats} />}
        {currentPage === 'new-entry' && (
          <NewEntry onSubmit={handleNewEntry} isListening={voiceActive} />
        )}
        {currentPage === 'history' && (
          <History
            contributions={contributions}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onSummarize={handleSummarize}
            summaryLoading={summaryLoading}
          />
        )}
      </main>

      <VoiceAssistant
        isActive={voiceActive}
        onActiveChange={setVoiceActive}
        currentPage={currentPage}
      />

      {summary && (
        <SummaryDialog
          summary={summary}
          onClose={() => setSummary(null)}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
