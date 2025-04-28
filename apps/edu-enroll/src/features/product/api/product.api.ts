import axios from 'axios';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

export interface Product {
  id?: number;
  title: string;
  price: number;
  description: string;
  categoryId?: number;
  images: string[];
}

export interface ProductUpdatePayload {
  title?: string;
  price?: number;
  description?: string;
  categoryId?: number;
  images?: string[];
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface FilterParams {
  title?: string;
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const productApi = {
  /**
   * Lấy danh sách tất cả sản phẩm có phân trang và lọc
   * @param paginationParams Tham số phân trang
   * @param filterParams Tham số lọc
   * @returns Promise<Product[]>
   */
  getProducts: async (
    paginationParams?: PaginationParams, 
    filterParams?: FilterParams
  ): Promise<Product[]> => {
    const { offset = 0, limit = 10 } = paginationParams || {};
    
    // Xây dựng tham số tìm kiếm - Fake API escuelajs.co có hỗ trợ giới hạn
    // Trong thực tế, API của bạn có thể hỗ trợ nhiều tham số lọc hơn
    const params: Record<string, any> = { offset, limit };
    
    if (filterParams?.title) {
      params.title = filterParams.title; // API này chỉ hỗ trợ tìm theo title
    }
    
    if (filterParams?.priceMin !== undefined) {
      params.price_min = filterParams.priceMin;
    }
    
    if (filterParams?.priceMax !== undefined) {
      params.price_max = filterParams.priceMax;
    }
    
    if (filterParams?.categoryId) {
      params.categoryId = filterParams.categoryId;
    }
    
    const response = await axios.get(`${BASE_URL}/products`, { params });
    return response.data;
  },

  /**
   * Lấy danh sách các danh mục sản phẩm
   * @returns Promise<{ id: number; name: string }[]>
   */
  getCategories: async (): Promise<{ id: number; name: string }[]> => {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
  },

  /**
   * Lấy tổng số sản phẩm
   * @param filterParams Tham số lọc
   * @returns Promise<number>
   */
  getProductsCount: async (filterParams?: FilterParams): Promise<number> => {
    // Thay vì chỉ lấy 1 sản phẩm, lấy tất cả để đếm số lượng thực tế
    const params: Record<string, any> = {};
    
    if (filterParams?.title) {
      params.title = filterParams.title;
    }
    
    if (filterParams?.priceMin !== undefined) {
      params.price_min = filterParams.priceMin;
    }
    
    if (filterParams?.priceMax !== undefined) {
      params.price_max = filterParams.priceMax;
    }
    
    if (filterParams?.categoryId) {
      params.categoryId = filterParams.categoryId;
    }
    
    try {
      // Lấy tất cả sản phẩm để đếm số lượng thực tế
      const response = await axios.get(`${BASE_URL}/products`, { params });
      return response.data.length;
    } catch (error) {
      console.error('Failed to count products:', error);
      return 0;
    }
  },

  /**
   * Lấy chi tiết một sản phẩm theo ID
   * @param id ID của sản phẩm
   * @returns Promise<Product>
   */
  getProductById: async (id: number): Promise<Product> => {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  },

  /**
   * Tạo mới một sản phẩm
   * @param product Thông tin sản phẩm cần tạo
   * @returns Promise<Product>
   */
  createProduct: async (product: Product): Promise<Product> => {
    const response = await axios.post(`${BASE_URL}/products`, product);
    return response.data;
  },

  /**
   * Cập nhật thông tin một sản phẩm
   * @param id ID của sản phẩm cần cập nhật
   * @param product Thông tin sản phẩm cần cập nhật
   * @returns Promise<Product>
   */
  updateProduct: async (id: number, product: ProductUpdatePayload): Promise<Product> => {
    const response = await axios.put(`${BASE_URL}/products/${id}`, product);
    return response.data;
  },

  /**
   * Xóa một sản phẩm
   * @param id ID của sản phẩm cần xóa
   * @returns Promise<boolean>
   */
  deleteProduct: async (id: number): Promise<boolean> => {
    const response = await axios.delete(`${BASE_URL}/products/${id}`);
    return response.data === true;
  }
};

export default productApi;