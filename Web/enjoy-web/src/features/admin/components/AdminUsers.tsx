import React from 'react';

export const AdminUsers: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
          Quản lý Người dùng
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Danh sách tài khoản học sinh, phụ huynh và phân quyền quản trị
        </p>
      </div>
    </div>
  );
};
