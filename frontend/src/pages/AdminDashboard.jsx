import { useState } from "react";
import { useNavigation } from "@/App";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Building2,
  Users,
  Package,
  Clock,
  Star,
  FolderTree,
  Eye,
  Check,
  X,
  Ban,
  Trash2,
  Edit,
  Plus,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  suppliers as initialSuppliers,
  products as initialProducts,
  buyers as initialBuyers,
  ratings as initialRatings,
  categories as initialCategories,
  analyticsData,
  adminStats as initialStats,
} from "@/data/mockData";

// Custom chart tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-sm p-3 shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-muted-foreground">
            <span style={{ color: entry.color }}>{entry.name}: </span>
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AdminDashboard = () => {
  const { activeSection } = useNavigation();
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [products, setProducts] = useState(initialProducts);
  const [buyersData, setBuyersData] = useState(initialBuyers);
  const [ratingsData, setRatingsData] = useState(initialRatings);
  const [categoriesData, setCategoriesData] = useState(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState({ type: "", item: null });
  const [newCategory, setNewCategory] = useState("");
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);

  // Recalculate stats based on current data
  const stats = {
    totalSuppliers: suppliers.length,
    totalBuyers: buyersData.length,
    totalProducts: products.length,
    pendingSupplierApprovals: suppliers.filter(s => s.status === 'pending').length,
    pendingProductApprovals: products.filter(p => p.status === 'pending').length,
    pendingRatings: ratingsData.filter(r => r.status === 'pending').length,
    totalCategories: categoriesData.length
  };

  // Action handlers
  const handleAction = (type, item) => {
    setDialogAction({ type, item });
    setDialogOpen(true);
  };

  const confirmAction = () => {
    const { type, item } = dialogAction;
    
    switch (type) {
      case "approve-supplier":
        setSuppliers(prev => prev.map(s => 
          s.id === item.id ? { ...s, status: "active" } : s
        ));
        toast.success(`Supplier "${item.name}" approved successfully`);
        break;
      case "reject-supplier":
        setSuppliers(prev => prev.map(s => 
          s.id === item.id ? { ...s, status: "rejected" } : s
        ));
        toast.success(`Supplier "${item.name}" rejected`);
        break;
      case "suspend-supplier":
        setSuppliers(prev => prev.map(s => 
          s.id === item.id ? { ...s, status: "suspended" } : s
        ));
        toast.success(`Supplier "${item.name}" suspended`);
        break;
      case "delete-supplier":
        setSuppliers(prev => prev.filter(s => s.id !== item.id));
        toast.success(`Supplier "${item.name}" deleted`);
        break;
      case "approve-product":
        setProducts(prev => prev.map(p => 
          p.id === item.id ? { ...p, status: "approved" } : p
        ));
        toast.success(`Product "${item.name}" approved`);
        break;
      case "reject-product":
        setProducts(prev => prev.map(p => 
          p.id === item.id ? { ...p, status: "rejected" } : p
        ));
        toast.success(`Product "${item.name}" rejected`);
        break;
      case "delete-product":
        setProducts(prev => prev.filter(p => p.id !== item.id));
        toast.success(`Product "${item.name}" deleted`);
        break;
      case "approve-rating":
        setRatingsData(prev => prev.map(r => 
          r.id === item.id ? { ...r, status: "approved" } : r
        ));
        toast.success("Rating approved");
        break;
      case "reject-rating":
        setRatingsData(prev => prev.map(r => 
          r.id === item.id ? { ...r, status: "rejected" } : r
        ));
        toast.success("Rating rejected");
        break;
      case "remove-rating":
        setRatingsData(prev => prev.filter(r => r.id !== item.id));
        toast.success("Rating removed");
        break;
      case "suspend-buyer":
        setBuyersData(prev => prev.map(b => 
          b.id === item.id ? { ...b, status: "suspended" } : b
        ));
        toast.success(`Buyer "${item.name}" suspended`);
        break;
      case "delete-buyer":
        setBuyersData(prev => prev.filter(b => b.id !== item.id));
        toast.success(`Buyer "${item.name}" deleted`);
        break;
      case "delete-category":
        setCategoriesData(prev => prev.filter(c => c.id !== item.id));
        toast.success(`Category "${item.name}" deleted`);
        break;
      default:
        break;
    }
    
    setDialogOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCat = {
        id: `CAT${String(categoriesData.length + 1).padStart(3, '0')}`,
        name: newCategory,
        subcategories: [],
        productCount: 0
      };
      setCategoriesData(prev => [...prev, newCat]);
      toast.success(`Category "${newCategory}" added`);
      setNewCategory("");
      setAddCategoryOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview stats={stats} analyticsData={analyticsData} />;
      case "suppliers":
        return (
          <SupplierManagement 
            suppliers={suppliers} 
            onAction={handleAction} 
          />
        );
      case "products":
        return (
          <ProductManagement 
            products={products} 
            onAction={handleAction} 
          />
        );
      case "ratings":
        return (
          <RatingsModeration 
            ratings={ratingsData} 
            onAction={handleAction} 
          />
        );
      case "categories":
        return (
          <CategoryManagement 
            categories={categoriesData} 
            onAction={handleAction}
            onAddCategory={() => setAddCategoryOpen(true)}
          />
        );
      case "buyers":
        return (
          <BuyerManagement 
            buyers={buyersData} 
            onAction={handleAction} 
          />
        );
      case "analytics":
        return <PlatformInsights analyticsData={analyticsData} />;
      default:
        return <AdminOverview stats={stats} analyticsData={analyticsData} />;
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
            <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="dialog-cancel-btn">
              Cancel
            </Button>
            <Button onClick={confirmAction} data-testid="dialog-confirm-btn">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">
              Add New Category
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-black/20"
              data-testid="new-category-input"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} data-testid="add-category-confirm-btn">
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Admin Overview Section
const AdminOverview = ({ stats, analyticsData }) => {
  return (
    <div className="space-y-8" data-testid="admin-overview">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
          Platform Command Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor and manage all platform activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          icon={Building2}
          trend="up"
          trendValue="+12%"
          testId="stat-total-suppliers"
        />
        <StatCard
          title="Total Buyers"
          value={stats.totalBuyers}
          icon={Users}
          trend="up"
          trendValue="+8%"
          testId="stat-total-buyers"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend="up"
          trendValue="+15%"
          testId="stat-total-products"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={FolderTree}
          testId="stat-total-categories"
        />
      </div>

      {/* Pending Approvals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card bg-amber-500/5 border-amber-500/20">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-400" />
            <div>
              <p className="data-label">Pending Supplier Approvals</p>
              <p className="text-2xl font-bold font-['Barlow_Condensed']">{stats.pendingSupplierApprovals}</p>
            </div>
          </div>
        </div>
        <div className="stat-card bg-amber-500/5 border-amber-500/20">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-400" />
            <div>
              <p className="data-label">Pending Product Approvals</p>
              <p className="text-2xl font-bold font-['Barlow_Condensed']">{stats.pendingProductApprovals}</p>
            </div>
          </div>
        </div>
        <div className="stat-card bg-amber-500/5 border-amber-500/20">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-amber-400" />
            <div>
              <p className="data-label">Pending Ratings</p>
              <p className="text-2xl font-bold font-['Barlow_Condensed']">{stats.pendingRatings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Demand Trends */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Category Demand Trends</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="dashboard-card-content">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analyticsData.categoryDemandTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="uav" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="UAV" />
                <Area type="monotone" dataKey="electronics" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Electronics" />
                <Area type="monotone" dataKey="surveillance" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Surveillance" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Rated Suppliers */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Top Rated Suppliers</h3>
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="dashboard-card-content">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.topRatedSuppliers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" domain={[0, 5]} stroke="#666" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#666" fontSize={11} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rating" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Rating" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Supplier Management Section
const SupplierManagement = ({ suppliers, onAction }) => {
  const columns = [
    { 
      key: "name", 
      label: "Supplier Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-sm bg-primary/20 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: "type", label: "Type" },
    { key: "country", label: "Country" },
    { key: "productsCount", label: "Products" },
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
            label="View Profile" 
            testId={`view-supplier-${row.id}`}
            onClick={() => toast.info(`Viewing ${row.name}'s profile`)}
          />
          {row.status === "pending" && (
            <>
              <ActionButton 
                icon={Check} 
                label="Approve" 
                className="text-emerald-400 hover:text-emerald-300"
                testId={`approve-supplier-${row.id}`}
                onClick={() => onAction("approve-supplier", row)}
              />
              <ActionButton 
                icon={X} 
                label="Reject" 
                className="text-red-400 hover:text-red-300"
                testId={`reject-supplier-${row.id}`}
                onClick={() => onAction("reject-supplier", row)}
              />
            </>
          )}
          {row.status === "active" && (
            <ActionButton 
              icon={Ban} 
              label="Suspend" 
              className="text-amber-400 hover:text-amber-300"
              testId={`suspend-supplier-${row.id}`}
              onClick={() => onAction("suspend-supplier", row)}
            />
          )}
          <ActionButton 
            icon={Trash2} 
            label="Delete" 
            className="text-red-400 hover:text-red-300"
            testId={`delete-supplier-${row.id}`}
            onClick={() => onAction("delete-supplier", row)}
          />
        </ActionButtonGroup>
      )
    },
  ];

  return (
    <div className="space-y-6" data-testid="supplier-management">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
            Supplier Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage supplier registrations and accounts
          </p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={suppliers}
        searchPlaceholder="Search suppliers..."
        searchKey="name"
        pageSize={5}
        testId="suppliers-table"
      />
    </div>
  );
};

// Product Management Section
const ProductManagement = ({ products, onAction }) => {
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
            <p className="text-xs text-muted-foreground">{row.category}</p>
          </div>
        </div>
      )
    },
    { key: "supplierName", label: "Supplier" },
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
            label="View Product" 
            testId={`view-product-${row.id}`}
            onClick={() => toast.info(`Viewing ${row.name}`)}
          />
          {row.status === "pending" && (
            <>
              <ActionButton 
                icon={Check} 
                label="Approve" 
                className="text-emerald-400 hover:text-emerald-300"
                testId={`approve-product-${row.id}`}
                onClick={() => onAction("approve-product", row)}
              />
              <ActionButton 
                icon={X} 
                label="Reject" 
                className="text-red-400 hover:text-red-300"
                testId={`reject-product-${row.id}`}
                onClick={() => onAction("reject-product", row)}
              />
            </>
          )}
          <ActionButton 
            icon={Edit} 
            label="Edit" 
            testId={`edit-product-${row.id}`}
            onClick={() => toast.info(`Editing ${row.name}`)}
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
    <div className="space-y-6" data-testid="product-management">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
            Product Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage product listings and approvals
          </p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products..."
        searchKey="name"
        pageSize={5}
        testId="products-table"
      />
    </div>
  );
};

// Ratings Moderation Section
const RatingsModeration = ({ ratings, onAction }) => {
  const columns = [
    { key: "productName", label: "Product" },
    { key: "buyerName", label: "Buyer" },
    { 
      key: "rating", 
      label: "Rating",
      render: (value) => <RatingStars rating={value} size="sm" />
    },
    { 
      key: "review", 
      label: "Review",
      render: (value) => (
        <p className="text-sm max-w-xs truncate">{value}</p>
      )
    },
    { key: "submissionDate", label: "Date" },
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
          {row.status === "pending" && (
            <>
              <ActionButton 
                icon={Check} 
                label="Approve" 
                className="text-emerald-400 hover:text-emerald-300"
                testId={`approve-rating-${row.id}`}
                onClick={() => onAction("approve-rating", row)}
              />
              <ActionButton 
                icon={X} 
                label="Reject" 
                className="text-red-400 hover:text-red-300"
                testId={`reject-rating-${row.id}`}
                onClick={() => onAction("reject-rating", row)}
              />
            </>
          )}
          <ActionButton 
            icon={Trash2} 
            label="Remove" 
            className="text-red-400 hover:text-red-300"
            testId={`remove-rating-${row.id}`}
            onClick={() => onAction("remove-rating", row)}
          />
        </ActionButtonGroup>
      )
    },
  ];

  return (
    <div className="space-y-6" data-testid="ratings-moderation">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
          Ratings Moderation
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and moderate user ratings
        </p>
      </div>
      <DataTable
        columns={columns}
        data={ratings}
        searchPlaceholder="Search ratings..."
        searchKey="productName"
        pageSize={5}
        testId="ratings-table"
      />
    </div>
  );
};

// Category Management Section
const CategoryManagement = ({ categories, onAction, onAddCategory }) => {
  return (
    <div className="space-y-6" data-testid="category-management">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
            Category Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage product categories and subcategories
          </p>
        </div>
        <Button 
          onClick={onAddCategory}
          className="gap-2"
          data-testid="add-category-btn"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="dashboard-card group"
            data-testid={`category-card-${category.id}`}
          >
            <div className="dashboard-card-header">
              <div className="flex items-center gap-2">
                <FolderTree className="h-4 w-4 text-primary" />
                <h3 className="dashboard-card-title">{category.name}</h3>
              </div>
              <ActionButtonGroup>
                <ActionButton 
                  icon={Edit} 
                  label="Edit" 
                  testId={`edit-category-${category.id}`}
                  onClick={() => toast.info(`Editing ${category.name}`)}
                />
                <ActionButton 
                  icon={Trash2} 
                  label="Delete" 
                  className="text-red-400 hover:text-red-300"
                  testId={`delete-category-${category.id}`}
                  onClick={() => onAction("delete-category", category)}
                />
              </ActionButtonGroup>
            </div>
            <div className="dashboard-card-content">
              <p className="text-xs text-muted-foreground mb-3">
                {category.productCount} products
              </p>
              <div className="space-y-1">
                {category.subcategories.map((sub, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {sub}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Buyer Management Section
const BuyerManagement = ({ buyers, onAction }) => {
  const columns = [
    { 
      key: "name", 
      label: "Buyer Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-sm bg-primary/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: "company", label: "Company" },
    { key: "country", label: "Country" },
    { key: "enquiriesSent", label: "Enquiries" },
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
            label="View Profile" 
            testId={`view-buyer-${row.id}`}
            onClick={() => toast.info(`Viewing ${row.name}'s profile`)}
          />
          {row.status === "active" && (
            <ActionButton 
              icon={Ban} 
              label="Suspend" 
              className="text-amber-400 hover:text-amber-300"
              testId={`suspend-buyer-${row.id}`}
              onClick={() => onAction("suspend-buyer", row)}
            />
          )}
          <ActionButton 
            icon={Trash2} 
            label="Delete" 
            className="text-red-400 hover:text-red-300"
            testId={`delete-buyer-${row.id}`}
            onClick={() => onAction("delete-buyer", row)}
          />
        </ActionButtonGroup>
      )
    },
  ];

  return (
    <div className="space-y-6" data-testid="buyer-management">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
          Buyer Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage buyer accounts and activities
        </p>
      </div>
      <DataTable
        columns={columns}
        data={buyers}
        searchPlaceholder="Search buyers..."
        searchKey="name"
        pageSize={5}
        testId="buyers-table"
      />
    </div>
  );
};

// Platform Insights Section
const PlatformInsights = ({ analyticsData }) => {
  return (
    <div className="space-y-6" data-testid="platform-insights">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">
          Platform Insights
        </h1>
        <p className="text-sm text-muted-foreground">
          Analytics and trends across the platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Searched Components */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Most Searched Components</h3>
          </div>
          <div className="dashboard-card-content">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analyticsData.mostSearchedComponents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="searches" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Searches" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Active Suppliers */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Most Active Suppliers</h3>
          </div>
          <div className="dashboard-card-content">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analyticsData.mostActiveSuppliers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="products" fill="#3b82f6" name="Products" />
                <Bar dataKey="enquiries" fill="#10b981" name="Enquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Demand Trends */}
        <div className="dashboard-card lg:col-span-2">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Category Demand Trends</h3>
          </div>
          <div className="dashboard-card-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.categoryDemandTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="uav" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="UAV & Aerospace" />
                <Line type="monotone" dataKey="electronics" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Tactical Electronics" />
                <Line type="monotone" dataKey="surveillance" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} name="Surveillance" />
                <Line type="monotone" dataKey="materials" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="Defense Materials" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Enquiries */}
        <div className="dashboard-card lg:col-span-2">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Monthly Enquiries Trend</h3>
          </div>
          <div className="dashboard-card-content">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analyticsData.monthlyEnquiries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="enquiries" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Enquiries" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
