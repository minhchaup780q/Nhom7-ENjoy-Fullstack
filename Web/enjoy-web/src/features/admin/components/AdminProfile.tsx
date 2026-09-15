import React from 'react';

export const AdminProfile: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
          Hồ sơ Admin
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Thông tin quản trị viên và cài đặt tài khoản
        </p>
      </div>
    </div>
  );
};
