import React from 'react';

export const AdminSystem: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
          Quản lý Hệ thống
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Cấu hình thông số hệ thống, dịch vụ microservices và logs
        </p>
      </div>
    </div>
  );
};
