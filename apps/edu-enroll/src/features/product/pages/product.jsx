import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Popconfirm, Image, Spin, Select, Card, Row, Col, Divider, Tooltip, Typography, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined, SearchOutlined, FilterOutlined, TagsOutlined, DollarOutlined, ClearOutlined, AppstoreOutlined, UploadOutlined, LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import { productApi } from '../api';
import { useSearchParams } from 'react-router-dom';
import { usePaginationParams } from '@repo/hooks';

const { Title } = Typography;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

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
      message.error('Không thể tải danh sách danh mục');
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
      message.error('Không thể tải danh sách sản phẩm');
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
      
      // Đảm bảo images là một mảng
      const images = values.images ? [values.images] : ['https://placehold.co/600x400'];
      
      if (editingProduct) {
        // Cập nhật sản phẩm
        await productApi.updateProduct(editingProduct.id, {
          ...values,
          images
        });
        message.success('Cập nhật sản phẩm thành công');
      } else {
        // Thêm sản phẩm mới
        await productApi.createProduct({
          ...values,
          images
        });
        message.success('Thêm sản phẩm mới thành công');
      }
      
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await productApi.deleteProduct(id);
      message.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error('Không thể xóa sản phẩm');
    }
  };

  // Xử lý tải lên hình ảnh
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      return false;
    }
    return isJpgOrPng && isLt2M;
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      setImageLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      // Đối với demo, ta xử lý base64 của hình ảnh
      getBase64(info.file.originFileObj, (url) => {
        setImageLoading(false);
        setImageUrl(url);
        form.setFieldsValue({ images: url });
      });
    }
  };

  // Custom upload request để không gửi lên server mặc định
  const customUploadRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
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
      title: 'Hình ảnh',
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
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`
    },
    {
      title: 'Danh mục',
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
        return <span className="text-gray-400">Chưa phân loại</span>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="link" icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Quản lý Sản phẩm</Title>
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
            <FilterOutlined style={{ marginRight: 8 }} /> Bộ lọc sản phẩm
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
              <Form.Item name="title" label={<span className="filter-label"><TagsOutlined /> Tên sản phẩm</span>} className="mb-0">
                <Input 
                  placeholder="Tìm theo tên sản phẩm" 
                  allowClear 
                  prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                  style={{ borderRadius: '6px' }}
                  className="hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={5} lg={5}>
              <Form.Item name="categoryId" label={<span className="filter-label"><AppstoreOutlined /> Danh mục</span>} className="mb-0">
                <Select
                  placeholder="Chọn danh mục"
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
              <Form.Item name="priceMin" label={<span className="filter-label"><DollarOutlined /> Giá từ</span>} className="mb-0">
                <InputNumber
                  style={{ width: '100%', borderRadius: '6px' }}
                  placeholder="Min"
                  min={0}
                  className="hover:border-blue-400"
                  formatter={(value) => `$${value}`}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={3} lg={3}>
              <Form.Item name="priceMax" label={<span className="filter-label"><DollarOutlined /> Đến</span>} className="mb-0">
                <InputNumber
                  style={{ width: '100%', borderRadius: '6px' }}
                  placeholder="Max"
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
                    Lọc sản phẩm
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
                    Xóa bộ lọc
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
          Thêm sản phẩm
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
            showTotal: (total) => `Tổng ${total} sản phẩm`,
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
              <><EditOutlined style={{ marginRight: 8, color: '#1890ff' }} /> Chỉnh sửa sản phẩm</>
            ) : (
              <><PlusOutlined style={{ marginRight: 8, color: '#52c41a' }} /> Thêm sản phẩm mới</>
            )}
          </div>
        }
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText={editingProduct ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
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
                label={<span><TagsOutlined style={{ marginRight: 8 }} /> Tên sản phẩm</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input 
                  placeholder="Nhập tên sản phẩm" 
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
                label={<span><DollarOutlined style={{ marginRight: 8 }} /> Giá sản phẩm</span>}
                rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: '6px' }}
                  placeholder="Giá sản phẩm"
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
                label={<span><AppstoreOutlined style={{ marginRight: 8 }} /> Danh mục</span>}
                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
              >
                <Select
                  placeholder="Chọn danh mục sản phẩm"
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
            label="Mô tả sản phẩm"
          >
            <Input.TextArea 
              placeholder="Nhập mô tả chi tiết về sản phẩm" 
              rows={4} 
              style={{ borderRadius: '6px' }}
              className="hover:border-blue-400" 
            />
          </Form.Item>

          <Form.Item
            name="images"
            label="Hình ảnh sản phẩm"
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
              customRequest={customUploadRequest}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;