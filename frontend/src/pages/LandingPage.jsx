import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileText, Clock, BarChart3, Sparkles } from "lucide-react";

export const LandingPage = ({ onEnter }) => {
  return (
    <div className="min-h-screen relative overflow-hidden vhs-noise">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(2,8%,3%)] via-[hsl(320,20%,8%)] to-[hsl(2,8%,3%)]"></div>
        
        {/* Scanlines */}
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scanline" style={{top: '20%'}}></div>
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scanline" style={{top: '60%', animationDelay: '2s'}}></div>
        
        {/* Vertical lines */}
        <div className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" style={{left: '30%'}}></div>
        <div className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" style={{left: '70%'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo */}
          <h1 className="stranger-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 text-primary animate-glitch">
            TEACHERLOGGG
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-secondary uppercase tracking-widest mb-8 font-semibold">
            Track Invisible Academic Work
          </p>

          {/* Introduction */}
          <div className="bg-card/50 backdrop-blur-sm neon-border rounded-lg p-8 md:p-12 mb-12 text-left max-w-4xl mx-auto">
            <div className="space-y-6 text-base md:text-lg text-foreground/90 leading-relaxed">
              <p>
                In academic institutions, teachers contribute <span className="text-primary font-semibold">far beyond lectures and evaluations</span>. This includes mentoring students, guiding projects, supporting internships, reviewing papers, preparing students for competitions, handling workshops, organizing academic events, and providing career guidance.
              </p>
              
              <div className="bg-primary/10 border-l-4 border-primary pl-6 py-4 my-6">
                <p className="text-primary font-semibold">
                  These contributions are <span className="text-lg">rarely documented</span>, difficult to recall during appraisals, and undervalued during accreditation processes (NAAC / NBA).
                </p>
              </div>
              
              <p>
                TeacherLoggg provides a <span className="text-secondary font-semibold">simple, real-time mechanism</span> to record these micro-contributions as they occur, without adding administrative burden. Capture your impact with voice or text input, track your time, and generate reports for appraisals and accreditation.
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(209,13,36,0.4)]">
              <FileText className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Easy Logging</h3>
              <p className="text-sm text-muted-foreground">Voice or text input for quick contribution tracking</p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(209,13,36,0.4)]">
              <Clock className="w-12 h-12 text-secondary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Time Tracking</h3>
              <p className="text-sm text-muted-foreground">Automatic time calculation and categorization</p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(209,13,36,0.4)]">
              <BarChart3 className="w-12 h-12 text-accent mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Reports</h3>
              <p className="text-sm text-muted-foreground">AI-powered summaries for appraisals</p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(209,13,36,0.4)]">
              <Sparkles className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Accreditation Ready</h3>
              <p className="text-sm text-muted-foreground">NAAC/NBA compliant documentation</p>
            </Card>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onEnter}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-white font-stranger text-xl md:text-2xl px-12 py-8 rounded-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(209,13,36,0.6)] hover:shadow-[0_0_50px_rgba(209,13,36,0.9)] uppercase tracking-widest group"
          >
            Enter Application
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>

          {/* Purpose Footer */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <h3 className="text-xl font-stranger text-secondary uppercase tracking-wider mb-4">Purpose</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Empower educators to showcase their complete academic contributions, ensure proper recognition during appraisals, and streamline accreditation documentation processes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
