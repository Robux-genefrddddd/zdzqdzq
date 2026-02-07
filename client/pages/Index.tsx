import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppSidebar } from "@/components/app-sidebar";

export default function Index() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [name, setName] = useState("Your Name");
  const [username, setUsername] = useState("@yourname");
  const [tempName, setTempName] = useState(name);
  const [tempUsername, setTempUsername] = useState(username);

  useEffect(() => {
    // Load profile from localStorage
    const savedName = localStorage.getItem("userProfileName");
    const savedUsername = localStorage.getItem("userProfileUsername");
    if (savedName) {
      setName(savedName);
      setTempName(savedName);
    }
    if (savedUsername) {
      setUsername(savedUsername);
      setTempUsername(savedUsername);
    }
  }, []);

  const handleOpenProfileDialog = () => {
    setTempName(name);
    setTempUsername(username);
    setIsProfileDialogOpen(true);
  };

  const handleSaveProfile = () => {
    setName(tempName);
    setUsername(tempUsername);
    localStorage.setItem("userProfileName", tempName);
    localStorage.setItem("userProfileUsername", tempUsername);
    setIsProfileDialogOpen(false);
  };

  const projects = [
    {
      id: 1,
      title: "Digital Experience",
      description: "Crafting seamless interactions across digital platforms",
      category: "Design & Development",
      year: "2024",
    },
    {
      id: 2,
      title: "Brand Identity",
      description: "Creating distinctive visual languages for modern brands",
      category: "Branding",
      year: "2024",
    },
    {
      id: 3,
      title: "Web Platform",
      description: "Building scalable, performant web applications",
      category: "Development",
      year: "2023",
    },
    {
      id: 4,
      title: "Mobile Innovation",
      description: "Designing intuitive experiences for mobile users",
      category: "Product Design",
      year: "2023",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar onEditProfile={handleOpenProfileDialog} userName={name} userUsername={username} />
      <SidebarInset>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header with Breadcrumbs */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm">Portfolio</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {/* Hero Section */}
            <section className="px-4 sm:px-8 py-24 sm:py-32 animate-fade-in">
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-widest text-muted-foreground font-light">
                    Welcome to my portfolio
                  </p>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight">
                    Crafting digital
                    <br />
                    <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                      excellence
                    </span>
                  </h1>
                </div>

                <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
                  I create beautiful, functional digital experiences with meticulous
                  attention to detail. Specializing in design, development, and digital
                  strategy for forward-thinking brands.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="px-7 py-3 rounded-lg bg-foreground text-background font-medium hover:shadow-soft-md transition-all duration-300">
                    View My Work
                  </button>
                  <button className="px-7 py-3 rounded-lg border border-border bg-background text-foreground font-medium hover:bg-secondary transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Hero Visual Element */}
              <div className="max-w-6xl mx-auto mt-20 sm:mt-28 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-background shadow-soft-lg overflow-hidden animate-slide-up">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">✨</div>
                      <p className="text-muted-foreground font-light">
                        Creative Solutions
                      </p>
                    </div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-background to-secondary shadow-soft-lg overflow-hidden animate-slide-up"
                  style={{ animationDelay: "100ms" }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🚀</div>
                      <p className="text-muted-foreground font-light">
                        Modern Technology
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Projects Section */}
            <section id="projects" className="px-4 sm:px-8 py-24 sm:py-32">
              <div className="max-w-6xl mx-auto space-y-16">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-widest text-muted-foreground font-light">
                    Featured Work
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-light">
                    Selected Projects
                  </h2>
                  <p className="text-muted-foreground font-light max-w-2xl">
                    A curated selection of recent projects that showcase my approach to
                    design and development.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project, index) => (
                    <div
                      key={project.id}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                      className="group cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-soft-lg transition-all duration-500">
                        <div className="space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-widest text-muted-foreground font-light">
                                {project.category}
                              </p>
                              <h3 className="text-xl font-light text-foreground group-hover:text-primary transition-colors duration-300">
                                {project.title}
                              </h3>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                              <ArrowUpRight className="w-4 h-4 text-foreground" />
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground font-light leading-relaxed">
                            {project.description}
                          </p>

                          <div className="pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-light">
                              {project.year}
                            </span>
                            <span className="text-xs font-light text-foreground">
                              View Project →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="px-4 sm:px-8 py-24 sm:py-32">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground font-light">
                      About Me
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-light">
                      Passionate about design and technology
                    </h2>
                  </div>

                  <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                    <p>
                      With over a decade of experience, I've had the privilege of
                      working with innovative brands to create digital products that
                      make a real impact.
                    </p>
                    <p>
                      My approach combines strategic thinking with meticulous
                      execution, ensuring every detail serves both aesthetic and
                      functional purposes.
                    </p>
                    <p>
                      When I'm not designing or coding, you'll find me exploring new
                      technologies, traveling, or enjoying the outdoors.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button className="px-7 py-3 rounded-lg bg-foreground text-background font-medium hover:shadow-soft-md transition-all duration-300">
                      Get In Touch
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 rounded-2xl bg-gradient-to-br from-secondary to-background shadow-soft-lg p-8 text-center">
                    <div className="text-5xl mb-3">🎯</div>
                    <h4 className="font-medium mb-2">Strategy & Planning</h4>
                    <p className="text-sm text-muted-foreground font-light">
                      Thoughtful approach to every project
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-background to-secondary shadow-soft-lg p-8 text-center">
                    <div className="text-4xl mb-3">✏️</div>
                    <h4 className="font-medium mb-2">Design</h4>
                    <p className="text-sm text-muted-foreground font-light">
                      Beautiful interfaces
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-secondary to-background shadow-soft-lg p-8 text-center">
                    <div className="text-4xl mb-3">⚙️</div>
                    <h4 className="font-medium mb-2">Development</h4>
                    <p className="text-sm text-muted-foreground font-light">
                      Robust solutions
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 sm:px-8 py-24 sm:py-32">
              <div className="max-w-6xl mx-auto">
                <div className="rounded-2xl bg-foreground text-background p-12 sm:p-16 text-center space-y-8 shadow-soft-lg">
                  <h2 className="text-4xl sm:text-5xl font-light">Ready to create something amazing?</h2>
                  <p className="text-lg font-light max-w-2xl mx-auto opacity-90">
                    Let's work together to bring your vision to life. I'm always excited
                    about new projects and opportunities.
                  </p>
                  <button className="px-8 py-3 rounded-lg bg-background text-foreground font-medium hover:bg-secondary transition-all duration-300">
                    Start a Conversation
                  </button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="px-4 sm:px-8 py-16 border-t border-border">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  <div className="space-y-4">
                    <h4 className="font-light text-foreground">Navigation</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground font-light">
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          Home
                        </a>
                      </li>
                      <li>
                        <a href="#projects" className="hover:text-foreground transition-colors duration-300">
                          Work
                        </a>
                      </li>
                      <li>
                        <a href="#about" className="hover:text-foreground transition-colors duration-300">
                          About
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-light text-foreground">Social</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground font-light">
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          Twitter
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          LinkedIn
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          GitHub
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-light text-foreground">Resources</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground font-light">
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          Blog
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          Case Studies
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-light text-foreground">Legal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground font-light">
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          Privacy
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-foreground transition-colors duration-300">
                          Terms
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border pt-8 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-light">
                    © 2024 Your Name. All rights reserved.
                  </p>
                  <p className="text-sm text-muted-foreground font-light">
                    Crafted with minimal aesthetics
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </SidebarInset>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="@username"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
