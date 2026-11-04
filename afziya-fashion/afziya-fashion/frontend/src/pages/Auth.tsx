import { useState } from 'react';
import { useAuth } from '@appwrite.io/react';
import Header from '../components/Header';
import Logo from '../components/Logo';

export default function Auth() {
  const { user, isLoading, signIn, signUp, signOut, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-plum-deep to-ink">
      <Header />
      <main className="mx-auto flex max-w-md flex-col items-center px-5 py-14">
        <Logo size={80} />
        {isLoading ? (
          <p className="mt-10 text-white/70">Loading...</p>
        ) : user ? (
          <div className="mt-10 w-full text-center">
            <p className="font-display text-3xl">Welcome, {user.name || user.email}</p>
            <button className="btn-outline mt-8" onClick={() => signOut.signOut()}>Sign out</button>
          </div>
        ) : (
          <div className="mt-10 w-full space-y-4">
            <input className="field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="field" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="field" placeholder="Password (8+ characters)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex gap-3 pt-2">
              <button className="btn-gold flex-1" onClick={() => signUp.emailPassword({ email, password, name })}>Sign up</button>
              <button className="btn-outline flex-1" onClick={() => signIn.emailPassword({ email, password })}>Sign in</button>
            </div>
            {error && <p role="alert" className="text-sm text-red-300">{error.message}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
