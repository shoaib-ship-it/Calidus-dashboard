import { useState } from "react";
import { useNavigation } from "@/App";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Calendar,
  Mail,
  MapPin,
  User,
  Package,
} from "lucide-react";
import {
  enquiries as allEnquiries,
  ratings as allRatings,
  currentBuyer,
  buyerStats,
  products,
  suppliers,
} from "@/data/mockData";

export const BuyerDashboard = () => {
  const { activeSection } = useNavigation();
  
  // State management
  const [buyer, setBuyer] = useState({ ...currentBuyer });
  const [enquiries, setEnquiries] = useState(allEnquiries.filter(e => e.buyerId === currentBuyer.id));
  const [ratings, setRatings] = useState(allRatings.filter(r => r.buyerId === currentBuyer.id));
  
  // Dialog states
  const [newEnquiryDialog, setNewEnquiryDialog] = useState(false);
  const [submitRatingDialog, setSubmitRatingDialog] = useState(false);
  const [editRatingDialog, setEditRatingDialog] = useState({ open: false, item: null });
  const [editProfileDialog, setEditProfileDialog] = useState(false);
  
  // Sheet states
  const [viewSheet, setViewSheet] = useState({ open: false, type: "", item: null });
  
  // Form states
  const [newEnquiry, setNewEnquiry] = useState({ productId: "", supplierId: "", message: "" });
  const [newRating, setNewRating] = useState({ productId: "", rating: 5, review: "" });
  const [editRatingForm, setEditRatingForm] = useState({ rating: 5, review: "" });
  const [profileForm, setProfileForm] = useState({ ...currentBuyer });

  // Calculate stats
  const stats = {
    totalEnquiries: enquiries.length,
    suppliersContacted: [...new Set(enquiries.map(e => e.supplierId))].length,
    pendingResponses: enquiries.filter(e => e.status === 'pending').length,
    submittedRatings: ratings.length
  };

  // Handlers
  const handleSendEnquiry = () => {
    if (newEnquiry.productId && newEnquiry.message.trim()) {
      const product = products.find(p => p.id === newEnquiry.productId);
      const supplier = suppliers.find(s => s.id === product?.supplierId);
      
      const newEnq = {
        id: `ENQ${String(enquiries.length + 100).padStart(3, '0')}`,
        productId: newEnquiry.productId,
        productName: product?.name || "Unknown Product",
        supplierId: product?.supplierId || "",
        supplierName: supplier?.name || "Unknown Supplier",
        buyerId: buyer.id,
        buyerName: buyer.name,
        buyerCompany: buyer.company,
        message: newEnquiry.message,
        date: new Date().toISOString().split('T')[0],
        status: "pending",
        reply: null
      };
      
      setEnquiries(prev => [newEnq, ...prev]);
      toast.success("Enquiry sent successfully");
      setNewEnquiry({ productId: "", supplierId: "", message: "" });
      setNewEnquiryDialog(false);
    }
  };

  const handleSubmitRating = () => {
    if (newRating.productId && newRating.review.trim()) {
      const product = products.find(p => p.id === newRating.productId);
      
      const newRat = {
        id: `RAT${String(ratings.length + 100).padStart(3, '0')}`,
        productId: newRating.productId,
        productName: product?.name || "Unknown Product",
        buyerId: buyer.id,
        buyerName: buyer.name,
        rating: newRating.rating,
        review: newRating.review,
        submissionDate: new Date().toISOString().split('T')[0],
        status: "pending"
      };
      
      setRatings(prev => [newRat, ...prev]);
      toast.success("Rating submitted successfully");
      setNewRating({ productId: "", rating: 5, review: "" });
      setSubmitRatingDialog(false);
    }
  };

  const handleEditRating = () => {
    if (editRatingDialog.item) {
      setRatings(prev => prev.map(r => 
        r.id === editRatingDialog.item.id 
          ? { ...r, rating: editRatingForm.rating, review: editRatingForm.review }
          : r
      ));
      toast.success("Rating updated successfully");
      setEditRatingDialog({ open: false, item: null });
    }
  };

  const handleSaveProfile = () => {
    setBuyer({ ...profileForm });
    toast.success("Profile updated successfully");
    setEditProfileDialog(false);
  };

  const openEditRating = (item) => {
    setEditRatingForm({ rating: item.rating, review: item.review });
    setEditRatingDialog({ open: true, item });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <BuyerOverview stats={stats} buyer={buyer} enquiries={enquiries} />;
      case "enquiries":
        return (
          <BuyerEnquiries 
            enquiries={enquiries}
            onView={(item) => setViewSheet({ open: true, type: "enquiry", item })}
            onNewEnquiry={() => setNewEnquiryDialog(true)}
          />
        );
      case "ratings":
        return (
          <BuyerRatings 
            ratings={ratings}
            onView={(item) => setViewSheet({ open: true, type: "rating", item })}
            onEdit={openEditRating}
            onAddRating={() => setSubmitRatingDialog(true)}
          />
        );
      case "profile":
        return (
          <BuyerProfile 
            buyer={buyer}
            onEdit={() => {
              setProfileForm({ ...buyer });
              setEditProfileDialog(true);
            }}
          />
        );
      default:
        return <BuyerOverview stats={stats} buyer={buyer} enquiries={enquiries} />;
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* New Enquiry Dialog */}
      <Dialog open={newEnquiryDialog} onOpenChange={setNewEnquiryDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Send New Enquiry</DialogTitle>
            <DialogDescription>Send an enquiry to a supplier about a specific product</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select Product *</Label>
              <Select value={newEnquiry.productId} onValueChange={(value) => setNewEnquiry({ ...newEnquiry, productId: value })}>
                <SelectTrigger className="bg-black/20 mt-1" data-testid="enquiry-product-select">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.filter(p => p.status === 'approved').map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {product.supplierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Message *</Label>
              <Textarea 
                value={newEnquiry.message}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, message: e.target.value })}
                placeholder="Type your enquiry message..."
                className="bg-black/20 mt-1 min-h-[150px]"
                data-testid="enquiry-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewEnquiryDialog(false)}>Cancel</Button>
            <Button onClick={handleSendEnquiry} className="gap-2" data-testid="send-enquiry-btn">
              <Send className="h-4 w-4" />
              Send Enquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Rating Dialog */}
      <Dialog open={submitRatingDialog} onOpenChange={setSubmitRatingDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Submit Rating</DialogTitle>
            <DialogDescription>Rate a product you have interacted with</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select Product *</Label>
              <Select value={newRating.productId} onValueChange={(value) => setNewRating({ ...newRating, productId: value })}>
                <SelectTrigger className="bg-black/20 mt-1" data-testid="rating-product-select">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.filter(p => p.status === 'approved').map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Your Rating *</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating({ ...newRating, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                    data-testid={`rating-star-${star}`}
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors ${
                        star <= newRating.rating 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-muted hover:text-amber-400/50"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-lg font-medium">{newRating.rating}.0</span>
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Your Review *</Label>
              <Textarea 
                value={newRating.review}
                onChange={(e) => setNewRating({ ...newRating, review: e.target.value })}
                placeholder="Write your review..."
                className="bg-black/20 mt-1 min-h-[120px]"
                data-testid="rating-review-textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitRatingDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitRating} data-testid="submit-rating-btn">Submit Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rating Dialog */}
      <Dialog open={editRatingDialog.open} onOpenChange={(open) => setEditRatingDialog({ ...editRatingDialog, open })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Edit Rating</DialogTitle>
            {editRatingDialog.item && (
              <DialogDescription>Editing review for {editRatingDialog.item.productName}</DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Your Rating</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRatingForm({ ...editRatingForm, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors ${
                        star <= editRatingForm.rating 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-muted hover:text-amber-400/50"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-lg font-medium">{editRatingForm.rating}.0</span>
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Your Review</Label>
              <Textarea 
                value={editRatingForm.review}
                onChange={(e) => setEditRatingForm({ ...editRatingForm, review: e.target.value })}
                className="bg-black/20 mt-1 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRatingDialog({ open: false, item: null })}>Cancel</Button>
            <Button onClick={handleEditRating} data-testid="save-rating-btn">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileDialog} onOpenChange={setEditProfileDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input 
                value={profileForm.name || ""}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="bg-black/20 mt-1"
                data-testid="edit-buyer-name"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Company</Label>
              <Input 
                value={profileForm.company || ""}
                onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                className="bg-black/20 mt-1"
                data-testid="edit-buyer-company"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input 
                value={profileForm.email || ""}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="bg-black/20 mt-1"
                data-testid="edit-buyer-email"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Country</Label>
              <Input 
                value={profileForm.country || ""}
                onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                className="bg-black/20 mt-1"
                data-testid="edit-buyer-country"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} data-testid="save-profile-btn">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Enquiry Sheet */}
      <Sheet open={viewSheet.open && viewSheet.type === "enquiry"} onOpenChange={(open) => setViewSheet({ ...viewSheet, open })}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Enquiry Details</SheetTitle>
          </SheetHeader>
          {viewSheet.item && (
            <div className="mt-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{viewSheet.item.productName}</h3>
                  <p className="text-sm text-muted-foreground">to {viewSheet.item.supplierName}</p>
                </div>
                <StatusBadge status={viewSheet.item.status} />
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Your Message</h4>
                <p className="text-sm leading-relaxed p-3 bg-muted/20 rounded-sm">{viewSheet.item.message}</p>
              </div>
              {viewSheet.item.reply && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Supplier's Reply</h4>
                    <div className="p-3 bg-primary/10 rounded-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{viewSheet.item.supplierName}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{viewSheet.item.reply}</p>
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Sent on {viewSheet.item.date}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* View Rating Sheet */}
      <Sheet open={viewSheet.open && viewSheet.type === "rating"} onOpenChange={(open) => setViewSheet({ ...viewSheet, open })}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Rating Details</SheetTitle>
          </SheetHeader>
          {viewSheet.item && (
            <div className="mt-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{viewSheet.item.productName}</h3>
                  <p className="text-sm text-muted-foreground">Your review</p>
                </div>
                <StatusBadge status={viewSheet.item.status} />
              </div>
              <div className="p-4 bg-muted/30 rounded-sm text-center">
                <RatingStars rating={viewSheet.item.rating} size="lg" />
                <p className="text-3xl font-bold font-['Barlow_Condensed'] mt-2">{viewSheet.item.rating}.0</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Your Review</h4>
                <p className="text-sm leading-relaxed">{viewSheet.item.review}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Submitted on {viewSheet.item.submissionDate}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

// Buyer Overview Section
const BuyerOverview = ({ stats, buyer, enquiries }) => {
  const recentEnquiries = enquiries.slice(0, 3);
  
  return (
    <div className="space-y-8" data-testid="buyer-overview">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">Buyer Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {buyer.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Enquiries" value={stats.totalEnquiries} icon={Inbox} trend="up" trendValue="+5" testId="stat-total-enquiries" />
        <StatCard title="Suppliers Contacted" value={stats.suppliersContacted} icon={Building2} testId="stat-suppliers-contacted" />
        <StatCard title="Pending Responses" value={stats.pendingResponses} icon={Clock} testId="stat-pending-responses" className="bg-amber-500/5 border-amber-500/20" />
        <StatCard title="Ratings Submitted" value={stats.submittedRatings} icon={Star} testId="stat-ratings-submitted" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Recent Enquiries</h3>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="dashboard-card-content">
            {recentEnquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No enquiries yet</p>
            ) : (
              <div className="space-y-4">
                {recentEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                      enquiry.status === 'replied' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                    }`}>
                      <Package className={`h-4 w-4 ${
                        enquiry.status === 'replied' ? 'text-emerald-400' : 'text-amber-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{enquiry.productName}</p>
                      <p className="text-xs text-muted-foreground">to {enquiry.supplierName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={enquiry.status} />
                        <span className="text-xs text-muted-foreground">{enquiry.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Buyer Enquiries Section
const BuyerEnquiries = ({ enquiries, onView, onNewEnquiry }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredEnquiries = statusFilter === "all" ? enquiries : enquiries.filter(e => e.status === statusFilter);

  const columns = [
    { key: "productName", label: "Product" },
    { key: "supplierName", label: "Supplier" },
    { key: "message", label: "Message", render: (value) => <p className="text-sm max-w-xs truncate">{value}</p> },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <ActionButtonGroup>
          <ActionButton icon={Eye} label="View Enquiry" testId={`view-enquiry-${row.id}`} onClick={() => onView(row)} />
        </ActionButtonGroup>
      )
    },
  ];

  return (
    <div className="space-y-6" data-testid="buyer-enquiries">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">My Enquiries</h1>
          <p className="text-sm text-muted-foreground">Track your enquiry history and responses</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-black/20" data-testid="enquiry-status-filter">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onNewEnquiry} className="gap-2" data-testid="new-enquiry-btn">
            <Plus className="h-4 w-4" />
            New Enquiry
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={filteredEnquiries} searchPlaceholder="Search enquiries..." searchKey="productName" pageSize={5} testId="buyer-enquiries-table" />
    </div>
  );
};

// Buyer Ratings Section
const BuyerRatings = ({ ratings, onView, onEdit, onAddRating }) => {
  return (
    <div className="space-y-6" data-testid="buyer-ratings">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">My Ratings</h1>
          <p className="text-sm text-muted-foreground">View and submit product ratings</p>
        </div>
        <Button onClick={onAddRating} className="gap-2" data-testid="add-rating-btn">
          <Plus className="h-4 w-4" />
          Submit Rating
        </Button>
      </div>

      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="dashboard-card">
            <div className="dashboard-card-content text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No ratings submitted yet</p>
              <Button onClick={onAddRating} className="gap-2" data-testid="submit-first-rating-btn">
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
                    <p className="text-xs text-muted-foreground">Submitted on {rating.submissionDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={rating.status} />
                    <RatingStars rating={rating.rating} size="sm" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{rating.review}</p>
                <div className="mt-4 pt-4 border-t border-border flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => onView(rating)} data-testid={`view-rating-${rating.id}`}>
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => onEdit(rating)} data-testid={`edit-rating-${rating.id}`}>
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
const BuyerProfile = ({ buyer, onEdit }) => {
  return (
    <div className="space-y-6" data-testid="buyer-profile">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">Profile Management</h1>
          <p className="text-sm text-muted-foreground">Update your contact information</p>
        </div>
        <Button onClick={onEdit} className="gap-2" data-testid="edit-buyer-profile-btn">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Personal Information</h3>
            </div>
            <div className="dashboard-card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Full Name</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{buyer.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Company</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{buyer.company}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{buyer.email}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Country</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{buyer.country}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                <span className="text-sm font-medium">{buyer.ratingsSubmitted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">{buyer.joinDate}</span>
              </div>
              <div className="flex justify-between items-center">
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
