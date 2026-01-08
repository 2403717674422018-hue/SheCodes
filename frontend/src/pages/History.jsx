import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mic, Keyboard, Sparkles } from "lucide-react";
import { EditEntryDialog } from "@/components/EditEntryDialog";

export const History = ({ contributions, onDelete, onEdit, onSummarize, summaryLoading }) => {
  const [editingEntry, setEditingEntry] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="stranger-title text-4xl mb-2 text-primary">Contribution History</h2>
          <p className="text-muted-foreground">Review and manage your logged activities</p>
        </div>
        
        {contributions.length > 0 && (
          <Button
            onClick={onSummarize}
            disabled={summaryLoading}
            className="bg-gradient-to-r from-secondary to-accent text-background font-stranger hover:opacity-90"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {summaryLoading ? 'Generating...' : 'AI Summary'}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {contributions.length === 0 ? (
          <Card className="bg-card/30 border-dashed border-2 border-border p-12 text-center">
            <p className="text-xl text-muted-foreground">No contributions logged yet</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Your logged activities will appear here</p>
          </Card>
        ) : (
          contributions.map((entry) => (
            <Card 
              key={entry._id}
              className="bg-card/50 backdrop-blur-sm border-l-4 border-primary p-6 hover:bg-card/70 transition-all duration-300 hover:shadow-[0_0_20px_rgba(209,13,36,0.3)]"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-primary">{entry.contribution_type}</h3>
                    <Badge variant={entry.input_mode === 'voice' ? 'default' : 'secondary'} className="uppercase text-xs">
                      {entry.input_mode === 'voice' ? (
                        <><Mic className="w-3 h-3 mr-1" /> Voice</>
                      ) : (
                        <><Keyboard className="w-3 h-3 mr-1" /> Text</>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <span>📅 {formatDate(entry.date)}</span>
                    <span>⏱️ {entry.time_spent} minutes ({(entry.time_spent / 60).toFixed(1)} hrs)</span>
                    {entry.reference && <span>👤 {entry.reference}</span>}
                  </div>
                </div>
              </div>

              <p className="text-foreground/90 leading-relaxed mb-4">{entry.description}</p>

              <div className="flex gap-3 pt-4 border-t border-border/50">
                <Button
                  onClick={() => setEditingEntry(entry)}
                  variant="outline"
                  size="sm"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-background"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(entry._id)}
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {editingEntry && (
        <EditEntryDialog
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSave={onEdit}
        />
      )}
    </div>
  );
};
