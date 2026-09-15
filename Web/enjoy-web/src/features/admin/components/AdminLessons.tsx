import React from 'react';

export const AdminLessons: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
          Quản lý Bài học
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Danh sách và cấu trúc các bài học, khoá học, từ vựng
        </p>
      </div>
    </div>
  );
};
