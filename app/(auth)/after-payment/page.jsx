'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AfterPaymentPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAfterPayment = async () => {
      try {
        const res = await fetch(
          'https://roleplay-trainer-api.vercel.app/api/v1/auth/after-payment',
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!res.ok) {
          throw new Error('Payment not verified');
        }

        const { token, user } = await res.json();

        if (!token || !user) {
          throw new Error('Invalid response');
        }

        // ✅ تحديث أو إضافة Token و User بدون مسح القديم أولًا
        Cookies.set('token', token, { 
          expires: 7, 
          sameSite: 'lax', 
          secure: true, 
          path: '/' 
        });
        Cookies.set('user', JSON.stringify(user), { 
          expires: 7, 
          sameSite: 'lax', 
          path: '/' 
        });

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        router.replace('/'); // تحويل بعد التحديث
      } catch (error) {
        console.error('After payment error:', error);
        router.replace('/login');
      }
    };

    handleAfterPayment();
  }, [router]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
      }}
    >
      Verifying payment, please wait...
    </div>
  );
}
