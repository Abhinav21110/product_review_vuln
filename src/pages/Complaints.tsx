import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Complaint {
  id: number;
  product_name: string;
  customer_name: string;
  complaint_text: string;
  status: string;
  created_at: string;
}

const Complaints = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintId, setComplaintId] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/complaints")
      .then(res => res.json())
      .then(setComplaints)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setComplaintId(id);
      handleViewComplaint(id);
    }
  }, [searchParams]);

  const handleViewComplaint = async (id: string) => {
    try {
      // VUL: intentional SQLi - boolean-based blind vulnerability
      const response = await fetch(`http://localhost:3000/api/complaints/${id}`);
      const data = await response.json();
      
      if (data.found) {
        setSelectedComplaint(data.complaint);
      } else {
        setSelectedComplaint(null);
      }
    } catch {
      setSelectedComplaint(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintId) {
      setSearchParams({ id: complaintId });
      handleViewComplaint(complaintId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Customer Complaints</h1>
          <p className="text-muted-foreground">Search and filter customer complaints</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search by Complaint ID</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter complaint ID..."
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
              />
              <Button type="submit">View</Button>
            </form>
          </CardContent>
        </Card>

        {selectedComplaint && (
          <Card className="mb-6 border-accent">
            <CardHeader>
              <CardTitle>Complaint #{selectedComplaint.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Product:</strong> {selectedComplaint.product_name}</p>
                <p><strong>Customer:</strong> {selectedComplaint.customer_name}</p>
                <p><strong>Status:</strong> <span className="text-warning">{selectedComplaint.status}</span></p>
                <p><strong>Date:</strong> {new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                <div className="mt-4">
                  <strong>Complaint:</strong>
                  <p className="mt-2 p-4 bg-muted rounded">{selectedComplaint.complaint_text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Complaints ({complaints.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <div 
                  key={complaint.id} 
                  className="border p-4 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setComplaintId(complaint.id.toString());
                    setSearchParams({ id: complaint.id.toString() });
                    handleViewComplaint(complaint.id.toString());
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold">#{complaint.id}</span>
                      <span className="mx-2">•</span>
                      <span>{complaint.product_name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {complaint.complaint_text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Complaints;
