import enum

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