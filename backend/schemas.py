import enum
from typing import List, Optional

from pydantic import BaseModel, Field, model_validator

class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"

class FoodCategory(enum.Enum):
    STARTER = "STARTER"
    MAIN_COURSE = "MAIN_COURSE"
    DESSERT = "DESSERT"
    DRINK = "DRINK"

class Availability(enum.Enum):
    AVAILABLE = "AVAILABLE"
    UNAVAILABLE = "UNAVAILABLE"

class OrderStatus(enum.Enum):
    PLACED = "PLACED"
    PREPARING = "PREPARING"
    DELIVERED = "DELIVERED"


class CreateUserRequest(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    password: str
   

class Token(BaseModel):
    access_token: str
    token_type: str

class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length=6)

class FoodRequest(BaseModel):
    name:str
    price:float
    category:FoodCategory

class OrderItems(BaseModel):
    food_id:int
    food_name:Optional[str]=None
    qty:int
    unit_price:Optional[float]=None
    total_price: Optional[float] = 0.0
    @model_validator(mode="after")
    def compute_total(cls, values):
        values.total_price = (values.unit_price or 0) * (values.qty or 0) 
        return values
    
class PlaceOrderRequest(BaseModel):
    items:List[OrderItems]

   

class OrderDetail(BaseModel):

    id:Optional[int]=None
    user_id:Optional[int]=None
    items:List[OrderItems]
    status:Optional[OrderStatus]=OrderStatus.PLACED
    total_price:Optional[float]=0.0
    @model_validator(mode="after") 
    def compute_total(cls, values): 
        values.total_price = sum(item.total_price for item in values.items) 
        return values
    
class Order(BaseModel):
    id:int
    status:OrderStatus
    total_price:float