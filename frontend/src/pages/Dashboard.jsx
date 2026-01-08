import { Card } from "@/components/ui/card";
import { FileText, Clock, Mic, Keyboard } from "lucide-react";

export const Dashboard = ({ stats }) => {
  const breakdown = stats.breakdown || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="stranger-title text-4xl mb-2 text-primary">Dashboard</h2>
        <p className="text-muted-foreground">Your contribution overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(209,13,36,0.4)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm uppercase tracking-wider text-muted-foreground">Total Contributions</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="text-4xl font-stranger text-primary">{stats.total || 0}</div>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30 p-6 hover:border-secondary transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm uppercase tracking-wider text-muted-foreground">Total Hours</span>
            <Clock className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-4xl font-stranger text-secondary">{stats.hours ? stats.hours.toFixed(1) : '0.0'}</div>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30 p-6 hover:border-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,46,159,0.4)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm uppercase tracking-wider text-muted-foreground">Text Entries</span>
            <Keyboard className="w-5 h-5 text-accent" />
          </div>
          <div className="text-4xl font-stranger text-accent">{stats.text || 0}</div>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30 p-6 hover:border-secondary transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm uppercase tracking-wider text-muted-foreground">Voice Entries</span>
            <Mic className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-4xl font-stranger text-secondary">{stats.voice || 0}</div>
        </Card>
      </div>

      {/* Breakdown by Category */}
      {Object.keys(breakdown).length > 0 && (
        <div className="mt-12">
          <h3 className="stranger-title text-2xl mb-6 text-secondary">Time by Category</h3>
          <div className="space-y-4">
            {Object.entries(breakdown).map(([type, minutes]) => (
              <Card 
                key={type}
                className="bg-card/50 backdrop-blur-sm border-l-4 border-primary p-6 hover:bg-card/70 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-foreground">{type}</h4>
                  <div className="text-right">
                    <div className="text-2xl font-stranger text-primary">{minutes} min</div>
                    <div className="text-sm text-muted-foreground">({(minutes / 60).toFixed(1)} hours)</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {Object.keys(breakdown).length === 0 && stats.total === 0 && (
        <Card className="bg-card/30 border-dashed border-2 border-border p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-xl text-muted-foreground">No contributions logged yet</p>
          <p className="text-sm text-muted-foreground/70 mt-2">Start by creating a new entry!</p>
        </Card>
      )}
    </div>
  );
};
