import React, { useState } from "react";
import "./FilterForm.css"
interface FilterFormProps{
    category:string;
    availability:string;
    min_price:number;
    max_price:number;
    search:string;
    onFilterChange:(filters:{category:string; availability:string,min_price:number,max_price:number,search:string})=>void;
}

function FilterForm({
                    category,
                    availability,
                    min_price,
                    max_price,
                    search,
                    onFilterChange,
                    }:FilterFormProps){

    function handleChange(e:React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
        const{name, value}=e.target;
        onFilterChange({category,availability,min_price,max_price,search,[name]:value});
    }
    return(
        <div className="filter-form">
            <input type="text" name="search" value={search} placeholder="Search Foods" onChange={handleChange} />
            <select name="category" value={category} onChange={handleChange}>
                <option value="">All Category</option>
                <option value="STARTER">Sarter</option>
                <option value="MAIN_COURSE">Main Course</option>
                <option value="DESSERT">Desert</option>
                <option value="DRINK">Drink</option>
            </select>
            <select name="availability" value={availability} onChange={handleChange}>
                <option value="">All</option>
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
            </select>
            <input type="number" name="min_price" value={min_price} onChange={handleChange} min={0} max={5000}/>
            <input type="number" name="max_price" value={max_price} onChange={handleChange} min={0} max={5000}/>
        </div>
    )
}
export default FilterForm;