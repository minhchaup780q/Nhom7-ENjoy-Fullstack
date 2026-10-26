import React, { useEffect, useState } from 'react';
import { adminApi, type OverviewResponse } from '../api/adminApi';
import {
  UsersIcon,
  ArrowPathIcon,
  BoltIcon,
  CalendarDaysIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface StickinessLevel {
  label: string;
  description: string;
  badgeClass: string;
}

// Các mốc đánh giá tỉ lệ DAU/MAU (Stickiness Ratio)
const getStickinessLevel = (ratio: number, mau: number): StickinessLevel => {
  if (mau === 0) {
    return { label: 'Chưa có dữ liệu', description: 'Chưa có người dùng hoạt động trong 30 ngày qua', badgeClass: 'bg-slate-100 text-slate-500' };
  }
  if (ratio >= 50) {
    return { label: 'Xuất sắc', description: 'Người dùng mở app ~15 ngày/tháng — cơ chế thưởng/nhiệm vụ hằng ngày rất hiệu quả', badgeClass: 'bg-emerald-50 text-emerald-600' };
  }
  if (ratio >= 20) {
    return { label: 'Khá', description: 'Mức trung bình khá, người dùng vào app ~6 ngày/tháng', badgeClass: 'bg-sky-50 text-sky-600' };
  }
  if (ratio >= 10) {
    return { label: 'Cần cải thiện', description: 'Người dùng quay lại ~3–6 ngày/tháng', badgeClass: 'bg-amber-50 text-amber-600' };
  }
  return { label: 'Thấp', description: 'Người dùng hiếm khi quay lại (~3 ngày/tháng), sản phẩm chưa giữ chân được người dùng', badgeClass: 'bg-red-50 text-red-500' };
};

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  iconClass: string;
  value: React.ReactNode;
  footer: React.ReactNode;
  loading: boolean;
  error: string | null;
  tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon, iconClass, value, footer, loading, error, tooltip }) => (
  <div
    title={tooltip}
    className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}>{icon}</div>
    </div>

    <div className="my-2">
      {loading ? (
        <div className="h-9 w-28 bg-slate-100 animate-pulse rounded-lg" />
      ) : error ? (
        <p className="text-sm font-bold text-red-500">{error}</p>
      ) : (
        <h3 className="text-3xl font-display font-extrabold text-slate-800">{value}</h3>
      )}
    </div>

    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs min-h-[1.75rem]">
      {!loading && !error && footer}
    </div>
  </div>
);

const GrowthIndicator: React.FC<{ percent: number | null }> = ({ percent }) => {
  if (percent === null) {
    return <span className="font-semibold text-slate-400">Chưa có dữ liệu tháng trước</span>;
  }
  if (percent === 0) {
    return <span className="font-semibold text-slate-400">Không đổi so với tháng trước</span>;
  }
  const isUp = percent > 0;
  const Icon = isUp ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  return (
    <span className={`flex items-center gap-1 font-bold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
      <Icon className="w-4 h-4 stroke-[2.5]" />
      {isUp ? '+' : ''}
      {percent.toLocaleString('vi-VN')}%
      <span className="font-semibold text-slate-400">so với tháng trước</span>
    </span>
  );
};

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getOverview();
      setOverview(data);
    } catch (err: any) {
      console.error('Lỗi khi tải dữ liệu tổng quan:', err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const dau = overview?.dau ?? 0;
  const mau = overview?.mau ?? 0;
  const ratio = overview?.stickinessRatio ?? 0;
  const level = getStickinessLevel(ratio, mau);

  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            Overview
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Tổng người dùng */}
        <StatCard
          title="Tổng Người Dùng"
          icon={<UsersIcon className="w-5 h-5 stroke-[2.5]" />}
          iconClass="bg-primary-soft text-primary"
          value={overview?.totalUsers.toLocaleString('vi-VN') ?? 0}
          footer={<GrowthIndicator percent={overview?.userGrowthPercent ?? null} />}
          loading={loading}
          error={error}
          tooltip={`Cuối tháng trước: ${overview?.previousMonthTotalUsers.toLocaleString('vi-VN') ?? 0} người dùng`}
        />

        {/* DAU */}
        <StatCard
          title="DAU"
          icon={<BoltIcon className="w-5 h-5 stroke-[2.5]" />}
          iconClass="bg-amber-50 text-amber-500"
          value={dau.toLocaleString('vi-VN')}
          footer={<span className="font-semibold text-slate-400">Người dùng hoạt động hôm nay</span>}
          loading={loading}
          error={error}
          tooltip="Daily Active Users: số người dùng duy nhất đăng nhập thành công (hoặc làm mới phiên) trong ngày hôm nay"
        />

        {/* MAU */}
        <StatCard
          title="MAU"
          icon={<CalendarDaysIcon className="w-5 h-5 stroke-[2.5]" />}
          iconClass="bg-sky-50 text-sky-500"
          value={mau.toLocaleString('vi-VN')}
          footer={<span className="font-semibold text-slate-400">Người dùng hoạt động 30 ngày qua</span>}
          loading={loading}
          error={error}
          tooltip="Monthly Active Users: số người dùng duy nhất hoạt động trong 30 ngày gần nhất (tính cả hôm nay)"
        />

        {/* DAU/MAU */}
        <StatCard
          title="Tỉ lệ DAU/MAU"
          icon={<FireIcon className="w-5 h-5 stroke-[2.5]" />}
          iconClass="bg-rose-50 text-rose-500"
          value={`${ratio.toLocaleString('vi-VN')}%`}
          footer={
            <>
              <span className="font-semibold text-slate-400 truncate">Độ dính (Stickiness)</span>
              <span className={`px-2 py-0.5 rounded-lg font-bold whitespace-nowrap ${level.badgeClass}`}>{level.label}</span>
            </>
          }
          loading={loading}
          error={error}
          tooltip={`Tỉ lệ = (DAU / MAU) × 100%. ${level.description}`}
        />
      </div>

      {/* Thang đánh giá Stickiness */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Ý nghĩa tỉ lệ DAU/MAU
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <li className="flex gap-3">
            <span className="px-2 py-0.5 h-fit rounded-lg font-bold text-xs bg-red-50 text-red-500 whitespace-nowrap">&lt; 10%</span>
            <span className="text-slate-600">Người dùng hiếm khi quay lại (~3 ngày/tháng). Sản phẩm chưa giữ chân được người dùng.</span>
          </li>
          <li className="flex gap-3">
            <span className="px-2 py-0.5 h-fit rounded-lg font-bold text-xs bg-sky-50 text-sky-600 whitespace-nowrap">≥ 20%</span>
            <span className="text-slate-600">Mức trung bình khá với app thông thường (~6 ngày/tháng).</span>
          </li>
          <li className="flex gap-3">
            <span className="px-2 py-0.5 h-fit rounded-lg font-bold text-xs bg-emerald-50 text-emerald-600 whitespace-nowrap">≥ 50%</span>
            <span className="text-slate-600">Xuất sắc (~15 ngày/tháng). Cơ chế thưởng/nhiệm vụ hằng ngày đang hoạt động rất hiệu quả.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
