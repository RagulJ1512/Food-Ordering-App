from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth,users

import models
from database import engine


app=FastAPI()

# --- CORS setup --- 
origins = [ 
    "http://localhost:5173", # Vite default dev server 
    "http://localhost:3000", # CRA default dev server 
    "http://127.0.0.1:8080", # FastAPI itself (optional) # add your deployed frontend URL here when you host it 
    ] 
app.add_middleware( 
    CORSMiddleware, 
    allow_origins=origins, # list of allowed origins 
    allow_credentials=True, 
    allow_methods=["*"], # allow all HTTP methods 
    allow_headers=["*"], # allow all headers 
    )


models.Base.metadata.create_all(bind=engine)



app.include_router(auth.router)
app.include_router(users.router)