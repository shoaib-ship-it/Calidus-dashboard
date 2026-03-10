// Mock Data for B2B Defense Supplier Marketplace Dashboard

export const suppliers = [
  {
    id: 'SUP001',
    name: 'Orion Defense Systems',
    type: 'OEM',
    country: 'United States',
    productsCount: 47,
    rating: 4.8,
    status: 'active',
    email: 'contact@oriondefense.com',
    phone: '+1 (555) 234-5678',
    certifications: ['ISO 9001', 'AS9100D', 'ITAR'],
    joinDate: '2023-03-15',
    profileViews: 2847,
    totalEnquiries: 156,
    image: 'https://images.unsplash.com/photo-1607867992871-34951585c280?w=100&h=100&fit=crop'
  },
  {
    id: 'SUP002',
    name: 'Falcon Aerospace Technologies',
    type: 'Tier 1',
    country: 'Germany',
    productsCount: 32,
    rating: 4.6,
    status: 'active',
    email: 'info@falconaero.de',
    phone: '+49 30 12345678',
    certifications: ['ISO 9001', 'EN9100', 'NADCAP'],
    joinDate: '2023-06-22',
    profileViews: 1923,
    totalEnquiries: 89,
    image: 'https://images.unsplash.com/photo-1770411034013-e6cb865ed21a?w=100&h=100&fit=crop'
  },
  {
    id: 'SUP003',
    name: 'Titan Tactical Manufacturing',
    type: 'OEM',
    country: 'United Kingdom',
    productsCount: 28,
    rating: 4.5,
    status: 'pending',
    email: 'sales@titantac.co.uk',
    phone: '+44 20 7946 0958',
    certifications: ['ISO 9001', 'Def Stan 05-57'],
    joinDate: '2024-01-08',
    profileViews: 567,
    totalEnquiries: 23,
    image: 'https://images.unsplash.com/photo-1717749789408-f6f73c9e6aac?w=100&h=100&fit=crop'
  },
  {
    id: 'SUP004',
    name: 'Vanguard Defense Electronics',
    type: 'Tier 2',
    country: 'Israel',
    productsCount: 54,
    rating: 4.9,
    status: 'active',
    email: 'contact@vanguardde.il',
    phone: '+972 3 123 4567',
    certifications: ['ISO 9001', 'AS9100D', 'MIL-STD'],
    joinDate: '2022-11-30',
    profileViews: 3456,
    totalEnquiries: 234,
    image: 'https://images.unsplash.com/photo-1769793153841-bc7c62bc9ac6?w=100&h=100&fit=crop'
  },
  {
    id: 'SUP005',
    name: 'Apex Armor Solutions',
    type: 'OEM',
    country: 'France',
    productsCount: 19,
    rating: 4.3,
    status: 'suspended',
    email: 'info@apexarmor.fr',
    phone: '+33 1 23 45 67 89',
    certifications: ['ISO 9001', 'AQAP 2110'],
    joinDate: '2023-08-14',
    profileViews: 892,
    totalEnquiries: 45,
    image: 'https://images.unsplash.com/photo-1771343917024-0b5397850ccd?w=100&h=100&fit=crop'
  },
  {
    id: 'SUP006',
    name: 'Nordic Defense Industries',
    type: 'Tier 1',
    country: 'Sweden',
    productsCount: 38,
    rating: 4.7,
    status: 'active',
    email: 'sales@nordicdef.se',
    phone: '+46 8 123 456 78',
    certifications: ['ISO 9001', 'AS9100D'],
    joinDate: '2023-02-28',
    profileViews: 2134,
    totalEnquiries: 112,
    image: 'https://images.unsplash.com/photo-1731363106135-83fb05b5accb?w=100&h=100&fit=crop'
  }
];

export const products = [
  {
    id: 'PRD001',
    name: 'UAV Propulsion System MK-V',
    supplierId: 'SUP001',
    supplierName: 'Orion Defense Systems',
    category: 'UAV & Aerospace',
    subcategory: 'Propulsion',
    rating: 4.9,
    status: 'approved',
    price: 'RFQ',
    description: 'Advanced propulsion system for tactical UAVs',
    specifications: ['Max Thrust: 50N', 'Weight: 2.3kg', 'Fuel: JP-8'],
    image: 'https://images.unsplash.com/photo-1607867992871-34951585c280?w=200&h=150&fit=crop'
  },
  {
    id: 'PRD002',
    name: 'Ballistic Armor Plates Level IV',
    supplierId: 'SUP003',
    supplierName: 'Titan Tactical Manufacturing',
    category: 'Defense Materials',
    subcategory: 'Body Armor',
    rating: 4.7,
    status: 'approved',
    price: 'RFQ',
    description: 'NIJ Level IV certified ceramic composite plates',
    specifications: ['Protection: Level IV', 'Weight: 2.8kg', 'Size: 10x12"'],
    image: 'https://images.unsplash.com/photo-1717749789408-f6f73c9e6aac?w=200&h=150&fit=crop'
  },
  {
    id: 'PRD003',
    name: 'Tactical Communication Module TCM-200',
    supplierId: 'SUP004',
    supplierName: 'Vanguard Defense Electronics',
    category: 'Tactical Electronics',
    subcategory: 'Communications',
    rating: 4.8,
    status: 'pending',
    price: 'RFQ',
    description: 'Encrypted multi-band tactical radio module',
    specifications: ['Bands: VHF/UHF', 'Encryption: AES-256', 'Range: 50km'],
    image: 'https://images.unsplash.com/photo-1769793153841-bc7c62bc9ac6?w=200&h=150&fit=crop'
  },
  {
    id: 'PRD004',
    name: 'Radar Signal Processing Unit RSP-500',
    supplierId: 'SUP002',
    supplierName: 'Falcon Aerospace Technologies',
    category: 'Surveillance Systems',
    subcategory: 'Radar',
    rating: 4.6,
    status: 'approved',
    price: 'RFQ',
    description: 'High-performance radar signal processor',
    specifications: ['Processing: 10 GFLOPS', 'Channels: 16', 'Interface: MIL-STD-1553'],
    image: 'https://images.unsplash.com/photo-1770411034013-e6cb865ed21a?w=200&h=150&fit=crop'
  },
  {
    id: 'PRD005',
    name: 'Night Vision Goggles NVG-7X',
    supplierId: 'SUP004',
    supplierName: 'Vanguard Defense Electronics',
    category: 'Surveillance Systems',
    subcategory: 'Night Vision',
    rating: 4.5,
    status: 'rejected',
    price: 'RFQ',
    description: 'Gen 3 white phosphor night vision system',
    specifications: ['Gen: 3+', 'FOV: 40°', 'Weight: 450g'],
    image: 'https://images.unsplash.com/photo-1771343917024-0b5397850ccd?w=200&h=150&fit=crop'
  },
  {
    id: 'PRD006',
    name: 'Armored Vehicle Power Pack AVP-800',
    supplierId: 'SUP006',
    supplierName: 'Nordic Defense Industries',
    category: 'Defense Materials',
    subcategory: 'Power Systems',
    rating: 4.8,
    status: 'approved',
    price: 'RFQ',
    description: 'Integrated power pack for armored vehicles',
    specifications: ['Power: 800hp', 'Torque: 2400Nm', 'Type: Diesel'],
    image: 'https://images.unsplash.com/photo-1731363106135-83fb05b5accb?w=200&h=150&fit=crop'
  },
  {
    id: 'PRD007',
    name: 'Drone Detection System DDS-100',
    supplierId: 'SUP001',
    supplierName: 'Orion Defense Systems',
    category: 'Surveillance Systems',
    subcategory: 'Counter-UAS',
    rating: 4.4,
    status: 'pending',
    price: 'RFQ',
    description: 'Multi-sensor drone detection and tracking',
    specifications: ['Range: 5km', 'Detection: RF/Radar/EO', 'Tracking: 50 targets'],
    image: 'https://images.unsplash.com/photo-1607867992871-34951585c280?w=200&h=150&fit=crop'
  },
  {
    id: 'PRD008',
    name: 'Composite Armor Panel CAP-III',
    supplierId: 'SUP005',
    supplierName: 'Apex Armor Solutions',
    category: 'Defense Materials',
    subcategory: 'Vehicle Armor',
    rating: 4.2,
    status: 'approved',
    price: 'RFQ',
    description: 'Lightweight composite armor for vehicles',
    specifications: ['Protection: STANAG 4569 L3', 'Weight: 45kg/m²', 'Thickness: 25mm'],
    image: 'https://images.unsplash.com/photo-1717749789408-f6f73c9e6aac?w=200&h=150&fit=crop'
  }
];

export const buyers = [
  {
    id: 'BUY001',
    name: 'James Mitchell',
    company: 'US Army Procurement Division',
    country: 'United States',
    enquiriesSent: 34,
    status: 'active',
    email: 'j.mitchell@army.mil',
    joinDate: '2023-05-12',
    ratingsSubmitted: 12
  },
  {
    id: 'BUY002',
    name: 'Sarah Chen',
    company: 'NATO Allied Command',
    country: 'Belgium',
    enquiriesSent: 28,
    status: 'active',
    email: 's.chen@nato.int',
    joinDate: '2023-07-20',
    ratingsSubmitted: 8
  },
  {
    id: 'BUY003',
    name: 'Hans Weber',
    company: 'Bundeswehr Procurement',
    country: 'Germany',
    enquiriesSent: 45,
    status: 'active',
    email: 'h.weber@bundeswehr.de',
    joinDate: '2022-12-05',
    ratingsSubmitted: 15
  },
  {
    id: 'BUY004',
    name: 'Marie Dubois',
    company: 'DGA France',
    country: 'France',
    enquiriesSent: 19,
    status: 'suspended',
    email: 'm.dubois@dga.gouv.fr',
    joinDate: '2024-01-15',
    ratingsSubmitted: 3
  },
  {
    id: 'BUY005',
    name: 'David Kim',
    company: 'ROK Defense Agency',
    country: 'South Korea',
    enquiriesSent: 52,
    status: 'active',
    email: 'd.kim@dapa.go.kr',
    joinDate: '2023-03-28',
    ratingsSubmitted: 22
  }
];

export const ratings = [
  {
    id: 'RAT001',
    productId: 'PRD001',
    productName: 'UAV Propulsion System MK-V',
    buyerId: 'BUY001',
    buyerName: 'James Mitchell',
    rating: 5,
    review: 'Excellent propulsion system. Met all our requirements for tactical UAV operations.',
    submissionDate: '2024-01-15',
    status: 'approved'
  },
  {
    id: 'RAT002',
    productId: 'PRD002',
    productName: 'Ballistic Armor Plates Level IV',
    buyerId: 'BUY003',
    buyerName: 'Hans Weber',
    rating: 4,
    review: 'Good quality armor plates. Delivery was on time. Minor documentation issues.',
    submissionDate: '2024-01-18',
    status: 'pending'
  },
  {
    id: 'RAT003',
    productId: 'PRD004',
    productName: 'Radar Signal Processing Unit RSP-500',
    buyerId: 'BUY002',
    buyerName: 'Sarah Chen',
    rating: 5,
    review: 'Outstanding performance. Integration with existing systems was seamless.',
    submissionDate: '2024-01-20',
    status: 'approved'
  },
  {
    id: 'RAT004',
    productId: 'PRD006',
    productName: 'Armored Vehicle Power Pack AVP-800',
    buyerId: 'BUY005',
    buyerName: 'David Kim',
    rating: 4,
    review: 'Reliable power pack. Good technical support from the supplier.',
    submissionDate: '2024-01-22',
    status: 'pending'
  },
  {
    id: 'RAT005',
    productId: 'PRD003',
    productName: 'Tactical Communication Module TCM-200',
    buyerId: 'BUY001',
    buyerName: 'James Mitchell',
    rating: 3,
    review: 'Decent product but had some compatibility issues with legacy systems.',
    submissionDate: '2024-01-25',
    status: 'rejected'
  }
];

export const enquiries = [
  {
    id: 'ENQ001',
    productId: 'PRD001',
    productName: 'UAV Propulsion System MK-V',
    supplierId: 'SUP001',
    supplierName: 'Orion Defense Systems',
    buyerId: 'BUY001',
    buyerName: 'James Mitchell',
    buyerCompany: 'US Army Procurement Division',
    message: 'Interested in bulk order of 50 units. Please provide pricing and lead time.',
    date: '2024-01-20',
    status: 'replied',
    reply: 'Thank you for your interest. Please find attached our quotation for 50 units...'
  },
  {
    id: 'ENQ002',
    productId: 'PRD003',
    productName: 'Tactical Communication Module TCM-200',
    supplierId: 'SUP004',
    supplierName: 'Vanguard Defense Electronics',
    buyerId: 'BUY002',
    buyerName: 'Sarah Chen',
    buyerCompany: 'NATO Allied Command',
    message: 'Need technical specifications for interoperability assessment.',
    date: '2024-01-22',
    status: 'pending',
    reply: null
  },
  {
    id: 'ENQ003',
    productId: 'PRD006',
    productName: 'Armored Vehicle Power Pack AVP-800',
    supplierId: 'SUP006',
    supplierName: 'Nordic Defense Industries',
    buyerId: 'BUY003',
    buyerName: 'Hans Weber',
    buyerCompany: 'Bundeswehr Procurement',
    message: 'Requesting information on maintenance requirements and spare parts availability.',
    date: '2024-01-23',
    status: 'replied',
    reply: 'Please find the maintenance manual attached. Spare parts can be delivered within 2 weeks...'
  },
  {
    id: 'ENQ004',
    productId: 'PRD002',
    productName: 'Ballistic Armor Plates Level IV',
    supplierId: 'SUP003',
    supplierName: 'Titan Tactical Manufacturing',
    buyerId: 'BUY005',
    buyerName: 'David Kim',
    buyerCompany: 'ROK Defense Agency',
    message: 'Can you provide samples for testing and certification verification?',
    date: '2024-01-24',
    status: 'pending',
    reply: null
  },
  {
    id: 'ENQ005',
    productId: 'PRD007',
    productName: 'Drone Detection System DDS-100',
    supplierId: 'SUP001',
    supplierName: 'Orion Defense Systems',
    buyerId: 'BUY002',
    buyerName: 'Sarah Chen',
    buyerCompany: 'NATO Allied Command',
    message: 'Interested in evaluation for base protection. What are the demo options?',
    date: '2024-01-25',
    status: 'replied',
    reply: 'We can arrange an on-site demonstration. Please let us know your preferred dates...'
  }
];

export const categories = [
  {
    id: 'CAT001',
    name: 'UAV & Aerospace',
    subcategories: ['Propulsion', 'Avionics', 'Airframes', 'Sensors', 'Ground Control'],
    productCount: 67
  },
  {
    id: 'CAT002',
    name: 'Tactical Electronics',
    subcategories: ['Communications', 'Navigation', 'Electronic Warfare', 'Computing'],
    productCount: 89
  },
  {
    id: 'CAT003',
    name: 'Surveillance Systems',
    subcategories: ['Radar', 'Night Vision', 'Counter-UAS', 'SIGINT', 'Cameras'],
    productCount: 54
  },
  {
    id: 'CAT004',
    name: 'Defense Materials',
    subcategories: ['Body Armor', 'Vehicle Armor', 'Composites', 'Power Systems'],
    productCount: 43
  },
  {
    id: 'CAT005',
    name: 'Weapon Systems',
    subcategories: ['Small Arms', 'Ammunition', 'Optics', 'Accessories'],
    productCount: 78
  },
  {
    id: 'CAT006',
    name: 'Vehicle Systems',
    subcategories: ['Armored Vehicles', 'Naval', 'Support Vehicles', 'Unmanned Ground'],
    productCount: 35
  }
];

// Analytics data for charts
export const analyticsData = {
  mostSearchedComponents: [
    { name: 'UAV Propulsion', searches: 1245 },
    { name: 'Night Vision', searches: 987 },
    { name: 'Tactical Radios', searches: 876 },
    { name: 'Body Armor', searches: 765 },
    { name: 'Radar Systems', searches: 654 }
  ],
  topRatedSuppliers: [
    { name: 'Vanguard Defense', rating: 4.9 },
    { name: 'Orion Defense', rating: 4.8 },
    { name: 'Nordic Defense', rating: 4.7 },
    { name: 'Falcon Aerospace', rating: 4.6 },
    { name: 'Titan Tactical', rating: 4.5 }
  ],
  mostActiveSuppliers: [
    { name: 'Vanguard Defense', products: 54, enquiries: 234 },
    { name: 'Orion Defense', products: 47, enquiries: 156 },
    { name: 'Nordic Defense', products: 38, enquiries: 112 },
    { name: 'Falcon Aerospace', products: 32, enquiries: 89 },
    { name: 'Titan Tactical', products: 28, enquiries: 67 }
  ],
  categoryDemandTrends: [
    { month: 'Sep', uav: 120, electronics: 98, surveillance: 85, materials: 67 },
    { month: 'Oct', uav: 145, electronics: 112, surveillance: 92, materials: 78 },
    { month: 'Nov', uav: 168, electronics: 125, surveillance: 108, materials: 89 },
    { month: 'Dec', uav: 132, electronics: 142, surveillance: 95, materials: 94 },
    { month: 'Jan', uav: 189, electronics: 156, surveillance: 118, materials: 102 }
  ],
  monthlyEnquiries: [
    { month: 'Sep', enquiries: 234 },
    { month: 'Oct', enquiries: 287 },
    { month: 'Nov', enquiries: 312 },
    { month: 'Dec', enquiries: 276 },
    { month: 'Jan', enquiries: 345 }
  ]
};

// Current supplier data (for supplier dashboard simulation)
export const currentSupplier = suppliers[0]; // Orion Defense Systems

// Current buyer data (for buyer dashboard simulation)
export const currentBuyer = buyers[0]; // James Mitchell

// Dashboard statistics
export const adminStats = {
  totalSuppliers: suppliers.length,
  totalBuyers: buyers.length,
  totalProducts: products.length,
  pendingSupplierApprovals: suppliers.filter(s => s.status === 'pending').length,
  pendingProductApprovals: products.filter(p => p.status === 'pending').length,
  pendingRatings: ratings.filter(r => r.status === 'pending').length,
  totalCategories: categories.length
};

export const supplierStats = {
  profileViews: currentSupplier.profileViews,
  totalEnquiries: currentSupplier.totalEnquiries,
  activeProducts: products.filter(p => p.supplierId === currentSupplier.id && p.status === 'approved').length,
  averageRating: currentSupplier.rating,
  pendingProductApprovals: products.filter(p => p.supplierId === currentSupplier.id && p.status === 'pending').length
};

export const buyerStats = {
  totalEnquiries: enquiries.filter(e => e.buyerId === currentBuyer.id).length,
  suppliersContacted: [...new Set(enquiries.filter(e => e.buyerId === currentBuyer.id).map(e => e.supplierId))].length,
  pendingResponses: enquiries.filter(e => e.buyerId === currentBuyer.id && e.status === 'pending').length,
  submittedRatings: ratings.filter(r => r.buyerId === currentBuyer.id).length
};
