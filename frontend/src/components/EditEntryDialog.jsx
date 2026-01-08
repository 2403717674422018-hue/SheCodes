import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

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

export const EditEntryDialog = ({ entry, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: entry.date.split('T')[0],
    contributionType: entry.contribution_type,
    reference: entry.reference || "",
    timeSpent: entry.time_spent,
    description: entry.description
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(entry._id, formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="stranger-title text-2xl text-primary">Edit Contribution</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Date
            </Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="bg-muted/20 border-border focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-type" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Contribution Type
            </Label>
            <Select 
              value={formData.contributionType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, contributionType: value }))}
            >
              <SelectTrigger className="bg-muted/20 border-border focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {contributionTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-primary/20">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-reference" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Reference
            </Label>
            <Input
              id="edit-reference"
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              className="bg-muted/20 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-time" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Time Spent (minutes)
            </Label>
            <Input
              id="edit-time"
              type="number"
              value={formData.timeSpent}
              onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: e.target.value }))}
              min="5"
              max="480"
              step="5"
              className="bg-muted/20 border-border focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-secondary uppercase tracking-wider text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={5}
              className="bg-muted/20 border-border focus:border-primary resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 font-stranger"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
