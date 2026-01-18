from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from models import FoodItems
from routers.auth import check_user_admin, get_current_user
from schemas import Availability, FoodCategory, FoodRequest, UserRole


router = APIRouter(
    prefix='/FoodItems',
    tags=['FoodItems']
)
db_dependency = Annotated[Session,Depends(get_db)]
user_dependency = Annotated[Session,Depends(get_current_user)]

@router.get("/")
async def get_food_items(db:db_dependency,
                        #  user:user_dependency,
                         category_filter:Optional[FoodCategory]=None,
                         availablity_filter:Optional[Availability]=None,):
    # if not user :
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    query =db.query(FoodItems)
    if category_filter != None :
        query=query.filter(FoodItems.category==category_filter)
    if availablity_filter != None:
        query=query.filter(FoodItems.is_available==availablity_filter)
    return query.all()

@router.post("/")
async def add_food_items(db:db_dependency,
                         user:user_dependency,
                         food_request:FoodRequest):
    check_user_admin(user)
    new_food = FoodItems( **food_request.model_dump())
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return new_food

@router.put("/")
async def update_food_item(db:db_dependency,
                           user:user_dependency,
                           food_id:int,
                           food_request:FoodRequest):
    check_user_admin(user)
    update_food=db.query(FoodItems).filter(FoodItems.id==food_id).first()
    if not update_food:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Food Item Not Found")
    if food_request.name is not None:
        update_food.name=food_request.name
    if food_request.category is not None:
        update_food.category=FoodCategory(food_request.category)
    if food_request.price is not None:
        update_food.price = food_request.price
    
    db.commit()
    db.refresh(update_food)
    return(update_food)

@router.delete("/")
async def delete_food_item(db:db_dependency,
                           user:user_dependency,
                           food_id:int):
    check_user_admin(user)
    food_item=db.query(FoodItems).filter(FoodItems.id==food_id).first()
    if not food_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Food Not Found")
    db.delete(food_item)
    db.commit()

@router.patch("/")
async def update_availablity_food_item(db:db_dependency,
                                       user:user_dependency,
                                       food_id:int,
                                       availablity_request:Availability):
    check_user_admin(user)
    food_item = db.query(FoodItems).filter(FoodItems.id==food_id).first()
    if not food_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Food not found")
    food_item.is_available=availablity_request
    db.commit()
    db.refresh(food_item)
    return food_item
    