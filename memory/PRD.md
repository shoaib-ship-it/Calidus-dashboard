# B2B Defense Supplier Marketplace - Product Requirements Document

## Original Problem Statement
Build a fully interactive, frontend-only prototype for a B2B Defense Supplier Marketplace dashboard with role-based views (Admin, Supplier, Buyer). The application must feature realistic mock data, a dark defense-themed UI, and state-managed interactive elements for a demo-ready prototype.

## Core Requirements
- **NO BACKEND** - All interactions handled via React state
- Role-based dashboards: Admin, Supplier, Buyer
- Dark defense-themed UI using Tailwind CSS + Shadcn UI
- All buttons must trigger modals, sheets, or status changes (no dead clicks)

---

## What's Been Implemented

### Phase 1: Core Dashboard Structure ✅
- Global DashboardShell with role selector
- Navigation sidebar with role-specific sections
- Notifications and messaging UI
- Dark defense theme with Barlow Condensed typography

### Phase 2: Admin Dashboard ✅
- **Overview**: Stats cards, pending approvals, charts (Category Demand Trends, Top Rated Suppliers)
- **Supplier Management**: Table with filters (Status, Doc Status), View/Approve/Reject/Suspend/Delete actions
- **Product Management**: 
  - Table with Supplier Name column
  - 3 filter dropdowns (Supplier, Category, Status)
  - Enhanced Product View with 4 tabs (Overview, Specs, Media, Supplier)
- **Ratings Moderation**: Approve/Reject ratings and supplier replies
- **Category Management**: Nested categories/subcategories with add/edit/delete
- **Buyer Management**: View profiles, suspend/delete actions
- **Platform Insights**: Analytics charts

### Phase 3: Supplier Dashboard ✅
- **Overview**: Profile views, enquiries, active products, ratings stats
- **Company Profile**: Edit profile, document management with expiry tracking
- **Product Management**: 
  - Comprehensive 4-tab Add/Edit Product form:
    1. Basic Info (name, category, subcategory, descriptions)
    2. Specs & Dimensions (dynamic key-value specs, physical dimensions)
    3. Origin & Certs (country, lead time, availability, certifications)
    4. Media & Tags (images, datasheet, technical docs, video, industry tags, AI summary)
  - Status resets to "Pending Approval" on edit
- **Enquiries**: View and reply to buyer enquiries
- **Ratings**: View reviews and submit replies (pending admin approval)

### Phase 4: Buyer Dashboard 🔄 (Partial)
- Basic structure implemented
- Needs alignment with latest mockData structure

### Phase 5: Data Alignment ✅
- Product data structure consistent across Admin/Supplier views
- Supplier information linked to products
- Mock data in `/app/frontend/src/data/mockData.js`

---

## Technical Architecture

```
/app/frontend/src/
├── App.js                          # Main app with routing & role context
├── index.css                       # Global styles + Tailwind
├── components/
│   ├── layout/DashboardShell.jsx   # Main layout wrapper
│   ├── shared/                     # Reusable components
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── DataTable.jsx
│   │   ├── ActionButton.jsx
│   │   └── RatingStars.jsx
│   └── ui/                         # Shadcn UI components
├── data/mockData.js                # All mock data
└── pages/
    ├── AdminDashboard.jsx          # Admin role dashboard
    ├── SupplierDashboard.jsx       # Supplier role dashboard
    └── BuyerDashboard.jsx          # Buyer role dashboard
```

---

## Completed Features (April 9, 2026)

### Supplier Product Form Enhancement
- 4-tab form structure matching product detail page
- Dynamic technical specifications (add/edit/remove key-value pairs)
- Dimensions fields (length, width, height, weight, volume)
- Country of Origin dropdown with 19 countries
- Lead time with unit selector (days/weeks/months)
- Availability options (In Stock / Made to Order)
- 17 defense industry certifications with custom input
- Multi-image upload with primary image selection
- Datasheet and technical document uploads
- Video URL input
- 15 industry tags (UAV, Naval, Radar, etc.)
- Application/Use Case text field
- AI-Ready Product Summary field
- Form validation with inline errors
- Status reset to "Pending Approval" on edit

### Admin Product View Enhancement
- Tabbed interface: Overview, Specs, Media, Supplier
- Overview tab: Product image gallery, name, category, Origin & Delivery, description, rating
- Specs tab: Technical specifications table, dimensions, certifications
- Media tab: Images, datasheet download, technical docs, video link
- Supplier tab: Full supplier info with View Profile button, rating, product count, contact info, certifications

### Admin Product Management Table
- Added Supplier Name column with icon
- 3 filter dropdowns: Supplier, Category, Status
- Search across products and suppliers

### Admin Overview Cleanup
- Removed "Expiring in 7/15/30 Days" cards
- Kept only "Expired Documents" card

---

## Backlog / Future Tasks

### P0 - High Priority
- [ ] Complete BuyerDashboard.jsx updates to match new data structure
- [ ] Disable review edit button after submission (Buyer)

### P1 - Medium Priority
- [ ] Add product search/browse page for Buyers
- [ ] Implement RFQ (Request for Quote) flow
- [ ] Add product comparison feature

### P2 - Low Priority
- [ ] Export data to CSV/PDF
- [ ] Advanced analytics for suppliers
- [ ] Notification preferences settings

---

## Mock Data Structure

### Products
```javascript
{
  id, name, supplierId, supplierName, category, subcategory,
  shortDescription, description, specifications[], dimensions{},
  countryOfOrigin, leadTime, availability, certifications[],
  industryTags[], applicationUseCase, aiSummary,
  images[], primaryImageIndex, datasheet, technicalDocs[], videoUrl,
  rating, status, image
}
```

### Suppliers
```javascript
{
  id, name, email, phone, country, type, status,
  productsCount, rating, certifications[], documents[],
  documentStatus, profileViews, joinDate
}
```
