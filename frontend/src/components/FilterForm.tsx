import React from "react";
import "./FilterForm.css"
interface FilterFormProps{
    category:string;
    availability:string;
    onFilterChange:(filters:{category:string; availability:string})=>void;
}

function FilterForm({
                    category,
                    availability,
                    onFilterChange,
                    }:FilterFormProps){
    function handleChange(e:React.ChangeEvent<HTMLSelectElement>){
        const{name, value}=e.target;
        onFilterChange({category,availability,[name]:value});
    }
    return(
        <div className="filter-form">
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

        </div>
    )
}
export default FilterForm;