import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
}

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("5");

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(console.error);

    loadReviews();
  }, [id]);

  const loadReviews = () => {
    fetch(`http://localhost:3000/api/products/${id}/reviews`)
      .then(res => res.json())
      .then(setReviews)
      .catch(console.error);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // VUL: intentional SQLi - search endpoint vulnerable to injection
    fetch(`http://localhost:3000/api/search?q=${searchQuery}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        if (data.length === 0) {
          toast.info("No reviews found");
        }
      })
      .catch(() => toast.error("Search failed"));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3000/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          reviewer_name: reviewerName, 
          review_text: reviewText,
          rating: parseInt(rating)
        }),
      });
      toast.success("Review submitted!");
      setReviewerName("");
      setReviewText("");
      setRating("5");
      loadReviews();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <p className="text-muted-foreground">{product.category}</p>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-primary">{product.price}</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.reviewer_name}</span>
                    <span className="text-warning">{"★".repeat(review.rating)}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{review.review_text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <Input
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select 
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Review</label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit">Submit Review</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProductDetail;
