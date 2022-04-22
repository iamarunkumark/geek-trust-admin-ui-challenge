import { Button, Form, Input, Modal, Space, Table } from "antd"
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteMultipleUsers, deleteUser, editUser, fetchUserDataAsync, selectUser, selectUserAPIStatus, User } from "./tableSlice";
import 'antd/dist/antd.css';
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import styles from './Table.module.scss';
const { Search } = Input;

export const UserDataTable = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserDataAsync());
  }, []);
  const users = useAppSelector(selectUser);
  const userAPIStatus = useAppSelector(selectUserAPIStatus);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as React.Key[]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editUserData, setEditUserData] = useState({} as User);
  const [searchText, setSearchText] = useState('');
  const handleSearch = (value: string) => setSearchText(value);
  const handleEditUser = (editUserData: User) => { setIsModalVisible(true); setEditUserData(editUserData) }
  const handleDeleteUser = (id: string) => dispatch(deleteUser(id));
  const handleOk = () => { dispatch(editUser(editUserData)); setIsModalVisible(false); }
  const handleCancel = () => { setIsModalVisible(false); }
  const handleNameEdit = (name: string) => {
    let userData = Object.assign({}, editUserData);
    userData.name = name;
    setEditUserData(userData);
  }
  const handleEmailEdit = (email: string) => {
    let userData = Object.assign({}, editUserData);
    userData.email = email;
    setEditUserData(userData);
  }
  const handleRoleEdit = (role: string) => {
    let userData = Object.assign({}, editUserData);
    userData.role = role;
    setEditUserData(userData);
  }
  const handleDeleteMultipleUsers = () => {
    dispatch(deleteMultipleUsers(selectedRowKeys as string[]));
  }
  const columns: ColumnsType<User> = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      sorter: true,
      render: (value, record) => (
        <Space size="middle">
          <EditTwoTone className={styles.actionIcon} onClick={() => handleEditUser(record)} />
          <DeleteTwoTone className={styles.actionIcon} onClick={() => handleDeleteUser(record.id)} />
        </Space>
      ),
    },
  ];
  const rowSelection: TableRowSelection<User> = {
    type: 'checkbox',
    preserveSelectedRowKeys: true,
    selectedRowKeys,
    onChange: (rowKey) => onSelectChange(rowKey),
  };
  const onSelectChange = (currentSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(currentSelectedRowKeys);
  };
  let filteredUserData;
  if (searchText) {
    filteredUserData = users.filter(user => user.id === searchText || user.name.toLowerCase().includes(searchText.toLowerCase()) || user.email.toLowerCase().includes(searchText.toLowerCase()) || user.role.toLowerCase().includes(searchText.toLowerCase()));
  } else {
    filteredUserData = users;
  }
  return (
    <div className={styles.base}>
      <div className={styles.search}><Search placeholder="search by name, email or role" onSearch={handleSearch} style={{ width: 500 }} allowClear />
      </div>
      <Table<User>
        bordered
        columns={columns}
        dataSource={filteredUserData}
        loading={userAPIStatus === 'loading'}
        pagination={{ position: ['bottomCenter'], showQuickJumper: true, defaultPageSize: 10, showSizeChanger: true, total: filteredUserData.length, showTotal: () => `Total ${filteredUserData.length} items` }}
        size='middle'
        showHeader={true}
        tableLayout={undefined}
        rowSelection={rowSelection}
        rowKey={users => users.id}
        className={styles.userTable}
      />
      <Modal title="Edit User" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form>
          <Form.Item label='name'><Input value={editUserData.name} onChange={e => handleNameEdit(e.target.value)} /></Form.Item>
          <Form.Item label='email'><Input value={editUserData.email} onChange={e => handleEmailEdit(e.target.value)} /></Form.Item>
          <Form.Item label='role'><Input value={editUserData.role} onChange={e => handleRoleEdit(e.target.value)} /></Form.Item>
        </Form>
      </Modal>
      {selectedRowKeys.length > 1 && <Button color="red" type="primary" danger className={styles.deleteButton} onClick={handleDeleteMultipleUsers}> Delete Selected </Button>}
    </div>);
}
