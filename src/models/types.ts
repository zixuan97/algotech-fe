export interface User {
  id: number;
  email: string;
}


export interface Product {
    id: number;
    available_stock: number;
    description: string;
    image: string;
    price: number;
    qty_sold: number;
    category_id: number;
}

export interface Category {
    id: number;
    description: string;
}

export interface Tags {
    id: number;
    description: string;
}

export interface Outlet {
    id: number;
    name: string;
    details: string;
    // TODO: product_list & product_map
}