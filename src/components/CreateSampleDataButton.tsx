import React, { useState } from 'react';
import { Database, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const CreateSampleDataButton: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const createSampleData = async () => {
    setIsCreating(true);
    setStatus('idle');
    setMessage('');

    try {
      console.log('🚀 Iniciando criação de dados de exemplo...');
      
      // 1. Criar um cliente de exemplo
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([
          {
            name: 'João Silva',
            email: 'joao.silva@email.com',
            phone: '(11) 99999-9999',
            lastContact: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (clientError) {
        console.error('❌ Erro ao criar cliente:', clientError);
        setStatus('error');
        setMessage('Erro ao criar cliente: ' + clientError.message);
        return;
      }

      console.log('✅ Cliente criado:', clientData);

      // 2. Buscar uma propriedade existente
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('*')
        .limit(1);

      if (propError || !properties || properties.length === 0) {
        console.error('❌ Erro ao buscar propriedades ou nenhuma propriedade encontrada:', propError);
        setStatus('error');
        setMessage('Nenhuma propriedade encontrada. Crie uma propriedade primeiro.');
        return;
      }

      const property = properties[0];
      console.log('✅ Propriedade encontrada:', property);

      // 3. Criar uma ordem de compra vinculando cliente e propriedade
      const { data: orderData, error: orderError } = await supabase
        .from('purchase_orders')
        .insert([
          {
            client_id: clientData.id,
            property_id: property.id,
            status: 'Pendente'
          }
        ])
        .select();

      if (orderError) {
        console.error('❌ Erro ao criar ordem de compra:', orderError);
        setStatus('error');
        setMessage('Erro ao criar ordem de compra: ' + orderError.message);
        return;
      }

      console.log('✅ Ordem de compra criada:', orderData);
      console.log('🎉 Dados de exemplo criados com sucesso!');
      
      setStatus('success');
      setMessage(`Cliente "${clientData.name}" vinculado à propriedade "${property.address || property.name}"`);
      
      // Recarregar a página após 3 segundos para ver os dados
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('❌ Erro geral:', error);
      setStatus('error');
      setMessage('Erro inesperado: ' + (error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-brand-secondary p-4 rounded-xl border border-brand-accent/20 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Database className="w-5 h-5 text-brand-cta mr-2" />
          <h3 className="text-lg font-semibold text-brand-primary">Dados de Exemplo</h3>
        </div>
        <button
          onClick={createSampleData}
          disabled={isCreating}
          className="flex items-center bg-brand-cta hover:bg-brand-cta/80 disabled:bg-brand-cta/50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Criando...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Criar Dados
            </>
          )}
        </button>
      </div>
      
      <p className="text-brand-light text-sm mb-3">
        Crie um cliente de exemplo vinculado a uma propriedade para testar a funcionalidade.
      </p>

      {status !== 'idle' && (
        <div className={`flex items-center p-3 rounded-lg ${
          status === 'success' 
            ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
            : 'bg-red-500/20 text-red-300 border border-red-500/50'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <span className="text-sm">{message}</span>
        </div>
      )}
    </div>
  );
};

export default CreateSampleDataButton;