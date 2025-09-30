import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: string;
  assignedTo: string;
  created_at: string;
}

const Leads: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'New' as 'New' | 'Contacted' | 'Qualified' | 'Lost',
    assignedTo: 'You',
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async () => {
    if (!user) {
      setError('Você precisa estar logado para adicionar um lead.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: formData.source,
          status: formData.status,
          assignedTo: formData.assignedTo,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setOpenAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        source: '',
        status: 'New',
        assignedTo: 'You',
      });
      fetchLeads();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditLead = async () => {
    if (!selectedLead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: formData.source,
          status: formData.status,
          assignedTo: formData.assignedTo,
        })
        .eq('id', selectedLead.id);

      if (error) throw error;
      setOpenEditModal(false);
      setSelectedLead(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        source: '',
        status: 'New',
        assignedTo: 'You',
      });
      fetchLeads();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', selectedLead.id);

      if (error) throw error;
      setOpenDeleteModal(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setOpenViewModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      assignedTo: lead.assignedTo,
    });
    setOpenEditModal(true);
  };

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setOpenDeleteModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value as 'New' | 'Contacted' | 'Qualified' | 'Lost',
    }));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Leads
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
          sx={{ ml: 2 }}
        >
          Novo Lead
        </Button>
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {leads.map((lead) => (
          <Grid item xs={12} sm={6} md={4} key={lead.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {lead.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lead.email}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {lead.phone}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fonte: {lead.source}
                </Typography>
                <Chip label={lead.status} color="primary" size="small" />
                <Chip label={lead.assignedTo} color="secondary" size="small" sx={{ ml: 1 }} />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => handleViewLead(lead)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(lead)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(lead)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Lead Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Novo Lead</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Telefone"
            value={formData.phone}
            onChange={handleInputChange}
            name="phone"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Fonte"
            value={formData.source}
            onChange={handleInputChange}
            name="source"
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleSelectChange}
              name="status"
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Atribuído a"
            value={formData.assignedTo}
            onChange={handleInputChange}
            name="assignedTo"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Cancelar</Button>
          <Button onClick={handleAddLead} variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lead Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Lead</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Telefone"
            value={formData.phone}
            onChange={handleInputChange}
            name="phone"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Fonte"
            value={formData.source}
            onChange={handleInputChange}
            name="source"
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleSelectChange}
              name="status"
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Atribuído a"
            value={formData.assignedTo}
            onChange={handleInputChange}
            name="assignedTo"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
          <Button onClick={handleEditLead} variant="contained">
            Atualizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
          <Button onClick={handleDeleteLead} variant="contained" color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Lead Modal */}
      <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Lead</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedLead.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedLead.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedLead.phone}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Fonte: {selectedLead.source}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: {selectedLead.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Atribuído a: {selectedLead.assignedTo}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Leads;