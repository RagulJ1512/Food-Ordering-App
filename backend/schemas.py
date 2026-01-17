import enum
from typing import List, Optional

from pydantic import BaseModel, Field

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
    @property 
    def total_price(self) -> float: 
        if self.unit_price is None: 
            return 0.0
        return self.qty*self.unit_price

class PlaceOrderRequest(BaseModel):
    items:List[OrderItems]

   

class OrderDetail(BaseModel):

    id:Optional[int]=None
    user_id:Optional[int]=None
    items:List[OrderItems]
    status:Optional[OrderStatus]=OrderStatus.PLACED
    total_price:Optional[float]=None
    @property
    def total_price(self) -> float: 
        return sum(item.total_price for item in self.items)
    
class Order(BaseModel):
    id:int
    status:OrderStatus
    total_price:float