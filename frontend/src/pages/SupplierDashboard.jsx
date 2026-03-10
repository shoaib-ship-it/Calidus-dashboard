import { useState } from "react";
import { useNavigation } from "@/App";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  Eye,
  Package,
  Star,
  Inbox,
  Building2,
  Edit,
  Trash2,
  Plus,
  Upload,
  FileText,
  MessageSquare,
  Send,
  Award,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  products as allProducts,
  enquiries as allEnquiries,
  ratings as allRatings,
  currentSupplier,
  supplierStats,
} from "@/data/mockData";

export const SupplierDashboard = () => {
  const { activeSection } = useNavigation();
  const [products, setProducts] = useState(
    allProducts.filter(p => p.supplierId === currentSupplier.id)
  );
  const [enquiries] = useState(
    allEnquiries.filter(e => e.supplierId === currentSupplier.id)
  );
  const [ratings] = useState(
    allRatings.filter(r => 
      products.some(p => p.id === r.productId)
    )
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState({ type: "", item: null });
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Action handlers
  const handleAction = (type, item) => {
    setDialogAction({ type, item });
    setDialogOpen(true);
  };

  const confirmAction = () => {
    const { type, item } = dialogAction;
    
    switch (type) {
      case "delete-product":
        setProducts(prev => prev.filter(p => p.id !== item.id));
        toast.success(`Product "${item.name}" deleted`);
        break;
      default:
        break;
    }
    
    setDialogOpen(false);
  };

  const handleReply = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setReplyText("");
    setReplyDialogOpen(true);
  };

  const sendReply = () => {
    toast.success("Reply sent successfully");
    setReplyDialogOpen(false);
    setSelectedEnquiry(null);
    setReplyText("");
  };

  const handleAddProduct = () => {
    toast.success("Product added successfully (simulated)");
    setAddProductOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <SupplierOverview stats={supplierStats} supplier={currentSupplier} />;
      case "profile":
        return <CompanyProfile supplier={currentSupplier} />;
      case "products":
        return (
          <SupplierProductManagement 
            products={products} 
            onAction={handleAction}
            onAddProduct={() => setAddProductOpen(true)}
          />
        );
      case "enquiries":
        return (
          <SupplierEnquiries 
            enquiries={enquiries} 
            onReply={handleReply}
          />
        );
      case "ratings":
        return <SupplierRatings ratings={ratings} supplier={currentSupplier} />;
      default:
        return <SupplierOverview stats={supplierStats} supplier={currentSupplier} />;
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">
              Confirm Action
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {dialogAction.type.replace("-", " ")}
              {dialogAction.item?.name ? ` "${dialogAction.item.name}"` : ""}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Product Name
              </label>
              <Input placeholder="Enter product name" className="bg-black/20" data-testid="add-product-name" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Category
              </label>
              <Input placeholder="Select category" className="bg-black/20" data-testid="add-product-category" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Description
              </label>
              <Textarea placeholder="Enter product description" className="bg-black/20" data-testid="add-product-description" />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 gap-2">
                <Upload className="h-4 w-4" />
                Upload Images
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Upload Datasheet
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProductOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} data-testid="add-product-submit-btn">
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">
              Reply to Enquiry
            </DialogTitle>
            {selectedEnquiry && (
              <DialogDescription>
                Replying to {selectedEnquiry.buyerName} regarding {selectedEnquiry.productName}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedEnquiry && (
              <div className="p-3 bg-muted/30 rounded-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Original Message
                </p>
                <p className="text-sm">{selectedEnquiry.message}</p>
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Your Reply
              </label>
              <Textarea 
                placeholder="Type your reply..." 
                className="bg-black/20 min-h-[120px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                data-testid="enquiry-reply-textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendReply} className="gap-2" data-testid="send-reply-btn">
              <Send className="h-4 w-4" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Supplier Overview Section
const SupplierOverview = ({ stats, supplier }) => {
  return (
    <div className="space-y-8" data-testid="supplier-overview">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
          Supplier Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {supplier.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Profile Views"
          value={stats.profileViews}
          icon={Eye}
          trend="up"
          trendValue="+18%"
          testId="stat-profile-views"
        />
        <StatCard
          title="Total Enquiries"
          value={stats.totalEnquiries}
          icon={Inbox}
          trend="up"
          trendValue="+12%"
          testId="stat-total-enquiries"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          icon={Package}
          testId="stat-active-products"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon={Star}
          testId="stat-average-rating"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingProductApprovals}
          icon={Clock}
          testId="stat-pending-approvals"
          className="bg-amber-500/5 border-amber-500/20"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Company Overview</h3>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="dashboard-card-content space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-sm bg-primary/20 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{supplier.name}</h4>
                <p className="text-sm text-muted-foreground">{supplier.type} • {supplier.country}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Certifications
              </p>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Performance Metrics</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="dashboard-card-content space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Profile Completion</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Product Quality Score</span>
                <span className="text-sm font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-medium">Verified Supplier</span>
              </div>
              <RatingStars rating={supplier.rating} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Company Profile Section
const CompanyProfile = ({ supplier }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6" data-testid="company-profile">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
            Company Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your company information
          </p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
          data-testid="edit-profile-btn"
        >
          <Edit className="h-4 w-4" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Company Information</h3>
            </div>
            <div className="dashboard-card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Company Name
                  </label>
                  <Input 
                    value={supplier.name} 
                    disabled={!isEditing}
                    className="bg-black/20"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Supplier Type
                  </label>
                  <Input 
                    value={supplier.type} 
                    disabled={!isEditing}
                    className="bg-black/20"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Country
                  </label>
                  <Input 
                    value={supplier.country} 
                    disabled={!isEditing}
                    className="bg-black/20"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input 
                    value={supplier.email} 
                    disabled={!isEditing}
                    className="bg-black/20"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Phone
                  </label>
                  <Input 
                    value={supplier.phone} 
                    disabled={!isEditing}
                    className="bg-black/20"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Member Since
                  </label>
                  <Input 
                    value={supplier.joinDate} 
                    disabled
                    className="bg-black/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Certifications</h3>
              {isEditing && (
                <Button variant="ghost" size="sm" className="gap-1" data-testid="add-certification-btn">
                  <Plus className="h-3 w-3" />
                  Add
                </Button>
              )}
            </div>
            <div className="dashboard-card-content">
              <div className="flex flex-wrap gap-3">
                {supplier.certifications.map((cert, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-sm"
                  >
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{cert}</span>
                    {isEditing && (
                      <button className="text-muted-foreground hover:text-red-400">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Profile Completion</h3>
            </div>
            <div className="dashboard-card-content">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold font-['Barlow_Condensed']">85%</span>
              </div>
              <Progress value={85} className="h-2 mb-4" />
              <p className="text-xs text-muted-foreground">
                Complete your profile to increase visibility
              </p>
            </div>
          </div>

          {/* Documents */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Documents</h3>
            </div>
            <div className="dashboard-card-content space-y-3">
              <Button variant="outline" className="w-full gap-2 justify-start" data-testid="upload-documents-btn">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
              <div className="text-xs text-muted-foreground">
                Upload company brochures, capability statements, and other documents.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Supplier Product Management Section
const SupplierProductManagement = ({ products, onAction, onAddProduct }) => {
  const columns = [
    { 
      key: "name", 
      label: "Product Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.image} 
            alt={value}
            className="h-10 w-14 rounded-sm object-cover bg-muted"
          />
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{row.subcategory}</p>
          </div>
        </div>
      )
    },
    { key: "category", label: "Category" },
    { 
      key: "rating", 
      label: "Rating",
      render: (value) => <RatingStars rating={value} size="sm" />
    },
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
            label="View" 
            testId={`view-product-${row.id}`}
            onClick={() => toast.info(`Viewing ${row.name}`)}
          />
          <ActionButton 
            icon={Edit} 
            label="Edit" 
            testId={`edit-product-${row.id}`}
            onClick={() => toast.info(`Editing ${row.name}`)}
          />
          <ActionButton 
            icon={Upload} 
            label="Upload Images" 
            testId={`upload-images-${row.id}`}
            onClick={() => toast.info("Upload images dialog")}
          />
          <ActionButton 
            icon={Trash2} 
            label="Delete" 
            className="text-red-400 hover:text-red-300"
            testId={`delete-product-${row.id}`}
            onClick={() => onAction("delete-product", row)}
          />
        </ActionButtonGroup>
      )
    },
  ];

  return (
    <div className="space-y-6" data-testid="supplier-product-management">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
            Product Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your product listings
          </p>
        </div>
        <Button onClick={onAddProduct} className="gap-2" data-testid="add-product-btn">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products..."
        searchKey="name"
        pageSize={5}
        testId="supplier-products-table"
      />
    </div>
  );
};

// Supplier Enquiries Section
const SupplierEnquiries = ({ enquiries, onReply }) => {
  const columns = [
    { 
      key: "buyerName", 
      label: "Buyer",
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.buyerCompany}</p>
        </div>
      )
    },
    { key: "productName", label: "Product" },
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
          <ActionButton 
            icon={MessageSquare} 
            label="Reply" 
            className="text-primary hover:text-primary/80"
            testId={`reply-enquiry-${row.id}`}
            onClick={() => onReply(row)}
          />
        </ActionButtonGroup>
      )
    },
  ];

  return (
    <div className="space-y-6" data-testid="supplier-enquiries">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
          Enquiries
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage buyer enquiries and communications
        </p>
      </div>
      <DataTable
        columns={columns}
        data={enquiries}
        searchPlaceholder="Search enquiries..."
        searchKey="buyerName"
        pageSize={5}
        testId="supplier-enquiries-table"
      />
    </div>
  );
};

// Supplier Ratings Section
const SupplierRatings = ({ ratings, supplier }) => {
  return (
    <div className="space-y-6" data-testid="supplier-ratings">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
          Ratings & Reviews
        </h1>
        <p className="text-sm text-muted-foreground">
          View and respond to customer reviews
        </p>
      </div>

      {/* Rating Summary */}
      <div className="dashboard-card">
        <div className="dashboard-card-content">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold font-['Barlow_Condensed']">{supplier.rating}</p>
              <RatingStars rating={supplier.rating} size="md" showValue={false} />
              <p className="text-sm text-muted-foreground mt-1">Overall Rating</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter(r => Math.floor(r.rating) === star).length;
                const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-3">{star}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {ratings.map((rating) => (
          <div key={rating.id} className="dashboard-card" data-testid={`review-card-${rating.id}`}>
            <div className="dashboard-card-content">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{rating.buyerName}</p>
                  <p className="text-xs text-muted-foreground">{rating.productName}</p>
                </div>
                <div className="text-right">
                  <RatingStars rating={rating.rating} size="sm" />
                  <p className="text-xs text-muted-foreground mt-1">{rating.submissionDate}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{rating.review}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="gap-2" data-testid={`respond-review-${rating.id}`}>
                  <MessageSquare className="h-3 w-3" />
                  Respond to Review
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierDashboard;
