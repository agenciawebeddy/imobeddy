import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';
import { Building2 } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-brand-secondary rounded-2xl shadow-lg border border-brand-accent/20">
        <div className="flex flex-col items-center">
          <Building2 className="w-12 h-12 text-brand-cta" />
          <h1 className="text-4xl font-bold text-brand-primary mt-4">ImobEddy</h1>
          <p className="text-brand-light mt-2">Faça login para acessar seu CRM</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...'
              },
              sign_up: {
                email_label: 'Endereço de e-mail',
                password_label: 'Senha',
                button_label: 'Cadastrar',
                loading_button_label: 'Cadastrando...'
              },
              forgotten_password: {
                link_text: 'Esqueceu sua senha?',
                email_label: 'Endereço de e-mail',
                button_label: 'Enviar instruções de recuperação',
                loading_button_label: 'Enviando...'
              }
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;