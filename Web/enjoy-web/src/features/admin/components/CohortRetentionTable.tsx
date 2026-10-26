import React, { useEffect, useState } from 'react';
import { adminApi, type CohortRange, type CohortRow } from '../api/adminApi';
import { ArrowPathIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import {
  getRetentionCellStyle,
  getChurnCellStyle,
  RETENTION_LEVELS,
  type RetentionCellStyle,
} from '../utils/cohortColor';
import { InfoPopover } from './InfoPopover';

const RANGES: CohortRange[] = [7, 14, 30];

const formatCohortDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Ô tỉ lệ có nền màu theo thang heatmap
const RateCell: React.FC<{ style: RetentionCellStyle }> = ({ style }) => (
  <td className="px-4 py-3">
    <span
      className={`inline-flex items-center justify-center min-w-[3.5rem] px-2.5 py-1 rounded-lg text-sm font-bold ${style.className}`}
    >
      {style.label}
    </span>
  </td>
);

export const CohortRetentionTable: React.FC = () => {
  const [days, setDays] = useState<CohortRange>(7);
  const [rows, setRows] = useState<CohortRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (range: CohortRange) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getCohortRetention(range);
      setRows(data);
    } catch (err: any) {
      console.error('Lỗi khi tải bảng cohort:', err);
      setError('Không thể tải dữ liệu bảng cohort');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(days);
  }, [days]);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
      {/* Header + bộ lọc */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <TableCellsIcon className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="flex items-center gap-1.5 text-lg font-display font-extrabold text-slate-800">
              Giữ chân theo nhóm đăng ký
              <InfoPopover ariaLabel="Chú thích mức giữ chân">
                <h4 className="text-sm font-display font-extrabold text-slate-800 mb-2">Chú thích mức giữ chân</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {RETENTION_LEVELS.map((lv) => (
                    <span
                      key={lv.range}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${lv.className}`}
                      title={lv.meaning}
                    >
                      {lv.range}
                      <span className="font-medium opacity-80">· {lv.meaning}</span>
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-400">
                    — · Chưa đủ dữ liệu
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Cột <span className="font-semibold">Churn 14 ngày</span> = 100% − tỉ lệ Day 14 (càng cao càng nhiều người rời bỏ).
                </p>
              </InfoPopover>
            </h3>
            <p className="text-xs font-medium text-slate-400">
              Tỉ lệ người dùng còn hoạt động sau khi đăng ký (Cohort Retention)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented control chọn phạm vi ngày */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setDays(r)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50 ${
                  days === r ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r} ngày
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchData(days)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <th className="px-4 py-3">Ngày đăng ký</th>
              <th className="px-4 py-3">Số lượng</th>
              <th className="px-4 py-3">Day 1</th>
              <th className="px-4 py-3">Day 7</th>
              <th className="px-4 py-3">Day 14</th>
              <th className="px-4 py-3">Churn 14 ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-lg" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-6">
                  <div className="p-4 bg-red-50 text-red-500 rounded-xl font-medium text-sm">{error}</div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 font-medium">
                  Chưa có người dùng đăng ký trong khoảng thời gian này
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.cohortDate} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">
                    {formatCohortDate(row.cohortDate)}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {row.newUsers.toLocaleString('vi-VN')}
                  </td>
                  <RateCell style={getRetentionCellStyle(row.day1Rate)} />
                  <RateCell style={getRetentionCellStyle(row.day7Rate)} />
                  <RateCell style={getRetentionCellStyle(row.day14Rate)} />
                  <RateCell style={getChurnCellStyle(row.churn14Rate)} />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
