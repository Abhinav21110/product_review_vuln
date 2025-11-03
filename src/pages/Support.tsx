import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Support = () => {
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [noteId, setNoteId] = useState("");
  const [noteResult, setNoteResult] = useState("");

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // VUL: intentional second-order SQLi - ticket data is stored and later used unsafely
      await fetch("http://localhost:3000/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: ticketTitle, 
          body: ticketBody 
        }),
      });
      toast.success("Support ticket submitted! We'll review it shortly.");
      setTicketTitle("");
      setTicketBody("");
    } catch {
      toast.error("Failed to submit ticket");
    }
  };

  const handleSearchNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // VUL: This endpoint triggers the second-order SQLi
      const response = await fetch(`http://localhost:3000/api/support/legacy-note/${noteId}`);
      const data = await response.json();
      
      if (data.found) {
        setNoteResult(`Found note: ${data.content}`);
      } else {
        setNoteResult("No legacy note found with that ID");
      }
    } catch {
      setNoteResult("Error searching legacy notes");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
          <p className="text-muted-foreground">Submit tickets and access legacy support notes</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ticket Title</label>
                  <Input
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Details</label>
                  <Textarea
                    value={ticketBody}
                    onChange={(e) => setTicketBody(e.target.value)}
                    rows={6}
                    placeholder="Provide detailed information about your issue"
                    required
                  />
                </div>
                <Button type="submit">Submit Ticket</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legacy Support Notes (Internal)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Search our legacy support database for historical reference notes
              </p>
              <form onSubmit={handleSearchNote} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={noteId}
                    onChange={(e) => setNoteId(e.target.value)}
                    placeholder="Enter note ID (try 1, 2, 3...)"
                  />
                  <Button type="submit">Search</Button>
                </div>
                {noteResult && (
                  <div className="p-4 bg-muted rounded">
                    <p className="text-sm font-mono">{noteResult}</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Support Hours</h3>
              <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
              <p className="text-sm text-muted-foreground">Response time: 24-48 hours</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Support;
