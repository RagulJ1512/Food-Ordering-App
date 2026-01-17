from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal
from models import Users
from routers.auth import get_current_user
from starlette import status
from database import get_db
from schemas import CreateUserRequest, UserRole

router = APIRouter(
    prefix='/user',
    tags=['user']
)



db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


@router.post("/auth", status_code=status.HTTP_201_CREATED)
async def create_ADMIN(db: db_dependency,
                      user: user_dependency,
                      create_user_request: CreateUserRequest):
    if user is None or user.get('user_role') != UserRole.ADMIN:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    create_user_model = Users(
        email=create_user_request.email,
        username=create_user_request.username,
        first_name=create_user_request.first_name,
        last_name=create_user_request.last_name,
        role=UserRole.ADMIN,
        hashed_password=bcrypt_context.hash(create_user_request.password),
    )

    db.add(create_user_model)
    db.commit()
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_USER(db: db_dependency,
                      create_user_request: CreateUserRequest):
    
    create_user_model = Users(
        email=create_user_request.email,
        username=create_user_request.username,
        first_name=create_user_request.first_name,
        last_name=create_user_request.last_name,
        role=UserRole.CUSTOMER,
        hashed_password=bcrypt_context.hash(create_user_request.password),
    )

    db.add(create_user_model)
    db.commit()

@router.get('/', status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    return db.query(Users).filter(Users.id == user.get('id')).first()
