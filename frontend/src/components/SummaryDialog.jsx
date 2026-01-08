import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

export const SummaryDialog = ({ summary, onClose }) => {
  return (
    <Dialog open={!!summary} onOpenChange={onClose}>
      <DialogContent className="bg-card border-primary max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="stranger-title text-3xl text-primary flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            AI Summary Report
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Generated summary of your contributions for appraisals and accreditation
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-foreground whitespace-pre-wrap leading-relaxed">
            {summary}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 font-stranger"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
