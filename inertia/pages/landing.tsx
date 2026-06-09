import { Head, Link } from '@inertiajs/react'

export default function Landing({ stats }: { stats: { totalItems: number; totalUsers: number; activeBorrows: number } }) {
  const features = [
    {
      title: 'Autentikasi Aman',
      desc: 'Login mahasiswa, dosen, & laboran dengan kontrol akses berbasis peran.',
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Peminjaman Cepat',
      desc: 'Pengajuan online, persetujuan otomatis, dan jadwal yang jelas.',
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Monitoring Real-time',
      desc: 'Pantau status alat — tersedia, dipinjam, atau perlu perawatan.',
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h4l2-8 4 16 2-8h4" />
        </svg>
      )
    },
    {
      title: 'Laporan & Ekspor',
      desc: 'Rekap peminjaman per periode, ekspor PDF/CSV dalam satu klik.',
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Notifikasi Otomatis',
      desc: 'Pengingat jatuh tempo lewat email & in-app agar tidak telat kembalikan.',
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: 'Scan QR Alat',
      desc: 'Setiap alat punya QR unik untuk check-in & check-out cepat di lab.',
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      )
    }
  ]

  return (
    <>
      <Head title="Sistem Peminjaman Alat Laboratorium" />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary/20 selection:text-primary">
        
        {/* Navigation */}
        <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white shadow-md shadow-accent/30">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <div className="font-black text-xl text-slate-800 tracking-tight">iBorrow<br/><span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block -mt-1">Informatika</span></div>
            </div>
            
            <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
              <a href="#" className="hover:text-primary transition-colors">Beranda</a>
              <a href="#fitur" className="hover:text-primary transition-colors">Katalog Alat</a>
              <a href="#alur" className="hover:text-primary transition-colors">Alur Peminjaman</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">Masuk</Link>
              <Link href="/register" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all">Daftar</Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main>
          <div className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden min-h-[90vh] flex items-center">
            {/* Gradient background matching the screenshot */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-sky-100" />
              <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-blue-200/50 mix-blend-multiply blur-3xl" />
              <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 mix-blend-multiply blur-3xl" />
              <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] rounded-full bg-sky-100/60 mix-blend-multiply blur-2xl" />
            </div>

            <div className="mx-auto max-w-7xl px-6 w-full lg:flex lg:items-center lg:gap-16">
              
              {/* Left text content */}
              <div className="max-w-xl lg:flex-shrink-0 z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-white/70 backdrop-blur px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
                  <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Sistem peminjaman generasi baru
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl leading-[1.1]">
                  Peminjaman Alat <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Laboratorium</span><br/>
                  <span className="text-blue-500">Informatika</span> jadi mudah.
                </h1>
                <p className="mt-6 text-base leading-7 text-slate-600 max-w-lg">
                  Kelola pengajuan, pelacakan, inventaris, status, notifikasi, hingga laporan peminjaman alat lab dalam satu platform yang cepat, transparan, dan modern.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <Link href="/register" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-300/40 hover:bg-indigo-700 hover:shadow-xl hover:scale-[1.02] transition-all">
                    Mulai Pinjam Alat
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
              <a href="#alur" className="rounded-xl border border-slate-300 bg-white/80 backdrop-blur px-6 py-3.5 font-bold text-slate-700 shadow-sm hover:bg-white transition-colors">Alur Peminjaman</a>
                </div>

                <div className="mt-10 flex items-center gap-8 pt-8 border-t border-slate-200/60">
                  <div>
                    <div className="text-2xl font-black text-slate-900">{stats.totalItems}+</div>
                    <div className="text-sm text-slate-500 mt-0.5">Alat tersedia</div>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">{stats.totalUsers}</div>
                    <div className="text-sm text-slate-500 mt-0.5">Pengguna aktif</div>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">98%</div>
                    <div className="text-sm text-slate-500 mt-0.5">Tepat waktu</div>
                  </div>
                </div>
              </div>

              {/* Right: Device mockup with floating icons */}
              <div className="mt-16 lg:mt-0 flex-1 flex justify-center items-center relative min-h-[420px]">
                {/* Floating category icons */}
                {/* Top-left */}
                <div className="absolute top-[5%] left-[10%] h-12 w-12 rounded-2xl bg-violet-500 shadow-lg shadow-violet-300/50 flex items-center justify-center animate-[float_4s_ease-in-out_infinite]">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                </div>
                {/* Top-center */}
                <div className="absolute top-[2%] left-[45%] h-12 w-12 rounded-2xl bg-pink-500 shadow-lg shadow-pink-300/50 flex items-center justify-center animate-[float_5s_ease-in-out_0.5s_infinite]">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                {/* Top-right */}
                <div className="absolute top-[8%] right-[5%] h-14 w-14 rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-300/50 flex items-center justify-center animate-[float_3.5s_ease-in-out_1s_infinite]">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                </div>
                {/* Middle-left */}
                <div className="absolute top-[40%] left-[4%] h-12 w-12 rounded-2xl bg-fuchsia-500 shadow-lg shadow-fuchsia-300/50 flex items-center justify-center animate-[float_4.5s_ease-in-out_0.3s_infinite]">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                {/* Middle-right */}
                <div className="absolute top-[42%] right-[2%] h-12 w-12 rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-300/50 flex items-center justify-center animate-[float_5s_ease-in-out_1.5s_infinite]">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                {/* Bottom-left */}
                <div className="absolute bottom-[10%] left-[12%] h-13 w-13 rounded-2xl bg-orange-500 shadow-lg shadow-orange-300/50 flex items-center justify-center p-3 animate-[float_4s_ease-in-out_0.8s_infinite]">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                {/* Bottom-right */}
                <div className="absolute bottom-[8%] right-[8%] h-14 w-14 rounded-2xl bg-teal-500 shadow-lg shadow-teal-300/50 flex items-center justify-center animate-[float_3.8s_ease-in-out_0.2s_infinite]">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                </div>

                {/* Center device card */}
                <div className="relative z-10 w-52 rounded-[2rem] bg-gradient-to-br from-indigo-900 to-slate-900 p-6 shadow-2xl shadow-slate-900/30 border border-white/10 text-white text-center mx-auto">
                  {/* App icon */}
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-600/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <div className="font-black text-xl tracking-tight">iBorrow</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">LAB · INFORMATIKA</div>
                  <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    </span>
                    Sistem Resmi Kampus
                  </div>
                </div>

                {/* Tooltip badge */}
                <div className="absolute bottom-[18%] left-[18%] bg-white rounded-xl px-3 py-2 shadow-lg border border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  Melayani 8 kategori alat lab
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Features Section */}
        <section id="fitur" className="bg-white py-24 sm:py-32 border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold leading-7 text-accent uppercase tracking-widest">Fitur Unggulan</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Semua yang dibutuhkan lab informatika modern</p>
              <p className="mt-4 text-lg leading-8 text-slate-600">Dirancang bersama laboran untuk menghapus antrian manual, kertas, dan WhatsApp yang berantakan.</p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.title} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-accent/30 hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                      {feature.icon}
                    </div>
                    <dt className="flex items-center gap-x-3 text-lg font-bold text-slate-900">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 ring-1 ring-blue-100 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </dt>
                    <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-slate-600">
                      <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="flex-auto">{feature.desc}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="alur" className="py-24 sm:py-32 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-sm font-bold leading-7 text-accent uppercase tracking-widest">Alur Peminjaman</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Empat langkah, selesai.</p>
              <p className="mt-4 text-lg leading-8 text-slate-600">Tidak perlu lagi formulir kertas atau antri di meja laboran.</p>
            </div>

            <div className="mt-20 relative">
              <div className="absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50 relative">
                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm shadow-md">1</div>
                    <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">Daftar & Login</h3>
                  <p className="mt-2 text-sm text-slate-500">Pakai akun kampus untuk akses sistem dengan aman.</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50 relative">
                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm shadow-md">2</div>
                    <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">Ajukan Peminjaman</h3>
                  <p className="mt-2 text-sm text-slate-500">Pilih alat dari katalog, tentukan tanggal & tujuan penggunaan.</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50 relative">
                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm shadow-md">3</div>
                    <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">Persetujuan Laboran</h3>
                  <p className="mt-2 text-sm text-slate-500">Notifikasi otomatis saat permintaan disetujui atau ditolak.</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50 relative">
                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm shadow-md">4</div>
                    <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">Kembalikan Tepat Waktu</h3>
                  <p className="mt-2 text-sm text-slate-500">Scan QR saat mengembalikan, status otomatis diperbarui.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-12 mb-20 max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 px-8 py-20 shadow-2xl md:px-20 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="max-w-2xl relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Siap pinjam alat lab tanpa ribet?</h2>
              <p className="text-indigo-100 text-lg">Bergabung sekarang — gratis untuk seluruh civitas Jurusan Informatika.</p>
            </div>
            <div className="flex gap-4 relative z-10 shrink-0">
              <Link href="/register" className="rounded-xl bg-white px-8 py-4 font-bold text-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">Daftar Akun</Link>
              <a href="#" className="rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-8 py-4 font-bold text-white transition-all backdrop-blur-sm">Hubungi Laboran</a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <div className="max-w-xs">
                <div className="flex items-center gap-3 mb-6">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white shadow-sm">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <div className="font-bold text-lg text-slate-800">iBorrow<br/><span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block -mt-1.5">Informatika</span></div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">Platform internal kampus untuk memudahkan peminjaman, monitoring, dan pelaporan penggunaan alat laboratorium Informatika.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 mb-6">Navigasi</h3>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-primary transition-colors">Beranda</a></li>
                  <li><a href="#fitur" className="hover:text-primary transition-colors">Katalog Alat</a></li>
                  <li><a href="#alur" className="hover:text-primary transition-colors">Alur Peminjaman</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-6">Kontak</h3>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    lab.informatika@kampus.ac.id
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                    @lab.informatika
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    github.com/labinformatika
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} iBorrow · Jurusan Informatika</p>
              <p>Dibangun dengan <span className="text-red-500">♥</span> untuk kemudahan akademik</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
