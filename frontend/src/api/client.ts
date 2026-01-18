import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:8080",
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

//auth
export async function login(username: string, password: string) {
    const formdata = new URLSearchParams()
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("grant_type", "password");
    const res = await api.post("/auth/token", formdata, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res;
}


//user
export async function createUser(data: any) {
    const res = await api.post("/user/", data);
    return res.data;
}

export async function createAdmin(data: any) {
    const res = await api.post("/user/auth", data);
    return res.data;
}

export async function getUser() {
    const res = await api.get("/user/")
    return res.data;
}


export async function getFoodItems(category?: string, availability?: string) {
  const params: any = {};
  if (category) params.category_filter = category;
  if (availability) params.availablity_filter = availability;

  const res = await api.get("/FoodItems/", { params });
  return res.data;
}


export async function addFoodItems( data: any) {
    const res = await api.post("/FoodItems/", data);
    return res.data;

}
export async function updateFoodItem(food_id: number, data: any) {
    const res = await api.put("/FoodItems/", data, { params: { food_id } });
    return res.data;

}
export async function deleteFoodItem(food_id: number) {
    const res = await api.delete("/FoodItems/", { params: { food_id } });
    return res.data;

}

export async function updateFoodAvailabl(food_id: number, availablity: string) {

    const res = await api.patch("/FoodItems/", null, {
        params: { food_id, availablity_request: availablity },
    });
    return res.data;

}

//orders

export async function placeOrder(data:any) {
    const res = await api.post("/Order/",data);
    return res.data;
}

export async function getOrders(order_id?:number){
    const res = await api.get("/Order/",{ params:{order_id}});
    return res.data

}
export async function updateOrderStatus(order_id:number,status:string){
    const res = await api.patch("/Order/",null,{
        params:{order_id,update_status:status},
    });
    return res.data;
}











