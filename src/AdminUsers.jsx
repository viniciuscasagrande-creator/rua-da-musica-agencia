import React, { useState, useEffect } from 'react';
export function AdminUsers({ token, agencies }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agency', agencyId: '' });
  const [message, setMessage] = useState('');
  const reload = async () => {
    const r = await fetch('/api/auth', {method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({action:'list_users'})});
    if (r.ok) setUsers((await r.json()).users);
  };
  useEffect(() => { reload(); }, [token]);
  const create = async e => {
    e.preventDefault(); setMessage('');
    try {
      const r = await fetch('/api/auth', {method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({action:'create_user', ...form})});
      const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Erro ao cadastrar');
      setMessage('Usuário cadastrado com sucesso'); setForm({...form, name:'', email:'', password:''}); await reload();
    } catch (e) {setMessage(e.message);}
  };
  return <div className="p-6 max-w-5xl mx-auto w-full space-y-5">
    <h1 className="text-2xl font-bold">Administração de usuários</h1>
    <p className="text-slate-600 text-sm">Uma agência pode ter diversos usuários. Cada conta de agência enxerga apenas os dados da agência vinculada.</p>
    <form onSubmit={create} className="bg-white rounded-xl p-5 border grid sm:grid-cols-2 gap-4">
      <label>Nome<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border p-2 rounded" /></label>
      <label>E-mail<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border p-2 rounded" /></label>
      <label>Senha inicial (mín. 12 caracteres)<input required minLength={12} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border p-2 rounded" /></label>
      <label>Perfil<select value={form.role} onChange={e=>setForm({...form,role:e.target.value,agencyId:''})} className="w-full border p-2 rounded">{['agency','operator','producer','admin'].map(r=><option key={r} value={r}>{({agency:'Agência',operator:'Operador',producer:'Produtor',admin:'Administrador'})[r]}</option>)}</select></label>
      {form.role==='agency' && <label className="sm:col-span-2">Agência vinculada<select required value={form.agencyId} onChange={e=>setForm({...form,agencyId:e.target.value})} className="w-full border p-2 rounded"><option value="">Selecione uma agência</option>{agencies.map(a=><option value={a.id} key={a.id}>{a.name} ({a.id})</option>)}</select></label>}
      <button className="bg-blue-700 text-white font-semibold py-2 px-5 rounded">Cadastrar usuário</button><span role="status" className="text-sm self-center">{message}</span>
    </form>
    <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-slate-50"><th className="p-3 text-left">Usuário</th><th className="p-3 text-left">Perfil</th><th className="p-3 text-left">Agência</th><th className="p-3">Ativo</th></tr></thead><tbody>{users.map(u=><tr key={u.id} className="border-b"><td className="p-3">{u.name}<div className="text-slate-500">{u.email}</div></td><td className="p-3">{u.role}</td><td className="p-3">{agencies.find(a=>a.id===u.agencyId)?.name || u.agencyId || '—'}</td><td className="p-3 text-center">{u.active ? 'Sim' : 'Não'}</td></tr>)}</tbody></table></div>
  </div>;
}
