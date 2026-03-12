'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        username: '', email: '', phone: '', password: '', password_confirm: '', domain: null, organization: null, department: null, wing: null, role_name: 'User',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const [domainInput, setDomainInput] = useState('');
    const [orgInput, setOrgInput] = useState('');
    const [deptInput, setDeptInput] = useState('');
    const [wingInput, setWingInput] = useState('');
    const [domains, setDomains] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [wings, setWings] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [d, o, dep, w] = await Promise.all([api.getDomains(), api.getOrganizations(), api.getDepartments(), api.getWings()]);
                setDomains(d); setOrganizations(o); setDepartments(dep); setWings(w);
            } catch (err) { console.error('Error fetching hierarchy:', err); }
        };
        fetchAll();
    }, []);

    const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

    const handleCreateIfNotExist = async (type, name) => {
        try {
            const endpoints = { domain: '/domains/', organization: '/organizations/', department: '/departments/', wing: '/wings/' };
            const res = await api.request(endpoints[type], { method: 'POST', body: JSON.stringify({ name }) });
            return res.id;
        } catch (err) { return null; }
    };

    const handleSignup = async () => {
        if (!formData.username && !formData.email && !formData.phone) { setError('At least one identifier is required'); return; }
        if (!formData.password) { setError('Password is required'); return; }
        if (formData.password !== formData.password_confirm) { setError('Passwords do not match'); return; }
        setError(''); setLoading(true);

        try {
            const domainId = formData.domain || (domainInput ? await handleCreateIfNotExist('domain', domainInput) : null);
            const orgId = formData.organization || (orgInput ? await handleCreateIfNotExist('organization', orgInput) : null);
            const deptId = formData.department || (deptInput ? await handleCreateIfNotExist('department', deptInput) : null);
            const wingId = formData.wing || (wingInput ? await handleCreateIfNotExist('wing', wingInput) : null);

            const payload = {
                username: formData.username || undefined, email: formData.email || undefined, phone: formData.phone || undefined,
                password: formData.password, domain: domainId || undefined, organization: orgId || undefined,
                department: deptId || undefined, wing: wingId || undefined, role_name: formData.role_name,
            };

            const response = await api.signup(payload);
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            setSuccess(true);

            setTimeout(() => {
                login({ id: response.user.id, username: response.user.username, email: response.user.email, role: formData.role_name, domains: [] });
                router.push('/dashboard');
            }, 1500);
        } catch (err) { setError(err.message || 'Signup failed'); setLoading(false); }
    };

    const autocompleteInput = (input, data) => input ? data.filter(item => item.name.toLowerCase().includes(input.toLowerCase())) : [];
    const renderAutocompleteInput = (label, input, setInput, data, field) => (
        <div style={{ marginBottom: 16, position: 'relative' }}>
            <div style={{ fontSize: 10, color: '#7a9cc6', letterSpacing: 2, marginBottom: 6 }}>{label}</div>
            <input style={{ width: '100%', background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e8f0ff', fontSize: 13, padding: '11px 14px', outline: 'none' }}
                value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Type or select ${label}`} />
            {autocompleteInput(input, data).length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: 150, overflowY: 'auto', background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 8, zIndex: 10 }}>
                    {autocompleteInput(input, data).map((item) => (
                        <div key={item.id} style={{ padding: '10px 14px', cursor: 'pointer', color: '#e8f0ff', borderBottom: '1px solid #1a3352' }}
                            onClick={() => { handleInputChange(field, item.id); setInput(item.name); }}>
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const styles = {
        wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: "url('https://wallpaperbat.com/img/165356343-telecom-background-vector-art-icon.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', padding: 24 },
        card: { width: '100%', maxWidth: 500, background: '#0d1f3c', border: '1px solid #1e3a5f', borderRadius: 16, padding: '40px 36px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' },
        logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 },
        logoText: { fontSize: 14, fontWeight: 700, letterSpacing: 1, color: '#e8f0ff' },
        logoSub: { fontSize: 10, color: '#7a9cc6', letterSpacing: 2 },
        title: { fontSize: 22, fontWeight: 700, marginBottom: 6, letterSpacing: -0.5 },
        sub: { fontSize: 11, color: '#7a9cc6', marginBottom: 28, letterSpacing: 1 },
        input: { width: '100%', background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 8, color: '#e8f0ff', fontSize: 13, padding: '11px 14px', outline: 'none', marginBottom: 8 },
        btn: { width: '100%', background: '#3b82f6', color: '#080b10', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, padding: '12px 0', cursor: 'pointer', letterSpacing: 1, marginTop: 4 },
        error: { color: '#ef4444', fontSize: 11, marginBottom: 10, letterSpacing: 1 },
        label: { fontSize: 10, color: '#7a9cc6', letterSpacing: 2, marginBottom: 6, display: 'block' },
    };

    return (
        <div style={styles.wrap}>
            <div style={styles.card}>
                <div style={styles.logo}>
                    <div style={{ width: 36, height: 36, background: 'rgba(59,130,246,0.12)', border: '1px solid #3b82f6', borderRadius: 8 }} />
                    <div><div style={styles.logoText}>UMS SIGNUP</div><div style={styles.logoSub}>CREATE ACCOUNT</div></div>
                </div>

                <div style={styles.title}>Sign up</div>
                <div style={styles.sub}>CREATE YOUR ACCOUNT</div>

                <div style={{ marginBottom: 20 }}>
                    {['username', 'email', 'phone'].map((field) => (
                        <input key={field} style={styles.input} type={field === 'email' ? 'email' : 'text'} placeholder={field === 'phone' ? '+9779800000000' : field}
                            value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} />
                    ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                    {['password', 'password_confirm'].map((field) => (
                        <input key={field} style={styles.input} type="password" placeholder={field === 'password_confirm' ? 'confirm password' : '••••••••'}
                            value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} />
                    ))}
                </div>

                {renderAutocompleteInput('Domain', domainInput, setDomainInput, domains, 'domain')}
                {renderAutocompleteInput('Organization', orgInput, setOrgInput, organizations, 'organization')}
                {renderAutocompleteInput('Department', deptInput, setDeptInput, departments, 'department')}
                {renderAutocompleteInput('Wing', wingInput, setWingInput, wings, 'wing')}

                <select style={styles.input} value={formData.role_name} onChange={(e) => handleInputChange('role_name', e.target.value)}>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                </select>

                {error && <div style={styles.error}>⚠ {error}</div>}

                <button style={styles.btn} onClick={handleSignup}>{loading ? 'CREATING ACCOUNT...' : '→ CREATE ACCOUNT'}</button>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#7a9cc6', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => router.push('/login')}>
                        Already have an account? Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}
