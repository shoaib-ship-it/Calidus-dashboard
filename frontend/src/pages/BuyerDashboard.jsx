import { useState } from "react";
import { useNavigation } from "@/App";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { ActionButton, ActionButtonGroup } from "@/components/shared/ActionButton";
import { RatingStars } from "@/components/shared/RatingStars";
import {
  Inbox,
  Building2,
  Clock,
  Star,
  Eye,
  MessageSquare,
  Send,
  UserCircle,
  Edit,
  Plus,
} from "lucide-react";
import {
  enquiries as allEnquiries,
  ratings as allRatings,
  currentBuyer,
  buyerStats,
  products,
} from "@/data/mockData";

export const BuyerDashboard = () => {
  const { activeSection } = useNavigation();
  const [enquiries] = useState(
    allEnquiries.filter(e => e.buyerId === currentBuyer.id)
  );
  const [ratings, setRatings] = useState(
    allRatings.filter(r => r.buyerId === currentBuyer.id)
  );
  const [newEnquiryOpen, setNewEnquiryOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleSendEnquiry = () => {
    toast.success("Enquiry sent successfully (simulated)");
    setNewEnquiryOpen(false);
  };

  const handleSubmitRating = () => {
    if (selectedProduct) {
      const newRatingObj = {
        id: `RAT${String(ratings.length + 10).padStart(3, '0')}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        buyerId: currentBuyer.id,
        buyerName: currentBuyer.name,
        rating: newRating,
        review: reviewText,
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      setRatings(prev => [...prev, newRatingObj]);
      toast.success("Rating submitted successfully");
    }
    setRatingDialogOpen(false);
    setSelectedProduct(null);
    setNewRating(5);
    setReviewText("");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <BuyerOverview stats={buyerStats} buyer={currentBuyer} />;
      case "enquiries":
        return (
          <BuyerEnquiries 
            enquiries={enquiries}
            onNewEnquiry={() => setNewEnquiryOpen(true)}
          />
        );
      case "ratings":
        return (
          <BuyerRatings 
            ratings={ratings}
            onAddRating={(product) => {
              setSelectedProduct(product);
              setRatingDialogOpen(true);
            }}
            products={products}
          />
        );
      case "profile":
        return <BuyerProfile buyer={currentBuyer} />;
      default:
        return <BuyerOverview stats={buyerStats} buyer={currentBuyer} />;
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* New Enquiry Dialog */}
      <Dialog open={newEnquiryOpen} onOpenChange={setNewEnquiryOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">
              Send New Enquiry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Select Product
              </label>
              <Input placeholder="Search products..." className="bg-black/20" data-testid="enquiry-product-search" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Message
              </label>
              <Textarea 
                placeholder="Type your enquiry message..." 
                className="bg-black/20 min-h-[120px]"
                data-testid="enquiry-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewEnquiryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEnquiry} className="gap-2" data-testid="send-enquiry-btn">
              <Send className="h-4 w-4" />
              Send Enquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">
              Submit Rating
            </DialogTitle>
            {selectedProduct && (
              <DialogDescription>
                Rating for {selectedProduct.name}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none"
                    data-testid={`rating-star-${star}`}
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors ${
                        star <= newRating 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-muted hover:text-amber-400/50"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-lg font-medium">{newRating}.0</span>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Your Review
              </label>
              <Textarea 
                placeholder="Write your review..." 
                className="bg-black/20 min-h-[120px]"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                data-testid="rating-review-textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRating} data-testid="submit-rating-btn">
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Buyer Overview Section
const BuyerOverview = ({ stats, buyer }) => {
  return (
    <div className="space-y-8" data-testid="buyer-overview">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
          Buyer Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {buyer.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enquiries"
          value={stats.totalEnquiries}
          icon={Inbox}
          trend="up"
          trendValue="+5"
          testId="stat-total-enquiries"
        />
        <StatCard
          title="Suppliers Contacted"
          value={stats.suppliersContacted}
          icon={Building2}
          testId="stat-suppliers-contacted"
        />
        <StatCard
          title="Pending Responses"
          value={stats.pendingResponses}
          icon={Clock}
          testId="stat-pending-responses"
          className="bg-amber-500/5 border-amber-500/20"
        />
        <StatCard
          title="Ratings Submitted"
          value={stats.submittedRatings}
          icon={Star}
          testId="stat-ratings-submitted"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Your Profile</h3>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="dashboard-card-content space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-sm bg-primary/20 flex items-center justify-center">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{buyer.name}</h4>
                <p className="text-sm text-muted-foreground">{buyer.company}</p>
                <p className="text-xs text-muted-foreground">{buyer.country}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{buyer.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium">{buyer.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Recent Activity</h3>
          </div>
          <div className="dashboard-card-content">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-sm bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Enquiry sent</p>
                  <p className="text-xs text-muted-foreground">UAV Propulsion System MK-V</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-sm bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Rating submitted</p>
                  <p className="text-xs text-muted-foreground">Radar Signal Processing Unit</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-sm bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Inbox className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Response received</p>
                  <p className="text-xs text-muted-foreground">From Orion Defense Systems</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Buyer Enquiries Section
const BuyerEnquiries = ({ enquiries, onNewEnquiry }) => {
  const columns = [
    { key: "productName", label: "Product" },
    { key: "supplierName", label: "Supplier" },
    { 
      key: "message", 
      label: "Message",
      render: (value) => (
        <p className="text-sm max-w-xs truncate">{value}</p>
      )
    },
    { key: "date", label: "Date" },
    { 
      key: "status", 
      label: "Status",
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <ActionButtonGroup>
          <ActionButton 
            icon={Eye} 
            label="View Enquiry" 
            testId={`view-enquiry-${row.id}`}
            onClick={() => toast.info("Viewing enquiry details")}
          />
        </ActionButtonGroup>
      )
    },
  ];

  return (
    <div className="space-y-6" data-testid="buyer-enquiries">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
            My Enquiries
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your enquiry history and responses
          </p>
        </div>
        <Button onClick={onNewEnquiry} className="gap-2" data-testid="new-enquiry-btn">
          <Plus className="h-4 w-4" />
          New Enquiry
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={enquiries}
        searchPlaceholder="Search enquiries..."
        searchKey="productName"
        pageSize={5}
        testId="buyer-enquiries-table"
      />
    </div>
  );
};

// Buyer Ratings Section
const BuyerRatings = ({ ratings, onAddRating, products }) => {
  return (
    <div className="space-y-6" data-testid="buyer-ratings">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
            My Ratings
          </h1>
          <p className="text-sm text-muted-foreground">
            View and submit product ratings
          </p>
        </div>
        <Button 
          onClick={() => onAddRating(products[0])} 
          className="gap-2"
          data-testid="add-rating-btn"
        >
          <Plus className="h-4 w-4" />
          Submit Rating
        </Button>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="dashboard-card">
            <div className="dashboard-card-content text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No ratings submitted yet</p>
              <Button 
                className="mt-4 gap-2"
                onClick={() => onAddRating(products[0])}
                data-testid="submit-first-rating-btn"
              >
                <Plus className="h-4 w-4" />
                Submit Your First Rating
              </Button>
            </div>
          </div>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="dashboard-card" data-testid={`rating-card-${rating.id}`}>
              <div className="dashboard-card-content">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{rating.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {rating.submissionDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={rating.status} />
                    <RatingStars rating={rating.rating} size="sm" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{rating.review}</p>
                <div className="mt-4 pt-4 border-t border-border flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    data-testid={`edit-rating-${rating.id}`}
                    onClick={() => toast.info("Edit rating")}
                  >
                    <Edit className="h-3 w-3" />
                    Edit Rating
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Buyer Profile Section
const BuyerProfile = ({ buyer }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6" data-testid="buyer-profile">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
            Profile Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Update your contact information
          </p>
        </div>
        <Button 
          onClick={() => {
            if (isEditing) {
              toast.success("Profile updated successfully (simulated)");
            }
            setIsEditing(!isEditing);
          }}
          className="gap-2"
          data-testid="edit-buyer-profile-btn"
        >
          <Edit className="h-4 w-4" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Personal Information</h3>
            </div>
            <div className="dashboard-card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input 
                    value={buyer.name} 
                    disabled={!isEditing}
                    className="bg-black/20"
                    data-testid="buyer-name-input"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Company
                  </label>
                  <Input 
                    value={buyer.company} 
                    disabled={!isEditing}
                    className="bg-black/20"
                    data-testid="buyer-company-input"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input 
                    value={buyer.email} 
                    disabled={!isEditing}
                    className="bg-black/20"
                    data-testid="buyer-email-input"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Country
                  </label>
                  <Input 
                    value={buyer.country} 
                    disabled={!isEditing}
                    className="bg-black/20"
                    data-testid="buyer-country-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Account Stats</h3>
            </div>
            <div className="dashboard-card-content space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Enquiries</span>
                <span className="text-sm font-medium">{buyer.enquiriesSent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ratings Submitted</span>
                <span className="text-sm font-medium">{buyer.ratingsSubmitted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">{buyer.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={buyer.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
