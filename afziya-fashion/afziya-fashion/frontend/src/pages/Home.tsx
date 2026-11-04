import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative overflow-hidden bg-gradient-to-b from-plum-deep via-night to-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center md:py-28">
          <Logo size={170} animate />
          <h1 className="mt-10 max-w-2xl font-display text-4xl font-medium leading-tight md:text-6xl">
            Dressed for the occasions you remember.
          </h1>
          <p className="mt-5 max-w-lg text-white/70">
            Men's and women's clothing, chosen with care. Our full collection is on its way.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-gold">Shop men</Link>
            <Link to="/" className="btn-outline">Shop women</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-px bg-gold/20 md:grid-cols-2">
        {[
          ['Men', 'Shirts, trousers and festive wear'],
          ['Women', 'Sarees, kurtis and everyday styles'],
        ].map(([title, text]) => (
          <Link key={title} to="/" className="bg-night p-10 transition hover:bg-plum-deep md:p-16">
            <h2 className="font-display text-3xl text-gold">{title}</h2>
            <p className="mt-2 text-white/60">{text}</p>
          </Link>
        ))}
      </section>

      <footer className="border-t border-gold/20 py-10 text-center text-sm text-white/50">
        © {new Date().getFullYear()} AFZIYA FASHION
      </footer>
    </div>
  );
}
