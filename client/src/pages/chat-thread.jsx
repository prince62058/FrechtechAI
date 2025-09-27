import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Clock, ExternalLink, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Link } from "wouter";

function ChatThread() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: thread, isLoading, error } = useQuery({
    queryKey: [`/api/chat/threads/${id}`],
    queryFn: () => fetch(`/api/chat/threads/${id}`).then(res => res.json()),
    enabled: !!id,
  });

  // Mutation for sending new messages
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText) => {
      const response = await fetch('/api/chat/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          threadId: id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Refresh the thread data
      queryClient.invalidateQueries([`/api/chat/threads/${id}`]);
      queryClient.invalidateQueries(['/api/chat/threads']);
      setMessage("");
      toast({
        title: "Message sent!",
        description: "Your message has been added to the conversation.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !thread) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Chat Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The chat thread you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

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
          
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">{thread.title}</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Created {formatTimestamp(thread.createdAt)}
            </div>
            {thread.updatedAt !== thread.createdAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {formatTimestamp(thread.updatedAt)}
              </div>
            )}
            <Badge variant="secondary">
              {thread.messages?.length || 0} messages
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {thread.messages?.map((message, index) => (
            <Card key={index} className={`${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {message.type === 'user' ? 'You' : 'FrenchTech AI'}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Sources ({message.sources.length})
                    </h4>
                    <div className="space-y-2">
                      {message.sources.map((source, sourceIndex) => (
                        <div key={sourceIndex} className="text-sm">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {source.title}
                          </a>
                          {source.snippet && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              {source.snippet}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {(!thread.messages || thread.messages.length === 0) && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Messages Yet</h2>
            <p className="text-muted-foreground">
              This chat thread doesn't have any messages yet.
            </p>
          </div>
        )}

        {/* Continue Conversation Input */}
        <Card className="mt-6 sticky bottom-6">
          <CardContent className="p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Continue the conversation..."
                className="flex-1"
                disabled={sendMessageMutation.isPending}
                data-testid="continue-chat-input"
              />
              <Button 
                type="submit" 
                disabled={!message.trim() || sendMessageMutation.isPending}
                data-testid="send-message-button"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default ChatThread;