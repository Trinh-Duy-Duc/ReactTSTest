import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Popconfirm, Image, Spin, Select, Card, Row, Col, Divider, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined, SearchOutlined, FilterOutlined, TagsOutlined, DollarOutlined, ClearOutlined, AppstoreOutlined, LinkOutlined, PictureOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { productApi } from '../api';
import { useSearchParams, useParams } from 'react-router-dom';
import { usePaginationParams } from '@repo/hooks';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();
  const { lang } = useParams();

  // State cho bộ lọc
  const [filters, setFilters] = useState({
    title: '',
    categoryId: null,
    priceMin: null,
    priceMax: null,
  });
  const [filterForm] = Form.useForm();

  // Sử dụng hook phân trang từ @repo/hooks
  const { pageIndex, pageSize, setPageIndex, setPageSize } = usePaginationParams({
    defaultPageIndex: 1,
    defaultPageSize: 10,
    paramNames: { pageIndex: 'page', pageSize: 'limit' }
  });
  
  // State để lưu tổng số sản phẩm
  const [totalItems, setTotalItems] = useState(0);
  
  // Tính toán số trang thực tế dựa trên tổng số sản phẩm và kích thước trang
  const totalPages = useMemo(() => {
    return totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0;
  }, [totalItems, pageSize]);

  // Lấy danh sách sản phẩm và danh mục khi component được mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Gọi fetchProducts khi tham số phân trang hoặc bộ lọc thay đổi
  useEffect(() => {
    fetchProducts();
  }, [pageIndex, pageSize, filters]);

  // Cập nhật URL khi thay đổi trang
  useEffect(() => {
    const params = {
      page: pageIndex.toString(),
      limit: pageSize.toString()
    };
    
    if (filters.title) params.title = filters.title;
    if (filters.categoryId) params.categoryId = filters.categoryId.toString();
    if (filters.priceMin) params.priceMin = filters.priceMin.toString();
    if (filters.priceMax) params.priceMax = filters.priceMax.toString();
    
    setSearchParams(params);
  }, [pageIndex, pageSize, filters, setSearchParams]);

  // Hàm lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const data = await productApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error(t('error.fetchCategories'));
    }
  };

  // Hàm lấy danh sách sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Tính offset dựa trên pageIndex và pageSize
      const offset = (pageIndex - 1) * pageSize;
      
      // Chuẩn bị tham số lọc với xử lý đặc biệt cho giá
      const processedFilters = { ...filters };
      
      // Nếu priceMin trống, gán giá trị 0
      if (processedFilters.priceMin === null || processedFilters.priceMin === undefined || processedFilters.priceMin === '') {
        processedFilters.priceMin = 0;
      }
      
      // Nếu priceMax trống, gán giá trị MAX_INT (2147483647)
      if (processedFilters.priceMax === null || processedFilters.priceMax === undefined || processedFilters.priceMax === '') {
        processedFilters.priceMax = Number.MAX_SAFE_INTEGER;
      }
      
      // Lọc các giá trị null và undefined cho các bộ lọc khác
      const filteredParams = Object.entries(processedFilters).reduce((acc, [key, value]) => {
        if (key === 'priceMin' || key === 'priceMax' || (value !== null && value !== undefined && value !== '')) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      // Lấy danh sách sản phẩm có phân trang và lọc
      const data = await productApi.getProducts({
        offset,
        limit: pageSize
      }, filteredParams);
      
      // Áp dụng lọc giá bổ sung
      let filteredData = [...data];
      
      // Lọc theo giá
      filteredData = filteredData.filter(product => {
        // Kiểm tra giá sản phẩm nằm trong khoảng [priceMin, priceMax]
        return product.price >= processedFilters.priceMin && product.price <= processedFilters.priceMax;
      });
      
      setProducts(filteredData);
      
      // Lấy tổng số sản phẩm để tính toán pagination
      const total = await productApi.getProductsCount(filteredParams);
      setTotalItems(total);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error(t('error.fetchProducts'));
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý thay đổi phân trang
  const handleTableChange = (pagination, filters, sorter) => {
    // Không xử lý thay đổi bộ lọc và sắp xếp ở đây
    if (pagination && pagination.current !== pageIndex) {
      setPageIndex(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  // Hàm mở modal để thêm sản phẩm mới
  const handleAddNew = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Hàm mở modal để chỉnh sửa sản phẩm
  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      images: product.images[0] // Chỉ lấy hình ảnh đầu tiên
    });
    setModalVisible(true);
  };

  // Hàm xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Ensure we have required fields with proper formatting
      if (!values.title || values.title.trim().length < 3) {
        message.error('Title must be at least 3 characters long');
        return;
      }
      
      if (!values.description || values.description.trim().length < 10) {
        values.description = `${values.title} - This is a detailed description of at least 10 characters.`;
      }
      
      // Make sure price is a valid number
      const price = typeof values.price === 'string' ? parseFloat(values.price) : values.price;
      if (isNaN(price) || price <= 0) {
        message.error('Price must be a positive number');
        return;
      }
      
      // Always use a valid image URL
      const imageUrl = values.images && values.images.trim() 
        ? values.images.trim() 
        : 'https://placehold.co/600x400';
      
      // Build the minimal required payload according to API docs
      const payload = {
        title: values.title.trim(),
        price: price,
        description: values.description.trim(),
        categoryId: Number(values.categoryId),
        images: [imageUrl]
      };
      
      console.log('Sending product data:', payload);
      
      if (editingProduct) {
        // Update existing product
        await productApi.updateProduct(editingProduct.id, payload);
        message.success(t('success.updateProduct'));
      } else {
        // Create new product
        await productApi.createProduct(payload);
        message.success(t('success.addProduct'));
      }
      
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Form validation failed:', error);
      // Log detailed error information to help diagnose the issue
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        message.error(`API Error: ${JSON.stringify(error.response.data)}`);
      } else {
        message.error(`Error: ${error.message || 'Unknown error occurred'}`);
      }
    }
  };

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await productApi.deleteProduct(id);
      message.success(t('success.deleteProduct'));
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error(t('error.deleteProduct'));
    }
  };

  // Định nghĩa các cột của bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: t('table.image'),
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <Image 
          src={images && images.length > 0 ? images[0] : 'https://placehold.co/600x400'} 
          alt="product" 
          width={80} 
          height={80}
          style={{ objectFit: 'cover' }}
        />
      )
    },
    {
      title: t('table.title'),
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: t('table.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`
    },
    {
      title: t('table.category'),
      dataIndex: 'category',
      key: 'category',
      render: (_, record) => {
        // Trường hợp API trả về trực tiếp thông tin category
        if (record.category && record.category.name) {
          return <span className="font-medium">{record.category.name}</span>;
        }

        // Trường hợp chỉ có categoryId
        if (record.categoryId) {
          const categoryIdNum = Number(record.categoryId);
          const category = categories.find(cat => cat.id === categoryIdNum);
          
          if (category) {
            return <span className="font-medium">{category.name}</span>;
          }
        }
        
        // Trường hợp không có thông tin category
        return <span className="text-gray-400">{t('table.noCategory')}</span>;
      }
    },
    {
      title: t('table.action'),
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            {t('action.edit')}
          </Button>
          <Popconfirm
            title={t('action.confirmDelete')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('action.delete')}
            cancelText={t('action.cancel')}
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="link" icon={<DeleteOutlined />} danger>
              {t('action.delete')}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div></div> {/* Phần tử trống để giúp justify-between hoạt động đúng */}
        {/* Language Switcher ở góc trên bên phải */}
        <div className="mr-4 mb-2">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <Title level={2} className="font-bold text-center mb-4">{t('title.productManagement')}</Title>
        <Button 
          type="primary"
          icon={<ArrowLeftOutlined />}
          style={{ 
            borderRadius: '6px',
            background: 'linear-gradient(to right, #722ed1, #531dab)',
            border: 'none',
            boxShadow: '0 2px 5px rgba(114, 46, 209, 0.3)',
            alignSelf: 'flex-start'
          }}
          onClick={() => window.location.href = `http://localhost:5173/${lang}/dashboard`}
        >
          {t('action.backToDashboard')}
        </Button>
      </div>

      {/* Phần bộ lọc */}
      <Card 
        className="mb-4" 
        style={{
          background: 'linear-gradient(to right, #ffffff, #f0f2f5)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="mb-2">
          <Title level={5} style={{ margin: 0 }}>
            <FilterOutlined style={{ marginRight: 8 }} /> {t('filter.title')}
          </Title>
          <Divider style={{ margin: '12px 0' }} />
        </div>
        <Form
          form={filterForm}
          layout="horizontal"
          onFinish={(values) => {
            setFilters(values);
            setPageIndex(1);
          }}
          initialValues={filters}
        >
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} sm={12} md={5} lg={5}>
              <Form.Item name="title" label={<span className="filter-label"><TagsOutlined /> {t('filter.productName')}</span>} className="mb-0">
                <Input 
                  placeholder={t('filter.productNamePlaceholder')} 
                  allowClear 
                  prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                  style={{ borderRadius: '6px' }}
                  className="hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={5} lg={5}>
              <Form.Item name="categoryId" label={<span className="filter-label"><AppstoreOutlined /> {t('filter.category')}</span>} className="mb-0">
                <Select
                  placeholder={t('filter.categoryPlaceholder')}
                  allowClear
                  style={{ borderRadius: '6px' }}
                  className="hover:border-blue-400"
                  options={categories.map(cat => ({
                    value: cat.id,
                    label: cat.name
                  }))}
                  dropdownStyle={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={3} lg={3}>
              <Form.Item name="priceMin" label={<span className="filter-label"><DollarOutlined /> {t('filter.priceFrom')}</span>} className="mb-0">
                <InputNumber
                  style={{ width: '100%', borderRadius: '6px' }}
                  placeholder={t('filter.priceMinPlaceholder')}
                  min={0}
                  className="hover:border-blue-400"
                  formatter={(value) => `$${value}`}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={3} lg={3}>
              <Form.Item name="priceMax" label={<span className="filter-label"><DollarOutlined /> {t('filter.priceTo')}</span>} className="mb-0">
                <InputNumber
                  style={{ width: '100%', borderRadius: '6px' }}
                  placeholder={t('filter.priceMaxPlaceholder')}
                  min={0}
                  className="hover:border-blue-400"
                  formatter={(value) => `$${value}`}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item className="mb-0" label=" " colon={false}>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<FilterOutlined />}
                    style={{ 
                      borderRadius: '6px',
                      background: 'linear-gradient(to right, #1890ff, #096dd9)',
                      border: 'none',
                      boxShadow: '0 2px 5px rgba(24, 144, 255, 0.3)'
                    }}
                  >
                    {t('filter.apply')}
                  </Button>
                  <Button 
                    icon={<ClearOutlined />}
                    style={{ borderRadius: '6px' }}
                    onClick={() => {
                      filterForm.resetFields();
                      setFilters({
                        title: '',
                        categoryId: null,
                        priceMin: null,
                        priceMax: null,
                      });
                      fetchProducts();
                    }}
                  >
                    {t('filter.clear')}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Nút thêm sản phẩm */}
      <div className="mb-4">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddNew}
          style={{ 
            borderRadius: '6px',
            background: 'linear-gradient(to right, #52c41a, #389e0d)',
            border: 'none',
            boxShadow: '0 2px 5px rgba(82, 196, 26, 0.3)',
            height: '40px',
            display: 'flex',
            alignItems: 'center'
          }}
          className="hover:shadow-lg transition-all duration-300"
        >
          {t('action.addProduct')}
        </Button>
      </div>

      <div 
        className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
        style={{ borderRadius: '8px' }}
      >
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pageIndex,
            pageSize: pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `${t('pagination.total')} ${total} ${t('pagination.products')}`,
            position: ['bottomCenter'],
            hideOnSinglePage: false,
            maxCount: totalPages || 1,    // Giới hạn số lượng nút phân trang hiển thị
            itemRender: (page, type, originalElement) => {
              if (page > totalPages) {
                return null;
              }
              return originalElement;
            }
          }}
        />
      </div>

      <Modal
        visible={modalVisible}
        title={
          <div>
            {editingProduct ? (
              <><EditOutlined style={{ marginRight: 8, color: '#1890ff' }} /> {t('modal.editProduct')}</>
            ) : (
              <><PlusOutlined style={{ marginRight: 8, color: '#52c41a' }} /> {t('modal.addProduct')}</>
            )}
          </div>
        }
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText={editingProduct ? t('modal.update') : t('modal.add')}
        cancelText={t('modal.cancel')}
        okButtonProps={{ 
          style: { 
            borderRadius: '6px',
            background: editingProduct ? 'linear-gradient(to right, #1890ff, #096dd9)' : 'linear-gradient(to right, #52c41a, #389e0d)',
            border: 'none'
          } 
        }}
        cancelButtonProps={{ style: { borderRadius: '6px' } }}
        bodyStyle={{ paddingTop: 24 }}
        style={{ borderRadius: '8px' }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label={<span><TagsOutlined style={{ marginRight: 8 }} /> {t('form.productName')}</span>}
                rules={[{ required: true, message: t('form.productNameRequired') }]}
              >
                <Input 
                  placeholder={t('form.productNamePlaceholder')} 
                  style={{ borderRadius: '6px' }} 
                  className="hover:border-blue-400"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label={<span><DollarOutlined style={{ marginRight: 8 }} /> {t('form.productPrice')}</span>}
                rules={[{ required: true, message: t('form.productPriceRequired') }]}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: '6px' }}
                  placeholder={t('form.productPricePlaceholder')}
                  min={0}
                  className="hover:border-blue-400"
                  formatter={(value) => `$${value}`}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label={<span><AppstoreOutlined style={{ marginRight: 8 }} /> {t('form.productCategory')}</span>}
                rules={[{ required: true, message: t('form.productCategoryRequired') }]}
              >
                <Select
                  placeholder={t('form.productCategoryPlaceholder')}
                  style={{ width: '100%', borderRadius: '6px' }}
                  className="hover:border-blue-400"
                  options={categories.map(cat => ({
                    value: cat.id,
                    label: cat.name
                  }))}
                  dropdownStyle={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={t('form.productDescription')}
          >
            <Input.TextArea 
              placeholder={t('form.productDescriptionPlaceholder')} 
              rows={4} 
              style={{ borderRadius: '6px' }}
              className="hover:border-blue-400" 
            />
          </Form.Item>

          <Form.Item
            name="images"
            label={<span><LinkOutlined style={{ marginRight: 8 }} /> {t('form.productImage')}</span>}
          >
            <Input 
              placeholder={t('form.productImagePlaceholder')} 
              style={{ borderRadius: '6px' }} 
              className="hover:border-blue-400"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;