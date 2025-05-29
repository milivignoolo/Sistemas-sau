import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BackButton from './BackButton';

export default function Layout({ children, showBackButton = false }) {
  return (
    <>
      <Header />
      <main style={{ padding: '1rem 2rem' }}>
        {showBackButton && <BackButton />}
        {children}
      </main>
      <Footer />
    </>
  );
}
