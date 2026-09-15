import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi';
import { UsersIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getUserCount();
      setTotalUsers(data.totalUsers);
    } catch (err: any) {
      console.error('Lỗi khi tải số lượng người dùng:', err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Tổng quan hệ thống ENjoy
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Widget Tổng Người Dùng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tổng Người Dùng
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <UsersIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>

          <div className="my-2">
            {loading ? (
              <div className="h-9 w-28 bg-slate-100 animate-pulse rounded-lg" />
            ) : error ? (
              <p className="text-sm font-bold text-red-500">{error}</p>
            ) : (
              <h3 className="text-3xl font-display font-extrabold text-slate-800">
                {totalUsers?.toLocaleString('vi-VN') ?? 0}
              </h3>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">Dữ liệu từ user-service</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
};

