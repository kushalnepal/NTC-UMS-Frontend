'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

export default function MembersPage() {
    const { user } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({
        username: '', email: '', phone: '', password: '', password_confirm: '', role: 'user', is_staff: false,
    });
    const [hierarchyData, setHierarchyData] = useState({ domains: [], organizations: [], departments: [], wings: [] });
    const [domainInput, setDomainInput] = useState('');
    const [orgInput, setOrgInput] = useState('');
    const [deptInput, setDeptInput] = useState('');
    const [wingInput, setWingInput] = useState('');

    const fetchHierarchyUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getHierarchyMembers();
            setUsers(data.users || []);
            setHierarchyData({
                domains: data.domains || [],
                organizations: data.organizations || [],
                departments: data.departments || [],
                wings: data.wings || [],
            });
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHierarchyUsers(); }, []);

    const createUser = async () => {
        try {
            const userData = { ...newUser };
            if (domainInput) userData.domain = domainInput;
            if (orgInput) userData.organization = orgInput;
            if (deptInput) userData.department = deptInput;
            if (wingInput) userData.wing = wingInput;

            await api.signup(userData);
            setNewUser({ username: '', email: '', phone: '', password: '', password_confirm: '', role: 'user', is_staff: false });
            setDomainInput(''); setOrgInput(''); setDeptInput(''); setWingInput('');
            setShowAddModal(false);
            fetchHierarchyUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const updateUser = async (id, data) => {
        try {
            await api.updateUser(id, data);
            setEditingUser(null);
            fetchHierarchyUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteUser = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            await api.deleteUser(id);
            fetchHierarchyUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const styles = {
        padding: { padding: 28 },
        pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
        title: { fontSize: 20, fontWeight: 700, color: '#e8f0ff' },
        addBtn: { background: '#ffcc00', color: '#080b10', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
        tableWrap: { background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 12, overflow: 'hidden' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { fontSize: 10, color: '#7a9cc6', letterSpacing: 2, textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #1e3a5f', fontWeight: 600 },
        td: { padding: '12px 16px', borderBottom: '1px solid #1a3352', fontSize: 12, color: '#e8f0ff' },
        badge: (color) => ({ fontSize: 9, letterSpacing: 1, padding: '3px 8px', borderRadius: 4, fontWeight: 700, background: `${color}25`, color }),
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modalContent: { background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 12, padding: '28px 32px', width: '100%', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto' },
        label: { fontSize: 10, color: '#7a9cc6', letterSpacing: 2, marginBottom: 6, display: 'block' },
        input: { width: '100%', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e8f0ff', fontSize: 13, padding: '11px 14px', outline: 'none', marginBottom: 16, boxSizing: 'border-box' },
        btnRow: { display: 'flex', gap: 12, marginTop: 24 },
        primaryBtn: { flex: 1, background: '#3b82f6', color: '#080b10', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, padding: '12px 0', cursor: 'pointer' },
        secondaryBtn: { flex: 1, background: 'transparent', color: '#7a9cc6', border: '1px solid #1e3a5f', borderRadius: 8, fontWeight: 600, fontSize: 13, padding: '12px 0', cursor: 'pointer' },
    };

    // Button styles that depend on styles.badge
    const editBtnStyle = { fontSize: 9, letterSpacing: 1, padding: '3px 8px', borderRadius: 4, fontWeight: 700, background: '#3b82f625', color: '#3b82f6', border: 'none', cursor: 'pointer', marginRight: 6 };
    const saveBtnStyle = { fontSize: 9, letterSpacing: 1, padding: '3px 8px', borderRadius: 4, fontWeight: 700, background: '#22c55e25', color: '#22c55e', border: 'none', cursor: 'pointer', marginRight: 6 };
    const cancelBtnStyle = { fontSize: 9, letterSpacing: 1, padding: '3px 8px', borderRadius: 4, fontWeight: 700, background: '#ef444425', color: '#ef4444', border: 'none', cursor: 'pointer' };
    const tableInputStyle = { width: '100%', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 4, color: '#e8f0ff', fontSize: 12, padding: '6px 8px', outline: 'none' };

    const filterAutocomplete = (input, data) => input ? data.filter(item => item.toLowerCase().includes(input.toLowerCase())) : [];
    const renderAutocomplete = (label, input, setInput, data, field, icon) => (
        <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={styles.label}>{icon} {label}</label>
            <input style={styles.input} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Type or select ${label}`} />
            {filterAutocomplete(input, data).length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: 150, overflowY: 'auto', background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 8, zIndex: 10 }}>
                    {filterAutocomplete(input, data).map((item, idx) => (
                        <div key={idx} style={{ padding: '10px 14px', cursor: 'pointer', color: '#e8f0ff', borderBottom: '1px solid #1a3352' }} onClick={() => { setInput(item); setInput(item); }}>
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (loading) return <div style={styles.padding}>Loading...</div>;

    return (
        <div style={styles.padding}>
            <div style={styles.pageHeader}>
                <h2 style={styles.title}>Hierarchy Members</h2>
                {isAdmin && <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>+ Add User</button>}
            </div>

            {showAddModal && (
                <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e8f0ff', marginBottom: 24 }}>Add New User</h3>
                        {['username', 'email', 'phone'].map(field => (
                            <input key={field} style={styles.input} placeholder={field} value={newUser[field]} onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })} />
                        ))}
                        <input style={styles.input} type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                        <input style={styles.input} type="password" placeholder="Confirm Password" value={newUser.password_confirm} onChange={(e) => setNewUser({ ...newUser, password_confirm: e.target.value })} />
                        {renderAutocomplete('Domain', domainInput, setDomainInput, hierarchyData.domains, 'domain', '⬡')}
                        {renderAutocomplete('Organization', orgInput, setOrgInput, hierarchyData.organizations, 'organization', '⌥')}
                        {renderAutocomplete('Department', deptInput, setDeptInput, hierarchyData.departments, 'department', '◈')}
                        {renderAutocomplete('Wing', wingInput, setWingInput, hierarchyData.wings, 'wing', '⚿')}
                        <select style={styles.input} value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <input type="checkbox" checked={newUser.is_staff} onChange={(e) => setNewUser({ ...newUser, is_staff: e.target.checked })} />
                            <label style={{ color: '#e8f0ff', fontSize: 12 }}>Staff User</label>
                        </div>
                        <div style={styles.btnRow}>
                            <button style={styles.secondaryBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button style={styles.primaryBtn} onClick={createUser}>Add User</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={styles.tableWrap}>
                <table style={styles.table}>
                    <thead><tr style={{ background: '#1a3352' }}>
                        <th style={styles.th}>Username</th><th style={styles.th}>Email</th><th style={styles.th}>Phone</th><th style={styles.th}>Role</th><th style={styles.th}>Is Staff</th>
                        {isAdmin && <th style={styles.th}>Actions</th>}
                    </tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #1a3352' }}>
                                <td style={styles.td}>
                                    {editingUser?.id === u.id ? (
                                        <input style={tableInputStyle} value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} />
                                    ) : (
                                        <span style={{ fontWeight: 500 }}>{u.username}</span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    {editingUser?.id === u.id ? (
                                        <input style={tableInputStyle} value={editingUser.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                                    ) : (
                                        <span style={{ color: '#7a9cc6' }}>{u.email || '-'}</span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    {editingUser?.id === u.id ? (
                                        <input style={tableInputStyle} value={editingUser.phone || ''} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} />
                                    ) : (
                                        <span style={{ color: '#7a9cc6' }}>{u.phone || '-'}</span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    {editingUser?.id === u.id ? (
                                        <select style={tableInputStyle} value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                                            <option value="User">User</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span style={styles.badge(u.role === 'Admin' ? '#eab308' : '#3b82f6')}>{u.role}</span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    {editingUser?.id === u.id ? (
                                        <input type="checkbox" checked={editingUser.is_staff || false} onChange={(e) => setEditingUser({ ...editingUser, is_staff: e.target.checked })} />
                                    ) : (
                                        <span style={styles.badge(u.is_staff ? '#3b82f6' : '#7a9cc6')}>{u.is_staff ? 'Yes' : 'No'}</span>
                                    )}
                                </td>
                                {isAdmin && (
                                    <td style={styles.td}>
                                        {editingUser?.id === u.id ? (
                                            <>
                                                <button style={saveBtnStyle} onClick={() => updateUser(u.id, editingUser)}>Save</button>
                                                <button style={cancelBtnStyle} onClick={() => setEditingUser(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button style={editBtnStyle} onClick={() => setEditingUser({ ...u, is_staff: u.is_staff ?? false })}>Edit</button>
                                                <button style={{ ...styles.badge('#ef4444'), border: 'none', cursor: 'pointer' }} onClick={() => deleteUser(u.id)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
