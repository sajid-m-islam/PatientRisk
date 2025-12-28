import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createBrowserRouter, RouterProvider } from 'react-dom';


export default App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
  });

  const { data: {subscription }, } = 
  supabase.auth.onAuthStateChange  (_event, session => { setSession(session);
  });

  return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      // login page
      <>
        <div className='bg-blue-300 min-h-screen w-full'>
          <Auth 
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
            }}
            providers={[]}
          />
        </div>
        
      </>
      
    );
  }
  else {
    return (
      // home page
      <div className='bg-blue-300 min-h-screen w-full'>
          <HealthForm />
      </div>
      
    );
  }
  
}

