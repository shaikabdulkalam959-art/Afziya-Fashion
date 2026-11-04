import { Link } from 'react-router-dom';
import { useAuth } from '@appwrite.io/react';
import { User } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-gold/20 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" aria-label="Home"><Logo size={44} showText={false} /></Link>
        <nav className="hidden gap-8 text-sm md:flex">
          <Link className="hover:text-gold" to="/">Men</Link>
          <Link className="hover:text-gold" to="/">Women</Link>
          <Link className="hover:text-gold" to="/">New arrivals</Link>
          <Link className="hover:text-gold" to="/">Offers</Link>
        </nav>
        <Link to="/auth" className="flex items-center gap-2 text-sm hover:text-gold">
          <User size={18} /> {user ? user.name || 'Account' : 'Sign in'}
        </Link>
      </div>
    </header>
  );
}
