import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
          Dashboard
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Tổng quan hệ thống và các chỉ số hoạt động của ENjoy
        </p>
      </div>

      {/* Grid widgets mẫu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng Người Dùng</p>
          <h3 className="text-2xl font-extrabold text-slate-700 mt-2">1,280</h3>
          <p className="text-xs font-semibold text-emerald-500 mt-1">↑ 12% so với tháng trước</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Bài Học Hoàn Thành</p>
          <h3 className="text-2xl font-extrabold text-slate-700 mt-2">8,420</h3>
          <p className="text-xs font-semibold text-emerald-500 mt-1">↑ 24% tuần này</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Số Lượng Khóa Học</p>
          <h3 className="text-2xl font-extrabold text-slate-700 mt-2">24</h3>
          <p className="text-xs font-semibold text-slate-400 mt-1">Hoạt động bình thường</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tỷ lệ Tương tác</p>
          <h3 className="text-2xl font-extrabold text-slate-700 mt-2">88.5%</h3>
          <p className="text-xs font-semibold text-primary mt-1">Rất tích cực</p>
        </div>
      </div>
    </div>
  );
};

