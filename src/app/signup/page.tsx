"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified login page with signup mode query parameter
    router.replace('/login?mode=signup');
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h3>Loading registration portal...</h3>
    </div>
  );
}
