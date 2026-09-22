'use client';
import { useState, useEffect } from 'react';

export default function PortalDeLuna() {
  const [view, setView] = useState('login'); // login, adminAuth, register, management, modules
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  
  // Estados do Admin / Cadastro
  const [admUserCheck, setAdmUserCheck] = useState('');
  const [admPassCheck, setAdmPassCheck] = useState('');
  const [admAuthError, setAdmAuthError] = useState(false);

  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('restrito');
  const [regPerms, setRegPerms] = useState(['frota', 'custos', 'cadastro', 'captacao', 'betafleet']);
  const [regErrorMsg, setRegErrorMsg] = useState('');
  const [editOriginal, setEditOriginal] = useState('');
  const [usersList, setUsersList] = useState([]);

  const ALL_MODULES = [
    { id: 'frota', title: 'Controle de Frota', icon: '🚛', url: 'portal_frota.html' },
    { id: 'custos', title: 'Gestão de Custos', icon: '💰', url: 'painel_frota.html' },
    { id: 'cadastro', title: 'Tela de Cadastro', icon: '📝', action: () => alert('Módulo de Cadastro em desenvolvimento.') },
    { id: 'captacao', title: 'Captação', icon: '🎯', action: () => alert('Módulo de Captação em desenvolvimento.') },
    { id: 'betafleet', title: 'Betafleet', icon: '🚀', url: 'https://data-fleet.vercel.app/login', external: true }
  ];

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      setLoggedUser(data.user);
      setView('modules');
      setErrorMsg(false);
    } else {
      setErrorMsg(true);
    }
  }

  async function handleAdminAuth(e) {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: admUserCheck, password: admPassCheck })
    });
    const data = await res.json();
    if (res.ok && data.user.role === 'admin') {
      setAdmAuthError(false);
      loadUsers();
      setView('management');
    } else {
      setAdmAuthError(true);
    }
  }

  async function loadUsers() {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (res.ok) setUsersList(data);
  }

  async function handleSaveUser(e) {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: regUsername,
        password: regPassword,
        role: regRole,
        perms: regRole === 'admin' ? ['frota', 'custos', 'cadastro', 'captacao', 'betafleet'] : regPerms
      })
    });
    if (res.ok) {
      loadUsers();
      setView('management');
    } else {
      setRegErrorMsg('Erro ao salvar usuário.');
    }
  }

  async function deleteUser(u) {
    if (confirm(`Deseja excluir o usuário ${u}?`)) {
      await fetch(`/api/users?username=${u}`, { method: 'DELETE' });
      loadUsers();
    }
  }

  return (
    <div style={{ background: '#F4F6F8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Barlow', sans-serif" }}>
      <div style={{ background: '#ffffff', width: '100%', maxWidth: '560px', borderRadius: '12px', boxShadow: '0 12px 32px rgba(1, 54, 46, 0.15)', padding: '36px' }}>
        
        {/* TELA 1: LOGIN */}
        {view === 'login' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h1 style={{ color: '#01362E', fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Portal DeLuna</h1>
              <p style={{ color: '#55645D', fontSize: '14px' }}>Acesso Restrito · Controle Operacional</p>
            </div>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#142822', marginBottom: '5px' }}>Usuário</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCE6E2', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#142822', marginBottom: '5px' }}>Senha</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCE6E2', borderRadius: '6px', fontSize: '14px', outline: 'none' }} required />
              </div>
              <button type="submit" style={{ width: '100%', background: '#01362E', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14.5px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>Entrar no Portal</button>
              {errorMsg && <div style={{ color: '#B5443A', fontSize: '13px', fontWeight: '600', textAlign: 'center', marginTop: '10px' }}>Usuário ou senha incorretos.</div>}
              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <button type="button" onClick={() => setView('adminAuth')} style={{ background: 'none', border: 'none', color: '#0E6B57', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>Cadastrar novo usuário / Gerenciar Usuários</button>
              </div>
            </form>
          </div>
        )}

        {/* TELA 2: AUTENTICAÇÃO ADM */}
        {view === 'adminAuth' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h1 style={{ color: '#01362E', fontSize: '24px', fontWeight: '700' }}>Área Restrita do ADM</h1>
              <p style={{ color: '#55645D', fontSize: '14px' }}>Insira credenciais de Administrador:</p>
            </div>
            <form onSubmit={handleAdminAuth}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Usuário ADM</label>
                <input type="text" value={admUserCheck} onChange={e => setAdmUserCheck(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCE6E2', borderRadius: '6px' }} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Senha ADM</label>
                <input type="password" value={admPassCheck} onChange={e => setAdmPassCheck(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCE6E2', borderRadius: '6px' }} required />
              </div>
              <button type="submit" style={{ width: '100%', background: '#0E6B57', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Validar ADM</button>
              <button type="button" onClick={() => setView('login')} style={{ background: 'transparent', border: 'none', color: '#55645D', fontSize: '13px', cursor: 'pointer', width: '100%', marginTop: '12px', textDecoration: 'underline' }}>Cancelar</button>
              {admAuthError && <div style={{ color: '#B5443A', fontSize: '12px', fontWeight: '600', textAlign: 'center', marginTop: '8px' }}>Acesso negado.</div>}
            </form>
          </div>
        )}

        {/* TELA 3: GERENCIAR USUÁRIOS */}
        {view === 'management' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <h1 style={{ color: '#01362E', fontSize: '24px', fontWeight: '700' }}>Gerenciar Usuários</h1>
              <p style={{ color: '#55645D', fontSize: '14px' }}>Usuários salvos no banco Neon:</p>
            </div>
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ background: '#EEF3F1', color: '#55645D' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Usuário</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Perfil</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #DCE6E2' }}>
                      <td style={{ padding: '8px' }}><strong>{u.username}</strong></td>
                      <td style={{ padding: '8px' }}>{u.role === 'admin' ? 'Administrador' : 'Restrito'}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>
                        <button onClick={() => deleteUser(u.username)} style={{ background: '#B5443A', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => { setRegUsername(''); setRegPassword(''); setView('register'); }} style={{ width: '100%', background: '#01362E', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '700', marginTop: '16px', cursor: 'pointer' }}>+ Cadastrar Novo Usuário</button>
            <button onClick={() => setView('login')} style={{ background: 'transparent', border: 'none', color: '#55645D', fontSize: '13px', cursor: 'pointer', width: '100%', marginTop: '12px', textDecoration: 'underline' }}>Voltar ao Início</button>
          </div>
        )}

        {/* TELA 4: CADASTRAR USUÁRIO */}
        {view === 'register' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <h1 style={{ color: '#01362E', fontSize: '24px', fontWeight: '700' }}>Cadastrar Usuário</h1>
            </div>
            <form onSubmit={handleSaveUser}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Login</label>
                <input type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCE6E2', borderRadius: '6px' }} required />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Senha</label>
                <input type="text" value={regPassword} onChange={e => setRegPassword(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCE6E2', borderRadius: '6px' }} required />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Perfil</label>
                <select value={regRole} onChange={e => setRegRole(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCE6E2', borderRadius: '6px' }}>
                  <option value="restrito">Usuário Restrito</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%', background: '#128064', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>Salvar no Banco</button>
              <button type="button" onClick={() => setView('management')} style={{ background: '#78827D', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '700', width: '100%', marginTop: '8px', cursor: 'pointer' }}>Voltar à Lista</button>
            </form>
          </div>
        )}

        {/* TELA 5: MÓDULOS */}
        {view === 'modules' && loggedUser && (
          <div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ color: '#01362E', fontSize: '24px', fontWeight: '700' }}>Bem-vindo, {loggedUser.username}!</h1>
              <p style={{ color: '#55645D', fontSize: '14px', marginBottom: '20px' }}>Selecione o módulo autorizado:</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {ALL_MODULES.map(mod => {
                if (loggedUser.role === 'admin' || loggedUser.perms?.includes(mod.id)) {
                  return (
                    <a key={mod.id} href={mod.url || '#'} onClick={mod.action} target={mod.external ? '_blank' : '_self'} style={{ background: '#EEF3F1', border: '1px solid #DCE6E2', borderRadius: '8px', padding: '16px 10px', textAlign: 'center', textDecoration: 'none', color: '#142822', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '24px', marginBottom: '8px' }}>{mod.icon}</span>
                      <span style={{ fontWeight: '700', fontSize: '12px' }}>{mod.title}</span>
                    </a>
                  );
                }
                return null;
              })}
            </div>
            <button onClick={() => setView('login')} style={{ background: 'transparent', border: 'none', color: '#55645D', fontSize: '13px', cursor: 'pointer', width: '100%', marginTop: '20px', textDecoration: 'underline' }}>Encerrar Sessão</button>
          </div>
        )}

      </div>
    </div>
  );
}