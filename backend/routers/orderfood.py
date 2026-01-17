from sqlalchemy.orm import Session
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from schemas import OrderDetail, OrderStatus, PlaceOrderRequest, UserRole, OrderItems as OrderItemSchema
from database import get_db
from models import FoodItems, OrderItems as OrderItemsDB, Availability, Orders
from routers.auth import get_current_user, check_user_admin, check_user_customer

router = APIRouter(
    prefix='/Order',
    tags=['Order']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/", response_model=OrderDetail)
async def place_order(db: db_dependency,
                      user: user_dependency,
                      order_request: PlaceOrderRequest):

    check_user_customer(user)

    for item in order_request.items:
        food = db.query(FoodItems).filter(FoodItems.id == item.food_id).first()
        if not food or food.is_available != Availability.AVAILABLE:
            raise HTTPException(status_code=404, detail="Food item Not available")
        item.food_name = food.name
        item.unit_price = food.price

    order_detail = OrderDetail(
        id=None,
        user_id=user["id"],
        status=OrderStatus.PLACED,
        items=order_request.items
    )

    new_order = Orders(
        user_id=order_detail.user_id,
        total_price=order_detail.total_price,
        status=order_detail.status
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order_detail.items:
        order_item = OrderItemsDB(
            order_id=new_order.id,
            food_id=item.food_id,
            qty=item.qty
        )
        db.add(order_item)

    db.commit()
    db.refresh(new_order)

    order_detail.id = new_order.id
    return order_detail


@router.get("/", response_model=list[OrderDetail])
async def get_order_details(db: db_dependency,
                            user: user_dependency,
                            order_id: Optional[int] = None):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User Unauthorised")

    if user.get("user_role") == UserRole.ADMIN:
        query = db.query(Orders)
        if order_id:
            query = query.filter(Orders.id == order_id)
        orders = query.all()
    else:
        check_user_customer(user)
        query = db.query(Orders).filter(Orders.user_id == user["id"])
        if order_id:
            query = query.filter(Orders.id == order_id)
        orders = query.all()

    if not orders:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No orders found")

    orderdetails: list[OrderDetail] = []
    for order in orders:
        items: list[OrderItemSchema] = []
        for order_item in order.items:
            food = db.query(FoodItems).filter(FoodItems.id == order_item.food_id).first()
            items.append(
                OrderItemSchema(
                    food_id=order_item.food_id,
                    food_name=food.name if food else None,
                    qty=order_item.qty,
                    unit_price=food.price if food else None
                )
            )
        orderdetails.append(
            OrderDetail(
                id=order.id,
                user_id=order.user_id,
                status=order.status,
                items=items
            )
        )
    return orderdetails


@router.patch("/", response_model=OrderDetail)
async def update_order_status(db: db_dependency,
                              user: user_dependency,
                              order_id: int,
                              update_status: OrderStatus):

    check_user_admin(user)
    order = db.query(Orders).filter(Orders.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order Id not found")
    order.status = update_status
    db.commit()
    db.refresh(order)
    return order