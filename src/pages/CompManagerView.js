import React, { useState } from 'react';
import { Table, Tag, Space, Modal } from 'antd';
import '../compManagerView.css';

const { confirm } = Modal;

const CompManagerView = () => {
  const [orders, setOrders] = useState([
    {
      key: '1',
      empId: 'EMP001',
      empName: 'John Doe',
      tshirtSize: 'Large',
      waistSize: '32',
      orderDate: '2024-03-20',
      status: 'Processing',
    },
    {
      key: '2',
      empId: 'EMP002',
      empName: 'Jane Smith',
      tshirtSize: 'Medium',
      waistSize: '30',
      orderDate: '2024-03-21',
      status: 'Delivered',
    },
    {
      key: '3',
      empId: 'EMP003',
      empName: 'Alice Johnson',
      tshirtSize: 'XL',
      waistSize: '34',
      orderDate: '2024-03-22',
      status: 'Order Cancelled',
    },
  ]);

  const handleStatusChange = (record, status) => {
    confirm({
      title: 'Confirm Status Change',
      content: `Are you sure you want to change the status of order ${record.empId} to ${status}?`,
      onOk() {
        const updatedOrders = orders.map(order => {
          if (order.key === record.key) {
            return { ...order, status };
          }
          return order;
        });
        setOrders(updatedOrders);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns = [
    {
      title: 'Emp ID',
      dataIndex: 'empId',
      key: 'empId',
    },
    {
      title: 'Employee Name',
      dataIndex: 'empName',
      key: 'empName',
    },
    {
      title: 'T-shirt Size',
      dataIndex: 'tshirtSize',
      key: 'tshirtSize',
    },
    {
      title: 'Waist Size',
      dataIndex: 'waistSize',
      key: 'waistSize',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Space size="middle">
          <Tag color={text === 'Processing' ? 'blue' : text === 'Delivered' ? 'green' : 'red'} onClick={() => handleStatusChange(record, text === 'Processing' ? 'Delivered' : text === 'Delivered' ? 'Order Cancelled' : 'Processing')}>
            {text}
          </Tag>
        </Space>
      ),
    },
  ];

  return (
    <div className="compManager-view-container">
      <h2 className="compManager-orders-title">Uniform Orders</h2>
      <Table columns={columns} dataSource={orders} />
    </div>
  );
};

export default CompManagerView;
