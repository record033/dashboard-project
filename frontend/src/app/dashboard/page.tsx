'use client';

import { useEffect, useState } from 'react';
import { $api } from '@/lib/axios';
import { AuthUser, AuthService } from '@/services/auth.service';

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

useEffect(() => {
     const loadMe = async () => {
       try {
         const data = await AuthService.me();
         setUser(data);
       } catch (e) {
         console.error(e);
       }
     };
     loadMe();
   }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 mb-2">Auth success</p>  
        
        {user ? (
          <div className="mt-4 border-t pt-4">
            <p><strong>ID:</strong> {user.sub}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span className="uppercase badge bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{user.role}</span></p>
          </div>
        ) : (
          <p className="mt-4 text-gray-400">Loading..</p>
        )}
      </div>
    </div>
  );
}