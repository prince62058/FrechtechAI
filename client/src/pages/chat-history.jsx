import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Clock, Search, Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

function ChatHistory() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ['/api/chat/threads', { limit: 50 }],
    queryFn: () => fetch('/api/chat/threads?limit=50').then(res => res.json()),
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['/api/chat/search', { q: searchQuery }],
    queryFn: () => fetch(`/api/chat/search?q=${encodeURIComponent(searchQuery)}`).then(res => res.json()),
    enabled: searchQuery.length > 2,
  });

  const displayThreads = searchQuery.length > 2 ? searchResults : threads;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Chat History</h1>
              <Badge variant="secondary">
                {threads.length} total
              </Badge>
            </div>
            
            <Button asChild>
              <Link href="/">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Link>
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="chat-search-input"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="space-y-4">
          {(isSearching && searchQuery.length > 2) ? (
            <div className="text-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Searching...</p>
            </div>
          ) : displayThreads.length > 0 ? (
            displayThreads.map((thread) => (
              <Card key={thread.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      <Link 
                        href={`/chat/${thread.id}`}
                        className="hover:text-primary transition-colors"
                        data-testid={`chat-thread-link-${thread.id}`}
                      >
                        {thread.title || 'Untitled Chat'}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-4">
                      <Clock className="h-4 w-4" />
                      {formatTimestamp(thread.updatedAt || thread.createdAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {thread.lastMessage && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {thread.lastMessage}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline">
                      {thread.messageCount || 0} messages
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/chat/${thread.id}`}>
                        View Chat
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : searchQuery.length > 2 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
              <p className="text-muted-foreground">
                No chat threads found matching "{searchQuery}".
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Chat History</h2>
              <p className="text-muted-foreground mb-4">
                You haven't started any chat conversations yet.
              </p>
              <Button asChild>
                <Link href="/">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Your First Chat
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ChatHistory;