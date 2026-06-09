import { Head, useForm, usePage } from '@inertiajs/react'
import UserLayout from '../../components/UserLayout'
import type { SharedProps } from '../../types'
import { useState } from 'react'
import clsx from 'clsx'
import FlashMessage from '../../components/FlashMessage'

interface ProfileUser {
  id: number
  fullName: string
  email: string
  role: string
  nimNip: string | null
  createdAt: string
}

interface ProfileStats {
  total: number
  returned: number
  active: number
  late: number
  onTime: number
  reputation: number
}

const roleLabel: Record<string, string> = {
  mahasiswa: 'Mahasiswa',
  dosen: 'Dosen',
  staf: 'Staf Lab',
  admin: 'Admin',
}

const badges = [
  {
    key: 'active',
    label: 'Peminjam Aktif',
    desc: '10+ peminjaman',
    condition: (s: ProfileStats) => s.total >= 10,
    color: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50',
    icon: (
      <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    key: 'gold',
    label: 'Reputasi Emas',
    desc: 'Skor 95+',
    condition: (s: ProfileStats) => s.reputation >= 95,
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-50',
    icon: (
      <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    key: 'streak',
    label: 'On Streak',
    desc: '5x tepat waktu',
    condition: (s: ProfileStats) => s.onTime >= 5,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    icon: (
      <svg className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
  },
  {
    key: 'earlybird',
    label: 'Early Bird',
    desc: 'Pengembalian awal',
    condition: (s: ProfileStats) => s.onTime >= 1 && s.late === 0,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    icon: (
      <svg className="h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
]

function getReputationTier(score: number) {
  if (score >= 90) return { label: 'Gold', color: 'text-amber-500', barColor: 'bg-gradient-to-r from-amber-400 to-amber-500' }
  if (score >= 70) return { label: 'Silver', color: 'text-slate-400', barColor: 'bg-gradient-to-r from-slate-300 to-slate-400' }
  return { label: 'Bronze', color: 'text-orange-600', barColor: 'bg-gradient-to-r from-orange-400 to-orange-500' }
}

function joinedDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })
}

export default function ProfilePage({
  profileUser,
  stats,
}: {
  profileUser: ProfileUser
  stats: ProfileStats
}) {
  const { user } = usePage<SharedProps>().props
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info')

  const editForm = useForm({
    full_name: profileUser.fullName,
    nim_nip: profileUser.nimNip ?? '',
  })

  const pwForm = useForm({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const tier = getReputationTier(stats.reputation)
  const initials = profileUser.fullName.slice(0, 2).toUpperCase()

  // Academic year derived from createdAt
  const joined = new Date(profileUser.createdAt)
  const academicYear = joined.getFullYear()

  return (
    <UserLayout>
      <Head title="Profil" />

      {/* Greeting */}
      <div className="mb-6">
        <p className="text-slate-500">Halo,</p>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          {user?.fullName} <span className="text-3xl">👋</span>
        </h1>
      </div>

      {/* Profile Header Card */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-6">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+PC9zdmc+')]" />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-4">
            <div className="relative w-fit">
              <div className="h-20 w-20 rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                {initials}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('info')}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                  activeTab === 'info'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                )}
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Pengaturan
                </span>
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit Profil
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{profileUser.fullName}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Terverifikasi
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                {profileUser.nimNip && (
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                    {profileUser.nimNip}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                  Teknik Informatika
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Anggota sejak {joinedDate(profileUser.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Reputation + Personal Info */}
        <div className="space-y-6">
          {/* Reputation Card */}
          <div className="rounded-3xl bg-slate-900 p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              <span className="font-bold text-slate-300 text-sm">Skor Reputasi</span>
            </div>
            <div className="text-5xl font-black mb-1">
              {stats.reputation}
              <span className="text-xl font-semibold text-slate-400"> / 100</span>
            </div>
            {/* Gradient bar */}
            <div className="mt-4 h-3 w-full rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 transition-all duration-1000"
                style={{ width: `${stats.reputation}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-1">
              <span>Bronze</span>
              <span>Silver</span>
              <span className={clsx('flex items-center gap-1', tier.color)}>Gold <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></span>
            </div>
            {/* Stat pills */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <div className="text-xl font-black">{stats.total}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Total</div>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <div className="text-xl font-black">{stats.onTime}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Tepat waktu</div>
              </div>
              <div className="rounded-xl bg-red-500/20 p-3 text-center">
                <div className="text-xl font-black text-red-400">{stats.late}</div>
                <div className="text-[10px] text-red-400/80 font-semibold uppercase tracking-wider mt-0.5">Telat</div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-bold text-slate-900 mb-1">Informasi Pribadi</h3>
            <p className="text-xs text-slate-400 mb-5">Data ini terhubung dengan SIAKAD kampus.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Kampus</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5 break-all">{profileUser.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Program Studi</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">S1 Teknik Informatika</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Angkatan</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{academicYear}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">NIM / NIP</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{profileUser.nimNip || '-'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{roleLabel[profileUser.role] ?? profileUser.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Edit Form + Badges */}
        <div className="space-y-6">
          {/* Edit Profile Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            {/* Tab switcher */}
            <div className="flex gap-2 mb-6 border-b border-slate-100 pb-4">
              <button
                onClick={() => setActiveTab('info')}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                  activeTab === 'info' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                Edit Profil
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                  activeTab === 'security' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                Ubah Password
              </button>
            </div>

            <FlashMessage />

            {activeTab === 'info' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  editForm.post('/profile/update')
                }}
                className="space-y-4"
              >
                <div>
                  <label className="label">Nama Lengkap</label>
                  <input
                    className="input"
                    value={editForm.data.full_name}
                    onChange={(e) => editForm.setData('full_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">NIM / NIP</label>
                  <input
                    className="input"
                    value={editForm.data.nim_nip}
                    onChange={(e) => editForm.setData('nim_nip', e.target.value)}
                    placeholder="Opsional"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input bg-slate-50 cursor-not-allowed" value={profileUser.email} readOnly />
                  <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah.</p>
                </div>
                <button
                  className="btn-primary w-full justify-center"
                  disabled={editForm.processing}
                >
                  {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            )}

            {activeTab === 'security' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  pwForm.post('/profile/change-password')
                }}
                className="space-y-4"
              >
                <div>
                  <label className="label">Password Saat Ini</label>
                  <input
                    className="input"
                    type="password"
                    value={pwForm.data.current_password}
                    onChange={(e) => pwForm.setData('current_password', e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="label">Password Baru</label>
                  <input
                    className="input"
                    type="password"
                    value={pwForm.data.new_password}
                    onChange={(e) => pwForm.setData('new_password', e.target.value)}
                    required
                    placeholder="Min. 8 karakter"
                  />
                </div>
                <div>
                  <label className="label">Konfirmasi Password Baru</label>
                  <input
                    className="input"
                    type="password"
                    value={pwForm.data.confirm_password}
                    onChange={(e) => pwForm.setData('confirm_password', e.target.value)}
                    required
                    placeholder="Ulangi password baru"
                  />
                </div>
                <button
                  className="btn-primary w-full justify-center"
                  disabled={pwForm.processing}
                >
                  {pwForm.processing ? 'Memproses...' : 'Ubah Password'}
                </button>
              </form>
            )}
          </div>

          {/* Badges / Pencapaian */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900">Pencapaian</h3>
              <span className="text-xs font-semibold text-primary">Lihat semua</span>
            </div>
            <p className="text-xs text-slate-400 mb-5">Lencana yang sudah kamu kumpulkan</p>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge) => {
                const unlocked = badge.condition(stats)
                return (
                  <div
                    key={badge.key}
                    className={clsx(
                      'rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-all',
                      unlocked ? badge.bg + ' border border-slate-100' : 'bg-slate-50 border border-dashed border-slate-200 opacity-50 grayscale'
                    )}
                  >
                    <div className={clsx(
                      'h-14 w-14 rounded-2xl flex items-center justify-center',
                      unlocked ? 'bg-white shadow-sm' : 'bg-slate-100'
                    )}>
                      {badge.icon}
                    </div>
                    <div className="font-bold text-sm text-slate-800">{badge.label}</div>
                    <div className="text-[11px] text-slate-500">{badge.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
