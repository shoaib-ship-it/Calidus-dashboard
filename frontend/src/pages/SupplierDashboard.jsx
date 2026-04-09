import { useState, useEffect } from "react";
import { useNavigation } from "@/App";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { ActionButton, ActionButtonGroup } from "@/components/shared/ActionButton";
import { RatingStars } from "@/components/shared/RatingStars";
import {
  Eye, Package, Star, Inbox, Building2, Edit, Trash2, Plus, Upload, FileText, MessageSquare, Send,
  Award, TrendingUp, Clock, Mail, Phone, MapPin, Calendar, Image, AlertTriangle, User, FileWarning,
  FileX, FileCheck, RefreshCw, ChevronRight, X, GripVertical, Video, Link, Info, Globe, Truck,
  Shield, Tag, Zap, Ruler, Weight, Box, Layers, CheckCircle, XCircle, Sparkles
} from "lucide-react";
import {
  products as allProducts, enquiries as allEnquiries, ratings as allRatings,
  currentSupplier, supplierStats, categories, supplierNotifications,
} from "@/data/mockData";

// Countries list for dropdown
const countries = [
  "United States", "Germany", "United Kingdom", "France", "Israel", "Sweden", 
  "Canada", "Australia", "Japan", "South Korea", "India", "Italy", "Spain",
  "Netherlands", "Belgium", "Poland", "Czech Republic", "Norway", "Finland"
];

// Common defense certifications
const certificationOptions = [
  "ISO 9001", "AS9100D", "AS9100", "ITAR", "MIL-STD-810G", "MIL-STD-810H", 
  "MIL-STD-188", "MIL-STD-1553", "EN9100", "NADCAP", "Def Stan 05-57", 
  "AQAP 2110", "DO-178C", "DO-254", "NATO STANAG", "NIJ Certified", "FAA Part 107"
];

// Industry tags
const industryTagOptions = [
  "UAV", "Naval", "Radar", "Defense Electronics", "Aerospace", "Ground Forces",
  "Air Defense", "Cybersecurity", "Communications", "Intelligence", "Logistics",
  "Special Operations", "Border Security", "Maritime", "Space Systems"
];

// Default empty product form state
const getEmptyProductForm = () => ({
  // Basic Info
  name: "",
  category: "",
  subcategory: "",
  shortDescription: "",
  detailedDescription: "",
  
  // Technical Specifications (dynamic)
  specifications: [],
  
  // Dimensions
  dimensions: {
    length: "",
    width: "",
    height: "",
    weight: "",
    volume: ""
  },
  
  // Origin & Delivery
  countryOfOrigin: "",
  leadTime: "",
  leadTimeUnit: "weeks",
  availability: "in-stock",
  
  // Certifications
  certifications: [],
  customCertifications: [],
  
  // Media
  images: [],
  primaryImageIndex: 0,
  datasheet: null,
  technicalDocs: [],
  videoUrl: "",
  videoFile: null,
  
  // Additional
  applicationUseCase: "",
  industryTags: [],
  
  // AI Summary
  aiSummary: "",
  
  // Meta
  status: "pending"
});

export const SupplierDashboard = () => {
  const { activeSection, setActiveSection } = useNavigation();
  
  const [supplier, setSupplier] = useState({ ...currentSupplier });
  const [products, setProducts] = useState(allProducts.filter(p => p.supplierId === currentSupplier.id));
  const [enquiries, setEnquiries] = useState(allEnquiries.filter(e => e.supplierId === currentSupplier.id));
  const [ratings, setRatings] = useState(allRatings.filter(r => products.some(p => p.id === r.productId)));
  const [notifications, setNotifications] = useState(supplierNotifications);
  
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "", item: null, message: "" });
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [editProductDialog, setEditProductDialog] = useState({ open: false, item: null });
  const [editProfileDialog, setEditProfileDialog] = useState(false);
  const [uploadDocDialog, setUploadDocDialog] = useState({ open: false, document: null });
  const [replyReviewDialog, setReplyReviewDialog] = useState({ open: false, rating: null });
  
  const [viewSheet, setViewSheet] = useState({ open: false, type: "", item: null });
  const [replySheet, setReplySheet] = useState({ open: false, item: null });
  
  const [productForm, setProductForm] = useState(getEmptyProductForm());
  const [formErrors, setFormErrors] = useState({});
  const [activeFormTab, setActiveFormTab] = useState("basic");
  
  const [profileForm, setProfileForm] = useState({ ...currentSupplier });
  const [replyText, setReplyText] = useState("");
  const [reviewReplyText, setReviewReplyText] = useState("");

  const stats = {
    profileViews: supplier.profileViews,
    totalEnquiries: enquiries.length,
    activeProducts: products.filter(p => p.status === 'approved').length,
    averageRating: supplier.rating,
    pendingProductApprovals: products.filter(p => p.status === 'pending').length
  };

  const expiringDocs = supplier.documents?.filter(d => d.status === 'expiring' || d.status === 'expired') || [];

  // Get subcategories based on selected category
  const getSubcategories = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.subcategories || [];
  };

  // Validation
  const validateProductForm = () => {
    const errors = {};
    if (!productForm.name.trim()) errors.name = "Product name is required";
    if (!productForm.category) errors.category = "Category is required";
    if (!productForm.shortDescription.trim()) errors.shortDescription = "Short description is required";
    if (productForm.shortDescription.length > 300) errors.shortDescription = "Max 300 characters";
    if (!productForm.countryOfOrigin) errors.countryOfOrigin = "Country of origin is required";
    if (!productForm.leadTime) errors.leadTime = "Lead time is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openConfirmDialog = (type, item, message) => {
    setConfirmDialog({ open: true, type, item, message });
  };

  const handleConfirmAction = () => {
    const { type, item } = confirmDialog;
    if (type === "delete-product") {
      setProducts(prev => prev.filter(p => p.id !== item.id));
      toast.success(`Product "${item.name}" deleted`);
    }
    setConfirmDialog({ open: false, type: "", item: null, message: "" });
  };

  // Add specification row
  const addSpecification = () => {
    setProductForm(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "", id: Date.now() }]
    }));
  };

  // Update specification
  const updateSpecification = (id, field, value) => {
    setProductForm(prev => ({
      ...prev,
      specifications: prev.specifications.map(spec => 
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    }));
  };

  // Remove specification
  const removeSpecification = (id) => {
    setProductForm(prev => ({
      ...prev,
      specifications: prev.specifications.filter(spec => spec.id !== id)
    }));
  };

  // Toggle certification
  const toggleCertification = (cert) => {
    setProductForm(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  // Add custom certification
  const [customCertInput, setCustomCertInput] = useState("");
  const addCustomCertification = () => {
    if (customCertInput.trim() && !productForm.customCertifications.includes(customCertInput.trim())) {
      setProductForm(prev => ({
        ...prev,
        customCertifications: [...prev.customCertifications, customCertInput.trim()]
      }));
      setCustomCertInput("");
    }
  };

  // Remove custom certification
  const removeCustomCertification = (cert) => {
    setProductForm(prev => ({
      ...prev,
      customCertifications: prev.customCertifications.filter(c => c !== cert)
    }));
  };

  // Toggle industry tag
  const toggleIndustryTag = (tag) => {
    setProductForm(prev => ({
      ...prev,
      industryTags: prev.industryTags.includes(tag)
        ? prev.industryTags.filter(t => t !== tag)
        : [...prev.industryTags, tag]
    }));
  };

  // Simulate image upload
  const handleImageUpload = () => {
    const mockImage = {
      id: Date.now(),
      url: `https://images.unsplash.com/photo-1607867992871-34951585c280?w=200&h=150&fit=crop&t=${Date.now()}`,
      name: `product-image-${productForm.images.length + 1}.jpg`
    };
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, mockImage]
    }));
    toast.success("Image uploaded successfully");
  };

  // Remove image
  const removeImage = (imageId) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId),
      primaryImageIndex: prev.primaryImageIndex >= prev.images.length - 1 ? 0 : prev.primaryImageIndex
    }));
  };

  // Set primary image
  const setPrimaryImage = (index) => {
    setProductForm(prev => ({ ...prev, primaryImageIndex: index }));
  };

  // Handle document upload simulation
  const handleDocumentUpload = (type) => {
    if (type === 'datasheet') {
      setProductForm(prev => ({
        ...prev,
        datasheet: { name: 'product-datasheet.pdf', size: '2.4 MB', uploadedAt: new Date().toISOString() }
      }));
      toast.success("Datasheet uploaded successfully");
    } else {
      const newDoc = {
        id: Date.now(),
        name: `technical-doc-${productForm.technicalDocs.length + 1}.pdf`,
        size: '1.2 MB',
        uploadedAt: new Date().toISOString()
      };
      setProductForm(prev => ({
        ...prev,
        technicalDocs: [...prev.technicalDocs, newDoc]
      }));
      toast.success("Technical document uploaded");
    }
  };

  // Remove technical document
  const removeTechnicalDoc = (docId) => {
    setProductForm(prev => ({
      ...prev,
      technicalDocs: prev.technicalDocs.filter(doc => doc.id !== docId)
    }));
  };

  const handleAddProduct = () => {
    if (!validateProductForm()) {
      toast.error("Please fill in all required fields");
      setActiveFormTab("basic");
      return;
    }

    const newProd = {
      id: `PRD${String(products.length + 100).padStart(3, '0')}`,
      name: productForm.name,
      supplierId: supplier.id,
      supplierName: supplier.name,
      category: productForm.category,
      subcategory: productForm.subcategory || "General",
      rating: 0,
      status: "pending",
      price: "RFQ",
      description: productForm.detailedDescription || productForm.shortDescription,
      shortDescription: productForm.shortDescription,
      specifications: productForm.specifications.filter(s => s.key && s.value).map(s => `${s.key}: ${s.value}`),
      leadTime: `${productForm.leadTime} ${productForm.leadTimeUnit}`,
      countryOfOrigin: productForm.countryOfOrigin,
      availability: productForm.availability,
      dimensions: productForm.dimensions,
      certifications: [...productForm.certifications, ...productForm.customCertifications],
      industryTags: productForm.industryTags,
      applicationUseCase: productForm.applicationUseCase,
      aiSummary: productForm.aiSummary,
      images: productForm.images.length > 0 ? productForm.images : [{ url: "https://images.unsplash.com/photo-1607867992871-34951585c280?w=200&h=150&fit=crop" }],
      primaryImageIndex: productForm.primaryImageIndex,
      datasheet: productForm.datasheet,
      technicalDocs: productForm.technicalDocs,
      videoUrl: productForm.videoUrl,
      image: productForm.images[productForm.primaryImageIndex]?.url || "https://images.unsplash.com/photo-1607867992871-34951585c280?w=200&h=150&fit=crop"
    };
    
    setProducts(prev => [...prev, newProd]);
    toast.success(`Product "${productForm.name}" added and submitted for approval`);
    setProductForm(getEmptyProductForm());
    setFormErrors({});
    setActiveFormTab("basic");
    setAddProductDialog(false);
  };

  const handleEditProduct = () => {
    if (!validateProductForm()) {
      toast.error("Please fill in all required fields");
      setActiveFormTab("basic");
      return;
    }

    const updatedProduct = {
      ...editProductDialog.item,
      name: productForm.name,
      category: productForm.category,
      subcategory: productForm.subcategory || "General",
      status: "pending", // Reset to pending on edit
      description: productForm.detailedDescription || productForm.shortDescription,
      shortDescription: productForm.shortDescription,
      specifications: productForm.specifications.filter(s => s.key && s.value).map(s => `${s.key}: ${s.value}`),
      leadTime: `${productForm.leadTime} ${productForm.leadTimeUnit}`,
      countryOfOrigin: productForm.countryOfOrigin,
      availability: productForm.availability,
      dimensions: productForm.dimensions,
      certifications: [...productForm.certifications, ...productForm.customCertifications],
      industryTags: productForm.industryTags,
      applicationUseCase: productForm.applicationUseCase,
      aiSummary: productForm.aiSummary,
      images: productForm.images.length > 0 ? productForm.images : editProductDialog.item.images,
      primaryImageIndex: productForm.primaryImageIndex,
      datasheet: productForm.datasheet,
      technicalDocs: productForm.technicalDocs,
      videoUrl: productForm.videoUrl,
      image: productForm.images[productForm.primaryImageIndex]?.url || editProductDialog.item.image
    };

    setProducts(prev => prev.map(p => p.id === editProductDialog.item.id ? updatedProduct : p));
    toast.success(`Product "${productForm.name}" updated and resubmitted for approval`);
    setProductForm(getEmptyProductForm());
    setFormErrors({});
    setActiveFormTab("basic");
    setEditProductDialog({ open: false, item: null });
  };

  const handleSaveProfile = () => {
    setSupplier({ ...profileForm });
    toast.success("Company profile updated successfully");
    setEditProfileDialog(false);
  };

  const handleUploadDocument = () => {
    if (uploadDocDialog.document) {
      const updatedDocs = supplier.documents.map(d => 
        d.name === uploadDocDialog.document.name 
          ? { ...d, status: 'active', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
          : d
      );
      setSupplier(prev => ({ ...prev, documents: updatedDocs, documentStatus: 'active' }));
      toast.success(`${uploadDocDialog.document.name} re-uploaded successfully`);
      setUploadDocDialog({ open: false, document: null });
    }
  };

  const handleSendReply = () => {
    if (replyText.trim() && replySheet.item) {
      setEnquiries(prev => prev.map(e => 
        e.id === replySheet.item.id 
          ? { ...e, status: "replied", reply: replyText, replyDate: new Date().toISOString().split('T')[0] }
          : e
      ));
      toast.success("Reply sent successfully");
      setReplyText("");
      setReplySheet({ open: false, item: null });
    }
  };

  const handleSubmitReviewReply = () => {
    if (reviewReplyText.trim() && replyReviewDialog.rating) {
      setRatings(prev => prev.map(r => 
        r.id === replyReviewDialog.rating.id 
          ? { ...r, supplierReply: reviewReplyText, supplierReplyStatus: 'pending' }
          : r
      ));
      toast.success("Reply submitted for admin approval");
      setReviewReplyText("");
      setReplyReviewDialog({ open: false, rating: null });
    }
  };

  const openAddProduct = () => {
    setProductForm(getEmptyProductForm());
    setFormErrors({});
    setActiveFormTab("basic");
    setAddProductDialog(true);
  };

  const openEditProduct = (item) => {
    // Parse existing product data into form format
    const parseLeadTime = (lt) => {
      if (!lt) return { value: "", unit: "weeks" };
      const parts = lt.split(" ");
      return { value: parts[0] || "", unit: parts[1] || "weeks" };
    };
    
    const parsedLeadTime = parseLeadTime(item.leadTime);
    
    // Parse specifications from array of strings to objects
    const parseSpecs = (specs) => {
      if (!specs || !Array.isArray(specs)) return [];
      return specs.map((spec, idx) => {
        const [key, ...valueParts] = spec.split(":");
        return { id: idx, key: key?.trim() || "", value: valueParts.join(":").trim() || "" };
      });
    };

    setProductForm({
      name: item.name || "",
      category: item.category || "",
      subcategory: item.subcategory || "",
      shortDescription: item.shortDescription || item.description || "",
      detailedDescription: item.description || "",
      specifications: parseSpecs(item.specifications),
      dimensions: item.dimensions || { length: "", width: "", height: "", weight: "", volume: "" },
      countryOfOrigin: item.countryOfOrigin || "",
      leadTime: parsedLeadTime.value,
      leadTimeUnit: parsedLeadTime.unit,
      availability: item.availability || "in-stock",
      certifications: item.certifications?.filter(c => certificationOptions.includes(c)) || [],
      customCertifications: item.certifications?.filter(c => !certificationOptions.includes(c)) || [],
      images: item.images || (item.image ? [{ id: 1, url: item.image, name: "product-image.jpg" }] : []),
      primaryImageIndex: item.primaryImageIndex || 0,
      datasheet: item.datasheet || null,
      technicalDocs: item.technicalDocs || [],
      videoUrl: item.videoUrl || "",
      videoFile: null,
      applicationUseCase: item.applicationUseCase || "",
      industryTags: item.industryTags || [],
      aiSummary: item.aiSummary || "",
      status: item.status
    });
    setFormErrors({});
    setActiveFormTab("basic");
    setEditProductDialog({ open: true, item });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <SupplierOverview stats={stats} supplier={supplier} expiringDocs={expiringDocs} onNavigate={setActiveSection} />;
      case "profile":
        return (
          <CompanyProfile 
            supplier={supplier} 
            onEdit={() => { setProfileForm({ ...supplier }); setEditProfileDialog(true); }}
            onUploadDoc={(doc) => setUploadDocDialog({ open: true, document: doc })}
          />
        );
      case "products":
        return (
          <SupplierProductManagement 
            products={products} 
            onView={(item) => setViewSheet({ open: true, type: "product", item })}
            onEdit={openEditProduct}
            onDelete={(item) => openConfirmDialog("delete-product", item, `Delete product "${item.name}"?`)}
            onAddProduct={openAddProduct}
          />
        );
      case "enquiries":
        return (
          <SupplierEnquiries 
            enquiries={enquiries}
            onView={(item) => setViewSheet({ open: true, type: "enquiry", item })}
            onReply={(item) => { setReplyText(""); setReplySheet({ open: true, item }); }}
          />
        );
      case "ratings":
        return (
          <SupplierRatings 
            ratings={ratings} 
            supplier={supplier}
            onViewReview={(item) => setViewSheet({ open: true, type: "rating", item })}
            onReplyReview={(item) => { setReviewReplyText(""); setReplyReviewDialog({ open: true, rating: item }); }}
          />
        );
      default:
        return <SupplierOverview stats={stats} supplier={supplier} expiringDocs={expiringDocs} onNavigate={setActiveSection} />;
    }
  };

  // Product Form Component (shared between Add and Edit)
  const ProductFormContent = ({ isEdit = false }) => (
    <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-4">
        <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
        <TabsTrigger value="specs" className="text-xs">Specs & Dimensions</TabsTrigger>
        <TabsTrigger value="origin" className="text-xs">Origin & Certs</TabsTrigger>
        <TabsTrigger value="media" className="text-xs">Media & Tags</TabsTrigger>
        <TabsTrigger value="preview" className="text-xs flex items-center gap-1" data-testid="preview-tab">
          <Eye className="h-3 w-3" />Preview
        </TabsTrigger>
      </TabsList>

      {/* TAB 1: Basic Product Information */}
      <TabsContent value="basic" className="space-y-4 mt-0">
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-sm">
          <p className="text-xs text-primary flex items-center gap-2">
            <Info className="h-3 w-3" />
            Complete product details improve discoverability and buyer trust
          </p>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Product Name *</Label>
          <Input 
            value={productForm.name} 
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} 
            placeholder="e.g., UAV Propulsion System MK-V" 
            className={`bg-black/20 mt-1 ${formErrors.name ? 'border-red-500' : ''}`}
            data-testid="product-form-name"
          />
          {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category *</Label>
            <Select 
              value={productForm.category} 
              onValueChange={(value) => setProductForm({ ...productForm, category: value, subcategory: "" })}
            >
              <SelectTrigger className={`bg-black/20 mt-1 ${formErrors.category ? 'border-red-500' : ''}`} data-testid="product-form-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.category && <p className="text-xs text-red-400 mt-1">{formErrors.category}</p>}
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subcategory</Label>
            <Select 
              value={productForm.subcategory} 
              onValueChange={(value) => setProductForm({ ...productForm, subcategory: value })}
              disabled={!productForm.category}
            >
              <SelectTrigger className="bg-black/20 mt-1" data-testid="product-form-subcategory">
                <SelectValue placeholder={productForm.category ? "Select subcategory" : "Select category first"} />
              </SelectTrigger>
              <SelectContent>
                {getSubcategories(productForm.category).map(sub => (
                  <SelectItem key={sub.id} value={sub.name}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Short Description * <span className="text-muted-foreground/60">(max 300 chars)</span></Label>
          <Textarea 
            value={productForm.shortDescription} 
            onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })} 
            placeholder="Brief product overview for search results and listings" 
            className={`bg-black/20 mt-1 min-h-[80px] ${formErrors.shortDescription ? 'border-red-500' : ''}`}
            maxLength={300}
            data-testid="product-form-short-desc"
          />
          <div className="flex justify-between mt-1">
            {formErrors.shortDescription && <p className="text-xs text-red-400">{formErrors.shortDescription}</p>}
            <p className="text-xs text-muted-foreground ml-auto">{productForm.shortDescription.length}/300</p>
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Detailed Description</Label>
          <Textarea 
            value={productForm.detailedDescription} 
            onChange={(e) => setProductForm({ ...productForm, detailedDescription: e.target.value })} 
            placeholder="Comprehensive product description with features, capabilities, and applications" 
            className="bg-black/20 mt-1 min-h-[120px]"
            data-testid="product-form-detailed-desc"
          />
          <p className="text-xs text-muted-foreground mt-1">Rich product descriptions help buyers make informed decisions</p>
        </div>
      </TabsContent>

      {/* TAB 2: Technical Specifications & Dimensions */}
      <TabsContent value="specs" className="space-y-6 mt-0">
        {/* Technical Specifications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Technical Specifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Detailed specs improve discoverability</p>
            </div>
            <Button variant="outline" size="sm" onClick={addSpecification} className="gap-1" data-testid="add-spec-btn">
              <Plus className="h-3 w-3" />Add Spec
            </Button>
          </div>
          
          <div className="space-y-2">
            {productForm.specifications.length === 0 ? (
              <div className="p-4 border border-dashed border-border rounded-sm text-center">
                <Layers className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No specifications added</p>
                <p className="text-xs text-muted-foreground">Click "Add Spec" to add technical details</p>
              </div>
            ) : (
              productForm.specifications.map((spec, idx) => (
                <div key={spec.id} className="flex items-center gap-2 p-2 bg-muted/20 rounded-sm">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <Input 
                    value={spec.key} 
                    onChange={(e) => updateSpecification(spec.id, 'key', e.target.value)}
                    placeholder="e.g., Power Output"
                    className="bg-black/20 flex-1"
                    data-testid={`spec-key-${idx}`}
                  />
                  <Input 
                    value={spec.value} 
                    onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
                    placeholder="e.g., 5kW"
                    className="bg-black/20 flex-1"
                    data-testid={`spec-value-${idx}`}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeSpecification(spec.id)} className="h-8 w-8 text-red-400 hover:text-red-300" data-testid={`remove-spec-${idx}`}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
          
          {productForm.specifications.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Examples: Power Output: 5kW, Weight: 12kg, Material: Titanium Alloy, Operating Temp: -40°C to 85°C
            </p>
          )}
        </div>

        <Separator />

        {/* Dimensions & Physical Details */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Dimensions & Physical Details</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Ruler className="h-3 w-3" />Length</Label>
              <Input 
                value={productForm.dimensions.length} 
                onChange={(e) => setProductForm({ ...productForm, dimensions: { ...productForm.dimensions, length: e.target.value } })}
                placeholder="e.g., 500mm"
                className="bg-black/20 mt-1"
                data-testid="dimension-length"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Ruler className="h-3 w-3" />Width</Label>
              <Input 
                value={productForm.dimensions.width} 
                onChange={(e) => setProductForm({ ...productForm, dimensions: { ...productForm.dimensions, width: e.target.value } })}
                placeholder="e.g., 300mm"
                className="bg-black/20 mt-1"
                data-testid="dimension-width"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Ruler className="h-3 w-3" />Height</Label>
              <Input 
                value={productForm.dimensions.height} 
                onChange={(e) => setProductForm({ ...productForm, dimensions: { ...productForm.dimensions, height: e.target.value } })}
                placeholder="e.g., 200mm"
                className="bg-black/20 mt-1"
                data-testid="dimension-height"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Weight className="h-3 w-3" />Weight</Label>
              <Input 
                value={productForm.dimensions.weight} 
                onChange={(e) => setProductForm({ ...productForm, dimensions: { ...productForm.dimensions, weight: e.target.value } })}
                placeholder="e.g., 12kg"
                className="bg-black/20 mt-1"
                data-testid="dimension-weight"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Box className="h-3 w-3" />Volume (optional)</Label>
              <Input 
                value={productForm.dimensions.volume} 
                onChange={(e) => setProductForm({ ...productForm, dimensions: { ...productForm.dimensions, volume: e.target.value } })}
                placeholder="e.g., 0.03m³"
                className="bg-black/20 mt-1"
                data-testid="dimension-volume"
              />
            </div>
          </div>
        </div>
      </TabsContent>

      {/* TAB 3: Origin, Delivery & Certifications */}
      <TabsContent value="origin" className="space-y-6 mt-0">
        {/* Origin & Delivery */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Origin & Delivery</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Globe className="h-3 w-3" />Country of Origin *</Label>
              <Select 
                value={productForm.countryOfOrigin} 
                onValueChange={(value) => setProductForm({ ...productForm, countryOfOrigin: value })}
              >
                <SelectTrigger className={`bg-black/20 mt-1 ${formErrors.countryOfOrigin ? 'border-red-500' : ''}`} data-testid="product-form-country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.countryOfOrigin && <p className="text-xs text-red-400 mt-1">{formErrors.countryOfOrigin}</p>}
            </div>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Truck className="h-3 w-3" />Lead Time *</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  value={productForm.leadTime} 
                  onChange={(e) => setProductForm({ ...productForm, leadTime: e.target.value })}
                  placeholder="e.g., 8-12"
                  className={`bg-black/20 flex-1 ${formErrors.leadTime ? 'border-red-500' : ''}`}
                  data-testid="product-form-leadtime"
                />
                <Select 
                  value={productForm.leadTimeUnit} 
                  onValueChange={(value) => setProductForm({ ...productForm, leadTimeUnit: value })}
                >
                  <SelectTrigger className="bg-black/20 w-24" data-testid="product-form-leadtime-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formErrors.leadTime && <p className="text-xs text-red-400 mt-1">{formErrors.leadTime}</p>}
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs text-muted-foreground">Availability</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="availability" 
                  value="in-stock" 
                  checked={productForm.availability === 'in-stock'}
                  onChange={(e) => setProductForm({ ...productForm, availability: e.target.value })}
                  className="accent-primary"
                />
                <span className="text-sm">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="availability" 
                  value="made-to-order" 
                  checked={productForm.availability === 'made-to-order'}
                  onChange={(e) => setProductForm({ ...productForm, availability: e.target.value })}
                  className="accent-primary"
                />
                <span className="text-sm">Made to Order</span>
              </label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Certifications & Compliance */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Certifications & Compliance</Label>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {certificationOptions.map(cert => (
              <label key={cert} className="flex items-center gap-2 p-2 rounded-sm bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors">
                <Checkbox 
                  checked={productForm.certifications.includes(cert)}
                  onCheckedChange={() => toggleCertification(cert)}
                  data-testid={`cert-${cert.replace(/\s+/g, '-').toLowerCase()}`}
                />
                <span className="text-sm">{cert}</span>
              </label>
            ))}
          </div>

          {/* Custom certifications */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Add Custom Certification</Label>
            <div className="flex gap-2">
              <Input 
                value={customCertInput}
                onChange={(e) => setCustomCertInput(e.target.value)}
                placeholder="Enter custom certification"
                className="bg-black/20"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCertification())}
                data-testid="custom-cert-input"
              />
              <Button variant="outline" onClick={addCustomCertification} data-testid="add-custom-cert-btn">Add</Button>
            </div>
            {productForm.customCertifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {productForm.customCertifications.map(cert => (
                  <Badge key={cert} variant="secondary" className="gap-1">
                    {cert}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-400" onClick={() => removeCustomCertification(cert)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      {/* TAB 4: Media, Tags & AI Summary */}
      <TabsContent value="media" className="space-y-6 mt-0">
        {/* Image Upload */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image className="h-4 w-4 text-primary" />
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Product Images</Label>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mb-3">
            {productForm.images.map((img, idx) => (
              <div key={img.id} className={`relative group rounded-sm overflow-hidden border-2 ${productForm.primaryImageIndex === idx ? 'border-primary' : 'border-transparent'}`}>
                <img src={img.url} alt={img.name} className="w-full h-20 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white hover:text-primary"
                    onClick={() => setPrimaryImage(idx)}
                    title="Set as primary"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white hover:text-red-400"
                    onClick={() => removeImage(img.id)}
                    title="Remove"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                {productForm.primaryImageIndex === idx && (
                  <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1 rounded">Primary</span>
                )}
              </div>
            ))}
            <button 
              onClick={handleImageUpload}
              className="h-20 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
              data-testid="upload-image-btn"
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Add Image</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Upload multiple images. Click checkmark to set primary image for listings.</p>
        </div>

        <Separator />

        {/* Documents */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Documents</Label>
          </div>
          
          <div className="space-y-3">
            {/* Datasheet */}
            <div className="p-3 bg-muted/20 rounded-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Product Datasheet (PDF)</span>
                </div>
                {productForm.datasheet ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{productForm.datasheet.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setProductForm({ ...productForm, datasheet: null })}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleDocumentUpload('datasheet')} data-testid="upload-datasheet-btn">
                    <Upload className="h-3 w-3 mr-1" />Upload
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Upload datasheet for better buyer trust</p>
            </div>

            {/* Technical Documents */}
            <div className="p-3 bg-muted/20 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Technical Documents</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDocumentUpload('technical')} data-testid="upload-techdoc-btn">
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </div>
              {productForm.technicalDocs.length > 0 && (
                <div className="space-y-1">
                  {productForm.technicalDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between py-1 px-2 bg-black/20 rounded">
                      <span className="text-xs">{doc.name}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeTechnicalDoc(doc.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video */}
            <div className="p-3 bg-muted/20 rounded-sm">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Product Video (Optional)</span>
              </div>
              <Input 
                value={productForm.videoUrl}
                onChange={(e) => setProductForm({ ...productForm, videoUrl: e.target.value })}
                placeholder="Paste YouTube/Vimeo URL or upload video"
                className="bg-black/20"
                data-testid="video-url-input"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Industry Tags & Use Case */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-primary" />
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Industry Tags</Label>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {industryTagOptions.map(tag => (
              <Badge 
                key={tag}
                variant={productForm.industryTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleIndustryTag(tag)}
                data-testid={`tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Application / Use Case</Label>
            <Textarea 
              value={productForm.applicationUseCase}
              onChange={(e) => setProductForm({ ...productForm, applicationUseCase: e.target.value })}
              placeholder="Describe typical applications and use cases for this product"
              className="bg-black/20 mt-1 min-h-[80px]"
              data-testid="use-case-input"
            />
          </div>
        </div>

        <Separator />

        {/* AI Summary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">AI-Ready Product Summary (Optional)</Label>
          </div>
          <Textarea 
            value={productForm.aiSummary}
            onChange={(e) => setProductForm({ ...productForm, aiSummary: e.target.value })}
            placeholder="Short structured summary for AI-powered search relevance. Include key specs, applications, and differentiators."
            className="bg-black/20 mt-1 min-h-[80px]"
            data-testid="ai-summary-input"
          />
          <p className="text-xs text-muted-foreground mt-1">This helps improve search relevance and AI-powered recommendations</p>
        </div>
      </TabsContent>

      {/* TAB 5: PREVIEW - How Buyers Will See Your Product */}
      <TabsContent value="preview" className="mt-0">
        <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-sm mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Buyer Preview Mode</span>
          </div>
          <p className="text-xs text-muted-foreground">This is how your product will appear to buyers in the marketplace</p>
        </div>

        {/* Preview Content - Mimics Buyer Product Detail View */}
        <div className="space-y-6 border border-border rounded-sm p-4 bg-card/50">
          {/* Product Header with Image */}
          <div className="flex gap-6">
            {/* Image Gallery Preview */}
            <div className="w-48 flex-shrink-0">
              {productForm.images.length > 0 ? (
                <div className="space-y-2">
                  <img 
                    src={productForm.images[productForm.primaryImageIndex]?.url || productForm.images[0]?.url} 
                    alt="Primary" 
                    className="w-full h-32 object-cover rounded-sm bg-muted"
                  />
                  {productForm.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-1">
                      {productForm.images.slice(0, 4).map((img, idx) => (
                        <img key={idx} src={img.url} alt={`Thumb ${idx + 1}`} className={`w-full h-8 object-cover rounded-sm ${idx === productForm.primaryImageIndex ? 'ring-1 ring-primary' : ''}`} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-32 bg-muted rounded-sm flex items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase">
                    {productForm.name || <span className="text-muted-foreground italic">Product Name</span>}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {productForm.category || "Category"} • {productForm.subcategory || "Subcategory"}
                  </p>
                </div>
                <Badge variant="outline" className="text-amber-400 border-amber-400/50">Preview</Badge>
              </div>

              {/* Short Description */}
              <p className="text-sm text-muted-foreground mb-4">
                {productForm.shortDescription || <span className="italic">Short description will appear here...</span>}
              </p>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 bg-muted/30 rounded-sm">
                  <p className="text-[10px] uppercase text-muted-foreground flex items-center gap-1"><Globe className="h-3 w-3" />Origin</p>
                  <p className="text-sm font-medium">{productForm.countryOfOrigin || "—"}</p>
                </div>
                <div className="p-2 bg-muted/30 rounded-sm">
                  <p className="text-[10px] uppercase text-muted-foreground flex items-center gap-1"><Truck className="h-3 w-3" />Lead Time</p>
                  <p className="text-sm font-medium">{productForm.leadTime ? `${productForm.leadTime} ${productForm.leadTimeUnit}` : "—"}</p>
                </div>
                <div className="p-2 bg-muted/30 rounded-sm">
                  <p className="text-[10px] uppercase text-muted-foreground flex items-center gap-1"><Package className="h-3 w-3" />Availability</p>
                  <p className="text-sm font-medium capitalize">{productForm.availability?.replace('-', ' ') || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Technical Specifications Preview */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />Technical Specifications
            </h3>
            {productForm.specifications.filter(s => s.key && s.value).length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {productForm.specifications.filter(s => s.key && s.value).map((spec, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-muted/20 rounded-sm">
                    <span className="text-sm text-muted-foreground">{spec.key}</span>
                    <span className="text-sm font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No specifications added yet</p>
            )}
          </div>

          {/* Dimensions Preview */}
          {(productForm.dimensions.length || productForm.dimensions.width || productForm.dimensions.height || productForm.dimensions.weight) && (
            <>
              <Separator />
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />Dimensions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {productForm.dimensions.length && <Badge variant="secondary">L: {productForm.dimensions.length}</Badge>}
                  {productForm.dimensions.width && <Badge variant="secondary">W: {productForm.dimensions.width}</Badge>}
                  {productForm.dimensions.height && <Badge variant="secondary">H: {productForm.dimensions.height}</Badge>}
                  {productForm.dimensions.weight && <Badge variant="secondary"><Weight className="h-3 w-3 mr-1" />{productForm.dimensions.weight}</Badge>}
                  {productForm.dimensions.volume && <Badge variant="secondary"><Box className="h-3 w-3 mr-1" />{productForm.dimensions.volume}</Badge>}
                </div>
              </div>
            </>
          )}

          {/* Certifications Preview */}
          {([...productForm.certifications, ...productForm.customCertifications].length > 0) && (
            <>
              <Separator />
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...productForm.certifications, ...productForm.customCertifications].map((cert, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1">
                      <Award className="h-3 w-3" />{cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Industry Tags Preview */}
          {productForm.industryTags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />Industry Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {productForm.industryTags.map((tag, idx) => (
                    <Badge key={idx}>{tag}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Detailed Description Preview */}
          {productForm.detailedDescription && (
            <>
              <Separator />
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Detailed Description</h3>
                <p className="text-sm whitespace-pre-wrap">{productForm.detailedDescription}</p>
              </div>
            </>
          )}

          {/* Application / Use Case Preview */}
          {productForm.applicationUseCase && (
            <>
              <Separator />
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Application / Use Case</h3>
                <p className="text-sm">{productForm.applicationUseCase}</p>
              </div>
            </>
          )}

          {/* Documents Preview */}
          {(productForm.datasheet || productForm.technicalDocs.length > 0 || productForm.videoUrl) && (
            <>
              <Separator />
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />Documents & Media
                </h3>
                <div className="flex flex-wrap gap-2">
                  {productForm.datasheet && (
                    <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" />Datasheet Available</Badge>
                  )}
                  {productForm.technicalDocs.length > 0 && (
                    <Badge variant="outline" className="gap-1"><Layers className="h-3 w-3" />{productForm.technicalDocs.length} Technical Doc{productForm.technicalDocs.length > 1 ? 's' : ''}</Badge>
                  )}
                  {productForm.videoUrl && (
                    <Badge variant="outline" className="gap-1"><Video className="h-3 w-3" />Video Available</Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Supplier Info (Your Company) */}
          <Separator />
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-sm">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Supplied By</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-sm bg-primary/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{supplier.name}</p>
                <p className="text-xs text-muted-foreground">{supplier.type} • {supplier.country}</p>
              </div>
              <div className="ml-auto">
                <RatingStars rating={supplier.rating} size="sm" />
              </div>
            </div>
          </div>

          {/* Preview Completeness Indicator */}
          <div className="p-3 bg-muted/30 rounded-sm">
            <p className="text-xs text-muted-foreground mb-2">Product Listing Completeness</p>
            <div className="flex items-center gap-3">
              <Progress value={calculateCompleteness()} className="flex-1 h-2" />
              <span className="text-sm font-medium">{calculateCompleteness()}%</span>
            </div>
            {calculateCompleteness() < 70 && (
              <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Add more details to improve discoverability
              </p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  // Calculate product completeness percentage
  const calculateCompleteness = () => {
    let score = 0;
    let total = 10;
    
    if (productForm.name) score++;
    if (productForm.category) score++;
    if (productForm.shortDescription) score++;
    if (productForm.detailedDescription) score++;
    if (productForm.specifications.filter(s => s.key && s.value).length > 0) score++;
    if (productForm.countryOfOrigin) score++;
    if (productForm.leadTime) score++;
    if ([...productForm.certifications, ...productForm.customCertifications].length > 0) score++;
    if (productForm.images.length > 0) score++;
    if (productForm.industryTags.length > 0) score++;
    
    return Math.round((score / total) * 100);
  };

  return (
    <>
      {renderContent()}
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />Confirm Action
            </DialogTitle>
            <DialogDescription className="pt-2">{confirmDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Cancel</Button>
            <Button onClick={handleConfirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog - FULL FORM */}
      <Dialog open={addProductDialog} onOpenChange={setAddProductDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />Add New Product
            </DialogTitle>
            <DialogDescription>Complete all sections to create a comprehensive product listing. Products will be submitted for admin approval.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="py-4">
              <ProductFormContent isEdit={false} />
            </div>
          </ScrollArea>
          <DialogFooter className="border-t pt-4">
            <div className="flex items-center gap-2 mr-auto text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>Product will be submitted for approval</span>
            </div>
            <Button variant="outline" onClick={() => setAddProductDialog(false)}>Cancel</Button>
            <Button onClick={handleAddProduct} data-testid="submit-product-btn">
              <Plus className="h-4 w-4 mr-1" />Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog - FULL FORM */}
      <Dialog open={editProductDialog.open} onOpenChange={(open) => setEditProductDialog({ ...editProductDialog, open })}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />Edit Product
            </DialogTitle>
            <DialogDescription>Update product details. Changes will reset status to pending and require admin approval.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="py-4">
              <ProductFormContent isEdit={true} />
            </div>
          </ScrollArea>
          <DialogFooter className="border-t pt-4">
            <div className="flex items-center gap-2 mr-auto text-xs text-amber-400">
              <AlertTriangle className="h-3 w-3" />
              <span>Editing will reset status to Pending Approval</span>
            </div>
            <Button variant="outline" onClick={() => setEditProductDialog({ open: false, item: null })}>Cancel</Button>
            <Button onClick={handleEditProduct} data-testid="save-product-btn">
              <CheckCircle className="h-4 w-4 mr-1" />Save & Resubmit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileDialog} onOpenChange={setEditProfileDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Edit Company Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Company Name</Label>
              <Input value={profileForm.name || ""} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="bg-black/20 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Type</Label>
                <Select value={profileForm.type || ""} onValueChange={(value) => setProfileForm({ ...profileForm, type: value })}>
                  <SelectTrigger className="bg-black/20 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OEM">OEM</SelectItem>
                    <SelectItem value="Tier 1">Tier 1</SelectItem>
                    <SelectItem value="Tier 2">Tier 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Country</Label>
                <Input value={profileForm.country || ""} onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })} className="bg-black/20 mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input value={profileForm.email || ""} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="bg-black/20 mt-1" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Phone</Label>
              <Input value={profileForm.phone || ""} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="bg-black/20 mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} data-testid="save-profile-btn">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDocDialog.open} onOpenChange={(open) => setUploadDocDialog({ ...uploadDocDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Re-upload Document</DialogTitle>
            {uploadDocDialog.document && (
              <DialogDescription>Uploading new version of: {uploadDocDialog.document.name}</DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-border rounded-sm p-8 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click or drag file to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOC up to 10MB</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDocDialog({ open: false, document: null })}>Cancel</Button>
            <Button onClick={handleUploadDocument} data-testid="upload-doc-btn">Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply to Review Dialog */}
      <Dialog open={replyReviewDialog.open} onOpenChange={(open) => setReplyReviewDialog({ ...replyReviewDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Reply to Review</DialogTitle>
            {replyReviewDialog.rating && (
              <DialogDescription>Responding to {replyReviewDialog.rating.buyerName}'s review</DialogDescription>
            )}
          </DialogHeader>
          {replyReviewDialog.rating && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted/30 rounded-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{replyReviewDialog.rating.productName}</span>
                  <RatingStars rating={replyReviewDialog.rating.rating} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">{replyReviewDialog.rating.review}</p>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Your Reply</Label>
                <Textarea 
                  value={reviewReplyText} 
                  onChange={(e) => setReviewReplyText(e.target.value)} 
                  placeholder="Write your response to the review..." 
                  className="bg-black/20 mt-1 min-h-[120px]"
                  data-testid="review-reply-textarea"
                />
                <p className="text-xs text-muted-foreground mt-2">Your reply will be submitted for admin approval before being visible.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyReviewDialog({ open: false, rating: null })}>Cancel</Button>
            <Button onClick={handleSubmitReviewReply} data-testid="submit-review-reply-btn">Submit Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Sheet */}
      <Sheet open={viewSheet.open && viewSheet.type === "product"} onOpenChange={(open) => setViewSheet({ ...viewSheet, open })}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Product Details</SheetTitle>
          </SheetHeader>
          {viewSheet.item && (
            <div className="mt-6 space-y-6">
              <img src={viewSheet.item.image} alt={viewSheet.item.name} className="w-full h-48 object-cover rounded-sm bg-muted" />
              <div className="flex items-start justify-between">
                <div><h3 className="text-lg font-semibold">{viewSheet.item.name}</h3><p className="text-sm text-muted-foreground">{viewSheet.item.category} • {viewSheet.item.subcategory}</p></div>
                <StatusBadge status={viewSheet.item.status} />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs uppercase text-muted-foreground">Lead Time</p><p className="text-sm font-medium">{viewSheet.item.leadTime || "N/A"}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Origin</p><p className="text-sm font-medium">{viewSheet.item.countryOfOrigin || "N/A"}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Availability</p><p className="text-sm font-medium capitalize">{viewSheet.item.availability?.replace('-', ' ') || "N/A"}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Rating</p>{viewSheet.item.rating > 0 ? <RatingStars rating={viewSheet.item.rating} size="sm" /> : <span className="text-sm text-muted-foreground">No ratings</span>}</div>
              </div>
              {viewSheet.item.specifications?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground mb-2">Technical Specifications</h4>
                    <div className="space-y-1">
                      {viewSheet.item.specifications.map((spec, idx) => (
                        <p key={idx} className="text-sm">{spec}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {viewSheet.item.certifications?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-xs uppercase text-muted-foreground mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewSheet.item.certifications.map((cert, idx) => (
                        <Badge key={idx} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <div><h4 className="text-xs uppercase text-muted-foreground mb-2">Description</h4><p className="text-sm">{viewSheet.item.description || "No description"}</p></div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* View Enquiry Sheet */}
      <Sheet open={viewSheet.open && viewSheet.type === "enquiry"} onOpenChange={(open) => setViewSheet({ ...viewSheet, open })}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Enquiry Details</SheetTitle>
          </SheetHeader>
          {viewSheet.item && (
            <div className="mt-6 space-y-6">
              <div className="flex items-start justify-between">
                <div><h3 className="text-lg font-semibold">{viewSheet.item.productName}</h3><p className="text-sm text-muted-foreground">ID: {viewSheet.item.id}</p></div>
                <StatusBadge status={viewSheet.item.status} />
              </div>
              <Separator />
              <div className="p-4 bg-muted/30 rounded-sm">
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /><span className="font-medium">{viewSheet.item.buyerName}</span></div>
                <p className="text-sm text-muted-foreground">{viewSheet.item.buyerCompany}</p>
              </div>
              <div><h4 className="text-xs uppercase text-muted-foreground mb-2">Message</h4><p className="text-sm p-3 bg-muted/20 rounded-sm">{viewSheet.item.message}</p></div>
              {viewSheet.item.reply && (
                <><Separator /><div><h4 className="text-xs uppercase text-muted-foreground mb-2">Your Reply</h4><p className="text-sm p-3 bg-primary/10 rounded-sm">{viewSheet.item.reply}</p><p className="text-xs text-muted-foreground mt-1">Sent on {viewSheet.item.replyDate}</p></div></>
              )}
              <div className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />Received on {viewSheet.item.date}</div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Reply Enquiry Sheet */}
      <Sheet open={replySheet.open} onOpenChange={(open) => setReplySheet({ ...replySheet, open })}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Reply to Enquiry</SheetTitle>
          </SheetHeader>
          {replySheet.item && (
            <div className="mt-6 space-y-6">
              <div className="p-4 bg-muted/30 rounded-sm">
                <p className="text-xs uppercase text-muted-foreground mb-2">Original Message</p>
                <p className="text-sm">{replySheet.item.message}</p>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Your Reply</Label>
                <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply here..." className="bg-black/20 mt-2 min-h-[150px]" data-testid="enquiry-reply-textarea" />
              </div>
              <Button onClick={handleSendReply} className="w-full gap-2" data-testid="send-reply-btn"><Send className="h-4 w-4" />Send Reply</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* View Rating Sheet */}
      <Sheet open={viewSheet.open && viewSheet.type === "rating"} onOpenChange={(open) => setViewSheet({ ...viewSheet, open })}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-['Barlow_Condensed'] uppercase tracking-wide">Review Details</SheetTitle>
          </SheetHeader>
          {viewSheet.item && (
            <div className="mt-6 space-y-6">
              <div><h3 className="text-lg font-semibold">{viewSheet.item.productName}</h3><p className="text-sm text-muted-foreground">by {viewSheet.item.buyerName}</p></div>
              <div className="p-4 bg-muted/30 rounded-sm text-center">
                <RatingStars rating={viewSheet.item.rating} size="lg" />
                <p className="text-3xl font-bold font-['Barlow_Condensed'] mt-2">{viewSheet.item.rating}.0</p>
              </div>
              <Separator />
              <div><h4 className="text-xs uppercase text-muted-foreground mb-2">Review</h4><p className="text-sm">{viewSheet.item.review}</p></div>
              {viewSheet.item.supplierReply && (
                <><Separator /><div className={`p-3 rounded-sm ${viewSheet.item.supplierReplyStatus === 'approved' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                  <div className="flex justify-between mb-2"><h4 className="text-xs uppercase text-muted-foreground">Your Reply</h4><StatusBadge status={viewSheet.item.supplierReplyStatus || 'pending'} /></div>
                  <p className="text-sm">{viewSheet.item.supplierReply}</p>
                </div></>
              )}
              <div className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />Submitted on {viewSheet.item.submissionDate}</div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

// Supplier Overview Section
const SupplierOverview = ({ stats, supplier, expiringDocs, onNavigate }) => {
  return (
    <div className="space-y-8" data-testid="supplier-overview">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">Supplier Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {supplier.name}</p>
      </div>

      {/* Document Expiry Alerts */}
      {expiringDocs.length > 0 && (
        <div className="space-y-2">
          {expiringDocs.map((doc, idx) => (
            <button 
              key={idx}
              onClick={() => onNavigate('profile')}
              className={`w-full p-3 rounded-sm flex items-center gap-3 text-left transition-colors ${
                doc.status === 'expired' ? 'bg-red-500/10 border border-red-500/20 hover:border-red-500/40' : 'bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40'
              }`}
              data-testid={`doc-alert-${idx}`}
            >
              {doc.status === 'expired' ? <FileX className="h-5 w-5 text-red-400" /> : <FileWarning className="h-5 w-5 text-amber-400" />}
              <div className="flex-1">
                <p className={`text-sm font-medium ${doc.status === 'expired' ? 'text-red-400' : 'text-amber-400'}`}>
                  {doc.status === 'expired' ? `Your ${doc.name} has expired. Please re-upload.` : `Your ${doc.name} expires on ${doc.expiryDate}. Please renew.`}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Profile Views" value={stats.profileViews.toLocaleString()} icon={Eye} trend="up" trendValue="+18%" testId="stat-profile-views" />
        <StatCard title="Total Enquiries" value={stats.totalEnquiries} icon={Inbox} trend="up" trendValue="+12%" testId="stat-total-enquiries" />
        <StatCard title="Active Products" value={stats.activeProducts} icon={Package} testId="stat-active-products" />
        <StatCard title="Average Rating" value={stats.averageRating.toFixed(1)} icon={Star} testId="stat-average-rating" />
        <StatCard title="Pending Approvals" value={stats.pendingProductApprovals} icon={Clock} testId="stat-pending-approvals" className="bg-amber-500/5 border-amber-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <div className="dashboard-card-header"><h3 className="dashboard-card-title">Company Overview</h3><Building2 className="h-4 w-4 text-muted-foreground" /></div>
          <div className="dashboard-card-content space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-sm bg-primary/20 flex items-center justify-center"><Building2 className="h-8 w-8 text-primary" /></div>
              <div><h4 className="font-semibold text-lg">{supplier.name}</h4><p className="text-sm text-muted-foreground">{supplier.type} • {supplier.country}</p></div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-sm flex items-center gap-1"><Award className="h-3 w-3" />{cert}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header"><h3 className="dashboard-card-title">Performance Metrics</h3><TrendingUp className="h-4 w-4 text-muted-foreground" /></div>
          <div className="dashboard-card-content space-y-4">
            <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Profile Completion</span><span className="text-sm font-medium">85%</span></div><Progress value={85} className="h-2" /></div>
            <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Response Rate</span><span className="text-sm font-medium">92%</span></div><Progress value={92} className="h-2" /></div>
            <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Product Quality Score</span><span className="text-sm font-medium">96%</span></div><Progress value={96} className="h-2" /></div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2"><Award className="h-5 w-5 text-amber-400" /><span className="text-sm font-medium">Verified Supplier</span></div>
              <RatingStars rating={supplier.rating} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Company Profile Section
const CompanyProfile = ({ supplier, onEdit, onUploadDoc }) => {
  return (
    <div className="space-y-6" data-testid="company-profile">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">Company Profile</h1><p className="text-sm text-muted-foreground">Manage your company information</p></div>
        <Button onClick={onEdit} className="gap-2" data-testid="edit-profile-btn"><Edit className="h-4 w-4" />Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="dashboard-card">
            <div className="dashboard-card-header"><h3 className="dashboard-card-title">Company Information</h3></div>
            <div className="dashboard-card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Company Name</p><p className="font-medium">{supplier.name}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Supplier Type</p><p className="font-medium">{supplier.type}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Country</p><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{supplier.country}</span></div></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</p><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{supplier.email}</span></div></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Phone</p><div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{supplier.phone}</span></div></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Member Since</p><div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{supplier.joinDate}</span></div></div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="dashboard-card">
            <div className="dashboard-card-header"><h3 className="dashboard-card-title">Documents & Certifications</h3></div>
            <div className="dashboard-card-content space-y-3">
              {supplier.documents?.map((doc, idx) => (
                <div key={idx} className={`p-3 rounded-sm flex items-center justify-between ${
                  doc.status === 'expired' ? 'bg-red-500/10 border border-red-500/20' :
                  doc.status === 'expiring' ? 'bg-amber-500/10 border border-amber-500/20' :
                  'bg-muted/30'
                }`}>
                  <div className="flex items-center gap-3">
                    {doc.status === 'expired' ? <FileX className="h-5 w-5 text-red-400" /> :
                     doc.status === 'expiring' ? <FileWarning className="h-5 w-5 text-amber-400" /> :
                     <FileCheck className="h-5 w-5 text-emerald-400" />}
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className={`text-xs ${doc.status === 'expired' ? 'text-red-400' : doc.status === 'expiring' ? 'text-amber-400' : 'text-muted-foreground'}`}>
                        {doc.status === 'expired' ? 'EXPIRED' : `Expires: ${doc.expiryDate}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => onUploadDoc(doc)} data-testid={`reupload-doc-${idx}`}>
                    <RefreshCw className="h-3 w-3" />Re-upload
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header"><h3 className="dashboard-card-title">Certifications</h3></div>
            <div className="dashboard-card-content">
              <div className="flex flex-wrap gap-3">
                {supplier.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-sm">
                    <Award className="h-4 w-4 text-primary" /><span className="text-sm font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="dashboard-card">
            <div className="dashboard-card-header"><h3 className="dashboard-card-title">Profile Completion</h3></div>
            <div className="dashboard-card-content">
              <div className="text-center mb-4"><span className="text-4xl font-bold font-['Barlow_Condensed']">85%</span></div>
              <Progress value={85} className="h-2 mb-4" />
              <p className="text-xs text-muted-foreground">Complete your profile to increase visibility</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Supplier Product Management Section
const SupplierProductManagement = ({ products, onView, onEdit, onDelete, onAddProduct }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredProducts = statusFilter === "all" ? products : products.filter(p => p.status === statusFilter);

  const columns = [
    { key: "name", label: "Product Name", render: (value, row) => (
      <div className="flex items-center gap-3">
        <img src={row.image} alt={value} className="h-10 w-14 rounded-sm object-cover bg-muted" />
        <div><p className="font-medium">{value}</p><p className="text-xs text-muted-foreground">{row.subcategory}</p></div>
      </div>
    )},
    { key: "category", label: "Category" },
    { key: "rating", label: "Rating", render: (value) => value > 0 ? <RatingStars rating={value} size="sm" /> : <span className="text-xs text-muted-foreground">No ratings</span> },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
    { key: "actions", label: "Actions", render: (_, row) => (
      <ActionButtonGroup>
        <ActionButton icon={Eye} label="View" testId={`view-product-${row.id}`} onClick={() => onView(row)} />
        <ActionButton icon={Edit} label="Edit" testId={`edit-product-${row.id}`} onClick={() => onEdit(row)} />
        <ActionButton icon={Trash2} label="Delete" className="text-red-400 hover:text-red-300" testId={`delete-product-${row.id}`} onClick={() => onDelete(row)} />
      </ActionButtonGroup>
    )},
  ];

  return (
    <div className="space-y-6" data-testid="supplier-product-management">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">Product Management</h1><p className="text-sm text-muted-foreground">Manage your product listings</p></div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-black/20" data-testid="product-status-filter"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onAddProduct} className="gap-2" data-testid="add-product-btn"><Plus className="h-4 w-4" />Add Product</Button>
        </div>
      </div>
      <DataTable columns={columns} data={filteredProducts} searchPlaceholder="Search products..." searchKey="name" pageSize={5} testId="supplier-products-table" />
    </div>
  );
};

// Supplier Enquiries Section
const SupplierEnquiries = ({ enquiries, onView, onReply }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredEnquiries = statusFilter === "all" ? enquiries : enquiries.filter(e => e.status === statusFilter);

  const columns = [
    { key: "buyerName", label: "Buyer", render: (value, row) => (<div><p className="font-medium">{value}</p><p className="text-xs text-muted-foreground">{row.buyerCompany}</p></div>)},
    { key: "productName", label: "Product" },
    { key: "message", label: "Message", render: (value) => <p className="text-sm max-w-xs truncate">{value}</p> },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
    { key: "actions", label: "Actions", render: (_, row) => (
      <ActionButtonGroup>
        <ActionButton icon={Eye} label="View" testId={`view-enquiry-${row.id}`} onClick={() => onView(row)} />
        <ActionButton icon={MessageSquare} label="Reply" className="text-primary hover:text-primary/80" testId={`reply-enquiry-${row.id}`} onClick={() => onReply(row)} />
      </ActionButtonGroup>
    )},
  ];

  return (
    <div className="space-y-6" data-testid="supplier-enquiries">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">Enquiries</h1><p className="text-sm text-muted-foreground">Manage buyer enquiries</p></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] bg-black/20" data-testid="enquiry-status-filter"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filteredEnquiries} searchPlaceholder="Search enquiries..." searchKey="buyerName" pageSize={5} testId="supplier-enquiries-table" />
    </div>
  );
};

// Supplier Ratings Section with Reply
const SupplierRatings = ({ ratings, supplier, onViewReview, onReplyReview }) => {
  return (
    <div className="space-y-6" data-testid="supplier-ratings">
      <div><h1 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-wide mb-1">Ratings & Reviews</h1><p className="text-sm text-muted-foreground">View and respond to customer reviews</p></div>

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

      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="dashboard-card"><div className="dashboard-card-content text-center py-8"><Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No reviews yet</p></div></div>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="dashboard-card" data-testid={`review-card-${rating.id}`}>
              <div className="dashboard-card-content">
                <div className="flex items-start justify-between mb-3">
                  <div><p className="font-medium">{rating.buyerName}</p><p className="text-xs text-muted-foreground">{rating.productName}</p></div>
                  <div className="text-right"><RatingStars rating={rating.rating} size="sm" /><p className="text-xs text-muted-foreground mt-1">{rating.submissionDate}</p></div>
                </div>
                <p className="text-sm text-muted-foreground">{rating.review}</p>
                {rating.supplierReply && (
                  <div className={`mt-3 p-3 rounded-sm ${rating.supplierReplyStatus === 'approved' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                    <div className="flex justify-between mb-1"><span className="text-xs uppercase text-muted-foreground">Your Reply</span><StatusBadge status={rating.supplierReplyStatus || 'pending'} /></div>
                    <p className="text-sm">{rating.supplierReply}</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-border flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => onViewReview(rating)} data-testid={`view-review-${rating.id}`}><Eye className="h-3 w-3" />View</Button>
                  {!rating.supplierReply && (
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => onReplyReview(rating)} data-testid={`reply-review-${rating.id}`}><MessageSquare className="h-3 w-3" />Reply</Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
