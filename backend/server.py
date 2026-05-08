from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class SupplierBase(BaseModel):
    name: str
    type: str
    country: str
    email: str
    phone: str
    certifications: List[str] = Field(default_factory=list)
    status: str = "pending"
    joinDate: str
    profileViews: int = 0
    totalEnquiries: int = 0
    image: Optional[str] = None
    productsCount: int = 0
    rating: float = 0.0
    documents: List[dict] = Field(default_factory=list)
    documentStatus: str = "active"


class SupplierCreate(SupplierBase):
    id: Optional[str] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    country: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    certifications: Optional[List[str]] = None
    status: Optional[str] = None
    joinDate: Optional[str] = None
    profileViews: Optional[int] = None
    totalEnquiries: Optional[int] = None
    image: Optional[str] = None
    productsCount: Optional[int] = None
    rating: Optional[float] = None
    documents: Optional[List[dict]] = None
    documentStatus: Optional[str] = None


class Supplier(SupplierBase):
    model_config = ConfigDict(extra="ignore")

    id: str


class SupplierStatusUpdate(BaseModel):
    status: str


class ProductBase(BaseModel):
    name: str
    supplierId: str
    supplierName: str
    category: str
    subcategory: str = "General"
    rating: float = 0.0
    status: str = "pending"
    price: str = "RFQ"
    description: str = ""
    shortDescription: str = ""
    specifications: List[str] = Field(default_factory=list)
    technicalSpecs: str = ""
    leadTime: str = ""
    countryOfOrigin: str = ""
    availability: str = "in-stock"
    dimensions: dict = Field(default_factory=dict)
    certifications: List[str] = Field(default_factory=list)
    industryTags: List[str] = Field(default_factory=list)
    applicationUseCase: str = ""
    aiSummary: str = ""
    images: List[dict] = Field(default_factory=list)
    primaryImageIndex: int = 0
    datasheet: Optional[dict] = None
    technicalDocs: List[dict] = Field(default_factory=list)
    videoUrl: str = ""
    image: Optional[str] = None


class ProductCreate(ProductBase):
    id: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    supplierId: Optional[str] = None
    supplierName: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    rating: Optional[float] = None
    status: Optional[str] = None
    price: Optional[str] = None
    description: Optional[str] = None
    shortDescription: Optional[str] = None
    specifications: Optional[List[str]] = None
    technicalSpecs: Optional[str] = None
    leadTime: Optional[str] = None
    countryOfOrigin: Optional[str] = None
    availability: Optional[str] = None
    dimensions: Optional[dict] = None
    certifications: Optional[List[str]] = None
    industryTags: Optional[List[str]] = None
    applicationUseCase: Optional[str] = None
    aiSummary: Optional[str] = None
    images: Optional[List[dict]] = None
    primaryImageIndex: Optional[int] = None
    datasheet: Optional[dict] = None
    technicalDocs: Optional[List[dict]] = None
    videoUrl: Optional[str] = None
    image: Optional[str] = None


class Product(ProductBase):
    model_config = ConfigDict(extra="ignore")
    id: str


class ProductStatusUpdate(BaseModel):
    status: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks


@api_router.get("/suppliers", response_model=List[Supplier])
async def list_suppliers():
    suppliers = await db.suppliers.find({}, {"_id": 0}).to_list(1000)
    return suppliers


@api_router.get("/suppliers/{supplier_id}", response_model=Supplier)
async def get_supplier(supplier_id: str):
    supplier = await db.suppliers.find_one({"id": supplier_id}, {"_id": 0})
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier


@api_router.post("/suppliers", response_model=Supplier)
async def create_supplier(input: SupplierCreate):
    supplier_data = input.model_dump(exclude_none=True)
    if not supplier_data.get("id"):
        supplier_data["id"] = f"SUP{str(uuid.uuid4().int)[-6:]}"

    existing = await db.suppliers.find_one({"id": supplier_data["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Supplier with this id already exists")

    await db.suppliers.insert_one(supplier_data)
    created = await db.suppliers.find_one({"id": supplier_data["id"]}, {"_id": 0})
    return created


@api_router.put("/suppliers/{supplier_id}", response_model=Supplier)
async def update_supplier(supplier_id: str, input: SupplierUpdate):
    update_data = {k: v for k, v in input.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        existing = await db.suppliers.find_one({"id": supplier_id}, {"_id": 0})
        if not existing:
            raise HTTPException(status_code=404, detail="Supplier not found")
        return existing

    result = await db.suppliers.update_one({"id": supplier_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Supplier not found")

    updated = await db.suppliers.find_one({"id": supplier_id}, {"_id": 0})
    return updated


@api_router.patch("/suppliers/{supplier_id}/status", response_model=Supplier)
async def update_supplier_status(supplier_id: str, input: SupplierStatusUpdate):
    result = await db.suppliers.update_one({"id": supplier_id}, {"$set": {"status": input.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Supplier not found")

    updated = await db.suppliers.find_one({"id": supplier_id}, {"_id": 0})
    return updated


@api_router.delete("/suppliers/{supplier_id}")
async def delete_supplier(supplier_id: str):
    result = await db.suppliers.delete_one({"id": supplier_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"success": True, "message": "Supplier deleted"}


@api_router.get("/products", response_model=List[Product])
async def list_products():
    products = await db.products.find({}, {"_id": 0}).to_list(2000)
    return products


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@api_router.post("/products", response_model=Product)
async def create_product(input: ProductCreate):
    product_data = input.model_dump(exclude_none=True)
    if not product_data.get("id"):
        product_data["id"] = f"PRD{str(uuid.uuid4().int)[-6:]}"

    existing = await db.products.find_one({"id": product_data["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Product with this id already exists")

    await db.products.insert_one(product_data)
    created = await db.products.find_one({"id": product_data["id"]}, {"_id": 0})
    return created


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, input: ProductUpdate):
    update_data = {k: v for k, v in input.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        existing = await db.products.find_one({"id": product_id}, {"_id": 0})
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        return existing

    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated


@api_router.patch("/products/{product_id}/status", response_model=Product)
async def update_product_status(product_id: str, input: ProductStatusUpdate):
    result = await db.products.update_one({"id": product_id}, {"$set": {"status": input.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "message": "Product deleted"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
