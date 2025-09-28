import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Compass, 
  Grid3X3, 
  Bookmark, 
  Plus, 
  DollarSign,
  Plane,
  ShoppingBag,
  GraduationCap,
  MessageSquare,
  Clock,
  X
} from "lucide-react";

export default function MobileSidebar({ onClose }) {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Fetch recent chat threads
  const { data: chatThreads = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ['/api/chat/threads'],
    queryFn: () => fetch('/api/chat/threads').then(res => res.json()),
    enabled: true, // Always fetch threads, even for anonymous users
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isActive = (href) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const mainNavItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Spaces", href: "/spaces", icon: Grid3X3 },
    ...(isAuthenticated ? [{ label: "Library", href: "/library", icon: Bookmark }] : []),
  ];

  const categories = [
    { label: "Finance", href: "/finance", icon: DollarSign },
    { label: "Travel", href: "/travel", icon: Plane },
    { label: "Shopping", href: "/shopping", icon: ShoppingBag },
    { label: "Academic", href: "/academic", icon: GraduationCap },
  ];

  const handleItemClick = () => {
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img src="/ft-logo.png" alt="FrenchTech AI" className="w-8 h-8 rounded-lg object-contain" />
          </div>
          <span className="text-lg font-bold gradient-text">FrenchTech AI</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="p-4 space-y-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={handleItemClick}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    active 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
          
          <Link href="/">
            <div
              onClick={handleItemClick}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-accent text-foreground transition-colors cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create a Thread</span>
            </div>
          </Link>
        </div>

        {/* Categories */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = isActive(category.href);
              
              return (
                <Link key={category.href} href={category.href}>
                  <div
                    onClick={handleItemClick}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      active 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{category.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Chat History Section */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Recent Chats
          </h3>
          <div className="space-y-2">
            {isLoadingChats ? (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : chatThreads.length > 0 ? (
              chatThreads.slice(0, 5).map((thread) => (
                <Link key={thread.id} href={`/chat/${thread.id}`}>
                  <div
                    onClick={handleItemClick}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-accent text-foreground transition-colors cursor-pointer"
                    data-testid={`mobile-chat-thread-${thread.id}`}
                  >
                    <MessageSquare className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium truncate" title={thread.title}>
                      {thread.title || 'Untitled Chat'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No chat history yet
              </div>
            )}
            {chatThreads.length > 5 && (
              <Link href="/chat/history">
                <div
                  onClick={handleItemClick}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-accent text-foreground transition-colors cursor-pointer"
                  data-testid="mobile-view-all-chats"
                >
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">View All Chats</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="px-3 py-2 bg-accent/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium truncate">
                {user?.firstName || user?.email}
              </p>
            </div>
            <button
              onClick={() => {
                window.location.href = "/api/logout";
                onClose();
              }}
              className="w-full flex items-center justify-center px-3 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => {
                window.location.href = "/api/login";
                onClose();
              }}
              className="w-full flex items-center justify-center px-3 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                window.location.href = "/api/login";
                onClose();
              }}
              className="w-full flex items-center justify-center px-3 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Get Pro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}