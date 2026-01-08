import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Save, RotateCcw } from "lucide-react";

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

export const NewEntry = ({ onSubmit, isListening }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    contributionType: "",
    reference: "",
    timeSpent: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.contributionType) newErrors.contributionType = "Contribution type is required";
    if (!formData.timeSpent) {
      newErrors.timeSpent = "Time spent is required";
    } else {
      const time = parseInt(formData.timeSpent);
      if (time < 5 || time > 480) {
        newErrors.timeSpent = "Time must be between 5-480 minutes";
      } else if (time % 5 !== 0) {
        newErrors.timeSpent = "Time must be a multiple of 5";
      }
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      contributionType: "",
      reference: "",
      timeSpent: "",
      description: ""
    });
    setErrors({});
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Expose updateField for voice assistant
  useEffect(() => {
    window.updateEntryField = updateField;
    return () => {
      delete window.updateEntryField;
    };
  }, []);

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="stranger-title text-4xl mb-2 text-primary">Log New Contribution</h2>
        <p className="text-muted-foreground">Document your academic activities</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className={`bg-muted/20 border-border focus:border-primary ${errors.date ? 'border-destructive' : ''}`}
              required
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contributionType" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Contribution Type *
            </Label>
            <Select 
              value={formData.contributionType} 
              onValueChange={(value) => updateField('contributionType', value)}
            >
              <SelectTrigger className={`bg-muted/20 border-border focus:border-primary ${errors.contributionType ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select contribution type..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {contributionTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-primary/20">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contributionType && <p className="text-xs text-destructive">{errors.contributionType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Reference (Optional)
            </Label>
            <Input
              id="reference"
              type="text"
              value={formData.reference}
              onChange={(e) => updateField('reference', e.target.value)}
              placeholder="e.g., Final year group, Workshop participants"
              maxLength={200}
              className="bg-muted/20 border-border focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">Student name, group, or context</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeSpent" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Time Spent (minutes) *
            </Label>
            <Input
              id="timeSpent"
              type="number"
              value={formData.timeSpent}
              onChange={(e) => updateField('timeSpent', e.target.value)}
              placeholder="Must be 5-480, multiple of 5"
              min="5"
              max="480"
              step="5"
              className={`bg-muted/20 border-border focus:border-primary ${errors.timeSpent ? 'border-destructive' : ''}`}
              required
            />
            {errors.timeSpent && <p className="text-xs text-destructive">{errors.timeSpent}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe your contribution (min 10 characters)"
              minLength={10}
              maxLength={1000}
              rows={5}
              className={`bg-muted/20 border-border focus:border-primary resize-none ${errors.description ? 'border-destructive' : ''}`}
              required
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            <p className="text-xs text-muted-foreground">{formData.description.length}/1000 characters</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity font-stranger text-lg py-6"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Contribution
            </Button>
            <Button 
              type="button"
              onClick={handleReset}
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-background font-stranger text-lg py-6 px-8"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Clear
            </Button>
          </div>
        </form>
      </Card>

      {isListening && (
        <Card className="mt-6 bg-primary/10 border-primary p-4 animate-pulse-glow">
          <p className="text-center text-primary font-semibold">
            🎤 Listening... Speak naturally to fill the form
          </p>
        </Card>
      )}
    </div>
  );
};
