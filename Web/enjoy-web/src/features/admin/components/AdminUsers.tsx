import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const AdminUsers: React.FC = () => {
  const [rolesCount, setRolesCount] = useState<Record<string, number> | null>(null);
  const [activityStats, setActivityStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesData, activityData] = await Promise.all([
        adminApi.getRolesCount(),
        adminApi.getActivityStats()
      ]);
      setRolesCount(rolesData);
      setActivityStats(activityData);
    } catch (err: any) {
      console.error('Lỗi khi tải dữ liệu thống kê:', err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            Quản lý Người dùng
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Quản lý tình trạng học tập của học sinh, tình trạng hoạt động của phụ huynh
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

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-xl font-medium text-sm">
          {error}
        </div>
      )}

      {/* Block 1: Users */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0">Total Users</h3>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-md text-slate-700 font-medium">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span>Parents</span>
            <span className="font-bold text-slate-900">{loading ? '...' : (rolesCount?.parents ?? 0).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span>Children</span>
            <span className="font-bold text-slate-900">{loading ? '...' : (rolesCount?.children ?? 0).toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Block 2: PARENT ACTIVITY */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0">PARENT ACTIVITY</h3>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="grid gap-3 max-w-md text-slate-700 font-medium">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-xs">🟢</span>
              <span>Active</span>
            </div>
            <span className="font-bold text-slate-900">{loading ? '...' : (activityStats?.active ?? 0).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-xs">🟡</span>
              <span>Inactive</span>
            </div>
            <span className="font-bold text-slate-900">{loading ? '...' : (activityStats?.inactive ?? 0).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-rose-500 text-xs">🔴</span>
              <span>Dormant</span>
            </div>
            <span className="font-bold text-slate-900">{loading ? '...' : (activityStats?.dormant ?? 0).toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Block 3: CHILDREN LEARNING HEALTH (Fake Data) */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0">CHILDREN LEARNING HEALTH</h3>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="grid gap-3 max-w-md text-slate-700 font-medium">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm opacity-80">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-xs">🟢</span>
              <span>Healthy</span>
            </div>
            <span className="font-bold text-slate-900">1,642</span>
          </div>
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm opacity-80">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-xs">🟡</span>
              <span>At Risk</span>
            </div>
            <span className="font-bold text-slate-900">531</span>
          </div>
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm opacity-80">
            <div className="flex items-center gap-2">
              <span className="text-rose-500 text-xs">🔴</span>
              <span>Inactive</span>
            </div>
            <span className="font-bold text-slate-900">313</span>
          </div>
        </div>
      </div>

    </div>
  );
};
