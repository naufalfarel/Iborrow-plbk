import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function Register() {
  const { flash } = usePage<any>().props
  const form = useForm({
    full_name: '',
    email: '',
    nim_nip: '',
    password: '',
    password_confirmation: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Head title="Daftar Akun Baru" />
      <main className="min-h-screen bg-slate-50 flex flex-col md:flex-row selection:bg-primary/20 selection:text-primary">
        
        {/* Left Side: Brand & Visual */}
        <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 p-12 text-white flex-col justify-between overflow-hidden">
          {/* Abstract background blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-3xl mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-3xl mix-blend-screen pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white shadow-md shadow-accent/30">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div className="font-black text-xl text-white tracking-tight">iBorrow<br/><span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold block -mt-1">Informatika</span></div>
          </div>

          <div className="relative z-10 mt-auto max-w-md">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Mulai perjalanan akademikmu dengan mudah.</h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Bergabung dengan ribuan civitas akademika lainnya untuk kemudahan akses alat praktikum dan penelitian.
            </p>
          </div>
          
          <div className="relative z-10 mt-20 text-sm text-slate-400">
            &copy; {new Date().getFullYear()} iBorrow · Jurusan Informatika
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative">
          <div className="mx-auto w-full max-w-md">
            
            {/* Mobile Header */}
            <div className="flex md:hidden items-center gap-3 mb-10 justify-center">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white shadow-md shadow-accent/30">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <div className="font-black text-xl text-slate-800 tracking-tight">iBorrow</div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Daftar Akun</h2>
            <p className="text-slate-500 mb-8">Buat akun untuk mulai meminjam alat lab.</p>

            {flash?.error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium flex gap-3 items-start">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {flash.error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); form.post('/register') }} className="space-y-5">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                <input 
                  className="w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none" 
                  type="text" 
                  placeholder="Misal: Budi Santoso"
                  value={form.data.full_name} 
                  onChange={(e) => form.setData('full_name', e.target.value)} 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">NIM / NIP</label>
                <input 
                  className="w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none" 
                  type="text" 
                  placeholder="Opsional"
                  value={form.data.nim_nip} 
                  onChange={(e) => form.setData('nim_nip', e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Kampus</label>
                <input 
                  className="w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none" 
                  type="email" 
                  placeholder="email@kampus.ac.id"
                  value={form.data.email} 
                  onChange={(e) => form.setData('email', e.target.value)} 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    className="w-full rounded-xl border-slate-200 bg-white pl-4 pr-12 py-3 text-sm focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Minimal 8 karakter"
                    value={form.data.password} 
                    onChange={(e) => form.setData('password', e.target.value)} 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-accent focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konfirmasi Password</label>
                <input 
                  className="w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Ulangi password"
                  value={form.data.password_confirmation} 
                  onChange={(e) => form.setData('password_confirmation', e.target.value)} 
                  required
                />
              </div>

              <button 
                className="w-full rounded-xl bg-accent px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-accent/20 hover:bg-blue-600 hover:shadow-lg transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                disabled={form.processing}
              >
                {form.processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Memproses...
                  </>
                ) : (
                  'Buat Akun Sekarang'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-bold text-accent hover:underline">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
