import axios from 'axios';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  stock?: number;
}

export interface ProductFilters {
  title?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Create local storage key for products
const LOCAL_STORAGE_KEY = 'edu-enroll-products';

// Function to save products to localStorage
export const saveProductsToLocalStorage = (products: Product[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

// Function to get products from localStorage
export const getProductsFromLocalStorage = (): Product[] => {
  const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedProducts ? JSON.parse(storedProducts) : [];
};

// ProductsService class implementing both external API and local storage
export class ProductsService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/products';

  // Check if we should use local storage
  private useLocalStorage(): boolean {
    return getProductsFromLocalStorage().length > 0;
  }

  // Fetch products from external API
  async fetchFromExternalApi(params: ProductFilters): Promise<ProductsResponse> {
    const { page, limit, title, category, minPrice, maxPrice } = params;
    const offset = (page - 1) * limit;
    
    try {
      // Using the Platzi fake store API
      let url = `${this.apiUrl}?offset=${offset}&limit=${limit}`;
      
      if (title) {
        url += `&title=${encodeURIComponent(title)}`;
      }
      
      if (category) {
        url += `&categoryId=${encodeURIComponent(category)}`;
      }
      
      if (minPrice !== undefined) {
        url += `&price_min=${minPrice}`;
      }
      
      if (maxPrice !== undefined) {
        url += `&price_max=${maxPrice}`;
      }
      
      const response = await axios.get<Product[]>(url);
      
      // Getting the total count from a separate request
      const totalCountResponse = await axios.get<Product[]>(`${this.apiUrl}`);
      
      return {
        products: response.data,
        total: totalCountResponse.data.length,
        skip: offset,
        limit
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        products: [],
        total: 0,
        skip: 0,
        limit
      };
    }
  }

  // Fetch products from localStorage with filtering and pagination
  async fetchFromLocalStorage(params: ProductFilters): Promise<ProductsResponse> {
    const { page, limit, title, category, minPrice, maxPrice } = params;
    const offset = (page - 1) * limit;
    
    let products = getProductsFromLocalStorage();
    
    // Apply filters
    if (title) {
      products = products.filter(p => 
        p.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    
    if (category) {
      products = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= minPrice);
    }
    
    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= maxPrice);
    }
    
    // Get total before pagination
    const total = products.length;
    
    // Apply pagination
    products = products.slice(offset, offset + limit);
    
    return {
      products,
      total,
      skip: offset,
      limit
    };
  }

  // Main method to get products - decides whether to use local storage or external API
  async getProducts(params: ProductFilters): Promise<ProductsResponse> {
    if (this.useLocalStorage()) {
      return this.fetchFromLocalStorage(params);
    } else {
      const externalData = await this.fetchFromExternalApi(params);
      
      // If this is the first time and we got data, save it to localStorage
      if (externalData.products.length > 0 && getProductsFromLocalStorage().length === 0) {
        saveProductsToLocalStorage(externalData.products);
      }
      
      return externalData;
    }
  }

  // Get a single product by ID
  async getProductById(id: number): Promise<Product | null> {
    if (this.useLocalStorage()) {
      const products = getProductsFromLocalStorage();
      return products.find(p => p.id === id) || null;
    } else {
      try {
        const response = await axios.get<Product>(`${this.apiUrl}/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        return null;
      }
    }
  }

  // Get unique categories
  async getCategories(): Promise<string[]> {
    if (this.useLocalStorage()) {
      const products = getProductsFromLocalStorage();
      return [...new Set(products.map(p => p.category))];
    } else {
      try {
        const response = await axios.get<{id: number, name: string}[]>('https://api.escuelajs.co/api/v1/categories');
        return response.data.map(category => category.name);
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
  }
}

export const productsService = new ProductsService();