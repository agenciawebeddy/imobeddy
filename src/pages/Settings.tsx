import React, { useState } from 'react';
import { Bell, Lock, Palette, Eye, EyeOff, CheckCircle, AlertCircle, User } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useTheme } from '../contexts/ThemeContext';

const SettingsCard: React.FC<{ title: string; description: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, description, icon, children }) => (
  <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg">
    <div className="flex items-start mb-4">
      <div className="bg-brand-secondary p-3 rounded-lg mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-brand-primary">{title}</h3>
        <p className="text-brand-light">{description}</p>
      </div>
    </div>
    <div className="mt-6">
      {children}
    </div>
  </div>
);

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Todos os campos são obrigatórios.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'A nova senha e a confirmação não coincidem.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    setIsUpdating(true);
    setMessage(null);

    try {
      // Atualizar senha no Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
      
      // Limpar campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao atualizar senha. Tente novamente.' 
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brand-primary">Configurações</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <SettingsCard
          title="Perfil"
          description="Atualize suas informações pessoais."
          icon={<User className="w-6 h-6 text-brand-cta" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-light mb-2">Nome</label>
              <input type="text" defaultValue="Eddy Silvério" className="w-full bg-brand-secondary border border-brand-accent/50 text-brand-lighter rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-cta" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-light mb-2">E-mail</label>
              <input type="email" defaultValue="eddy.silverio@imobeddy.com" className="w-full bg-brand-secondary border border-brand-accent/50 text-brand-lighter rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-cta" />
            </div>
            <button className="bg-brand-cta text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors">Salvar Alterações</button>
          </div>
        </SettingsCard>

        {/* Notification Settings */}
        <SettingsCard
          title="Notificações"
          description="Gerencie como você recebe notificações."
          icon={<Bell className="w-6 h-6 text-green-400" />}
        >
          <div className="space-y-4 text-brand-primary">
            <div className="flex items-center justify-between">
              <span>Alertas de Novo Lead</span>
              <label className="switch">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-brand-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cta"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>Alertas de Negócio Fechado</span>
               <label className="switch">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-brand-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cta"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>E-mail de Resumo Semanal</span>
               <label className="switch">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-brand-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cta"></div>
              </label>
            </div>
          </div>
        </SettingsCard>
        
        {/* Security Settings */}
        <SettingsCard
          title="Segurança"
          description="Altere sua senha e gerencie as configurações de segurança."
          icon={<Lock className="w-6 h-6 text-amber-400" />}
        >
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {/* Mensagem de feedback */}
            {message && (
              <div className={`flex items-center p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Senha Atual */}
            <div>
              <label className="block text-sm font-medium text-brand-light mb-2">Senha Atual</label>
              <div className="relative">
                <input 
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full bg-brand-secondary border border-brand-accent/50 text-brand-lighter rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-cta"
                  disabled={isUpdating}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-light hover:text-brand-primary"
                  disabled={isUpdating}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div>
              <label className="block text-sm font-medium text-brand-light mb-2">Nova Senha</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha (mín. 6 caracteres)"
                  className="w-full bg-brand-secondary border border-brand-accent/50 text-brand-lighter rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-cta"
                  disabled={isUpdating}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-light hover:text-brand-primary"
                  disabled={isUpdating}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="block text-sm font-medium text-brand-light mb-2">Confirmar Nova Senha</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  className="w-full bg-brand-secondary border border-brand-accent/50 text-brand-lighter rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-cta"
                  disabled={isUpdating}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-light hover:text-brand-primary"
                  disabled={isUpdating}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUpdating}
              className="bg-brand-cta text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Atualizando...
                </>
              ) : (
                'Atualizar Senha'
              )}
            </button>
          </form>
        </SettingsCard>

        {/* Appearance Settings */}
        <SettingsCard
          title="Aparência"
          description="Personalize a aparência da aplicação."
          icon={<Palette className="w-6 h-6 text-indigo-400" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-light mb-2">Tema</label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="w-full bg-brand-secondary border border-brand-accent/50 text-brand-lighter rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-cta"
              >
                <option value="dark">Escuro</option>
                <option value="light">Claro</option>
              </select>
              <p className="text-sm text-brand-light mt-2">
                {theme === 'light' 
                  ? 'Tema claro otimizado para melhor visualização durante o dia'
                  : 'Tema escuro padrão, ideal para uso prolongado'
                }
              </p>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default Settings;