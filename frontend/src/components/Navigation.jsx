import { Menu, X, Home, FileText, History as HistoryIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navigation = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'new-entry', label: 'New Entry', icon: FileText },
    { id: 'history', label: 'History', icon: HistoryIcon }
  ];

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b-2 border-primary shadow-[0_0_20px_rgba(209,13,36,0.3)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="stranger-title text-2xl md:text-3xl text-primary">
            TEACHERLOGGG
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  variant={currentPage === item.id ? 'default' : 'outline'}
                  className={`font-stranger uppercase tracking-wider ${
                    currentPage === item.id
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(209,13,36,0.6)]'
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-primary text-primary">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-primary w-72">
              <div className="flex flex-col gap-4 mt-8">
                <h2 className="stranger-title text-xl text-primary mb-4">Menu</h2>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      variant={currentPage === item.id ? 'default' : 'outline'}
                      className={`w-full justify-start font-stranger uppercase tracking-wider ${
                        currentPage === item.id
                          ? 'bg-primary text-white'
                          : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
