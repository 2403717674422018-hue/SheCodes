import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contributionTypes = [
  "Student Mentoring",
  "Project Guidance", 
  "Internship Support",
  "Research Paper Review",
  "Competition Preparation",
  "Workshop/Seminar",
  "Academic Event Organization",
  "Career Guidance",
  "Course Material Development",
  "Industry Collaboration",
  "Committee Work",
  "Curriculum Development",
  "Lab Setup & Maintenance",
  "Student Counseling",
  "Placement Activities",
  "Other"
];

export const VoiceAssistant = ({ isActive, onActiveChange, currentPage }) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState('idle');
  const recognitionRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        handleVoiceInput(transcript);
      };

      recognitionRef.current.onend = () => {
        if (isListening && voiceMode !== 'idle') {
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (e) {
              console.error('Recognition restart failed:', e);
            }
          }, 500);
        } else {
          stopListening();
        }
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          toast({
            title: "Voice Error",
            description: `Error: ${event.error}`,
            variant: "destructive"
          });
          stopListening();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, voiceMode]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const matchContributionType = (transcript) => {
    const lower = transcript.toLowerCase();
    
    for (const type of contributionTypes) {
      const keywords = type.toLowerCase().split(/[\s/]+/);
      if (keywords.some(kw => lower.includes(kw))) {
        if (window.updateEntryField) {
          window.updateEntryField('contributionType', type);
          toast({
            title: "Type Captured",
            description: type
          });
          setVoiceMode('reference');
          speak('What is the reference? Say skip if none');
        }
        return;
      }
    }
    
    speak('Type not recognized. Please try again');
  };

  const extractNumber = (text) => {
    const words = {
      'five': 5, 'ten': 10, 'fifteen': 15, 'twenty': 20, 'twenty five': 25,
      'thirty': 30, 'thirty five': 35, 'forty': 40, 'forty five': 45,
      'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
      'hundred': 100, 'one twenty': 120, 'two hours': 120, 'three hours': 180
    };

    const lower = text.toLowerCase();
    
    for (const [word, num] of Object.entries(words)) {
      if (lower.includes(word)) return num;
    }

    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  };

  const handleVoiceInput = (transcript) => {
    const lower = transcript.toLowerCase();

    if (lower.includes('skip')) {
      if (voiceMode === 'reference') {
        setVoiceMode('time');
        speak('How many minutes did you spend?');
      }
      return;
    }

    switch (voiceMode) {
      case 'type':
        matchContributionType(transcript);
        break;

      case 'reference':
        if (window.updateEntryField) {
          window.updateEntryField('reference', transcript);
          toast({
            title: "Reference Captured",
            description: transcript
          });
        }
        setVoiceMode('time');
        speak('How many minutes did you spend?');
        break;

      case 'time':
        const minutes = extractNumber(transcript);
        if (minutes && minutes >= 5 && minutes <= 480) {
          const rounded = Math.round(minutes / 5) * 5;
          if (window.updateEntryField) {
            window.updateEntryField('timeSpent', rounded.toString());
            toast({
              title: "Time Captured",
              description: `${rounded} minutes`
            });
          }
          setVoiceMode('description');
          speak('Please describe your contribution');
        } else {
          speak('Please say a number between 5 and 480 minutes');
        }
        break;

      case 'description':
        if (window.updateEntryField) {
          window.updateEntryField('description', transcript);
          toast({
            title: "Description Captured",
            description: "Entry complete! Click save to submit."
          });
        }
        setVoiceMode('idle');
        stopListening();
        speak('Entry complete. Click save to submit');
        break;

      default:
        break;
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Voice recognition not supported in your browser",
        variant: "destructive"
      });
      return;
    }

    if (currentPage !== 'new-entry') {
      toast({
        title: "Navigation Required",
        description: "Please go to New Entry page first",
        variant: "destructive"
      });
      return;
    }

    try {
      setVoiceMode('type');
      recognitionRef.current.start();
      setIsListening(true);
      onActiveChange(true);
      toast({
        title: "Voice Activated",
        description: "Listening... What type of contribution?"
      });
      speak('What type of contribution?');
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not start voice recognition",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Stop error:', e);
      }
    }
    setIsListening(false);
    setVoiceMode('idle');
    onActiveChange(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Button
      onClick={toggleVoice}
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-[0_0_30px_rgba(209,13,36,0.6)] hover:shadow-[0_0_50px_rgba(209,13,36,0.9)] transition-all duration-300 z-50 ${
        isListening 
          ? 'bg-gradient-to-br from-primary to-accent animate-pulse-glow' 
          : 'bg-gradient-to-br from-secondary to-accent'
      }`}
      size="icon"
    >
      {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
    </Button>
  );
};
