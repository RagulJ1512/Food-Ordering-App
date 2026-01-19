from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy import Column, DateTime, Integer, Float, ForeignKey, Enum as SqlEnum, String,Boolean
from sqlalchemy.orm import relationship
from schemas import Availability, FoodCategory, OrderStatus, UserRole
from database import Base

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(SqlEnum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    created_at=Column(DateTime,default=datetime.now(ZoneInfo("Asia/Kolkata")))

    orders = relationship("Orders", back_populates="user")


class FoodItems(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(SqlEnum(FoodCategory), nullable=False)
    is_available = Column(SqlEnum(Availability), default=Availability.AVAILABLE, nullable=False)
    created_at=Column(DateTime,default=datetime.now(ZoneInfo("Asia/Kolkata")))
    updated_at=Column(DateTime,default=datetime.now(ZoneInfo("Asia/Kolkata")))
    order_items = relationship("OrderItems", back_populates="food_item")
    deleted=Column(Boolean,default=False)


class Orders(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)  # order_id
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(SqlEnum(OrderStatus), default=OrderStatus.PLACED, nullable=False)
    created_at=Column(DateTime,default=datetime.now(ZoneInfo("Asia/Kolkata")))
    updated_at=Column(DateTime,default=datetime.now(ZoneInfo("Asia/Kolkata")))
  
    user = relationship("Users", back_populates="orders")
    items = relationship("OrderItems", back_populates="order", cascade="all, delete-orphan")


class OrderItems(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    food_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)
    qty = Column(Integer, nullable=False)

    order = relationship("Orders", back_populates="items")
    food_item = relationship("FoodItems", back_populates="order_items")
