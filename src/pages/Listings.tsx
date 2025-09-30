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

interface Property {
  id: string;
  name?: string;
  address: string;
  price: number;
  status: 'À Venda' | 'Pendente' | 'Vendido';
  beds: number;
  baths: number;
  sqft: number;
  image_url?: string;
  created_at: string;
}

const Listings: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    status: 'À Venda' as 'À Venda' | 'Pendente' | 'Vendido',
    image_url: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async () => {
    if (!user) {
      setError('Você precisa estar logado para adicionar um imóvel.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          name: formData.name,
          address: formData.address,
          price: Number(formData.price),
          beds: Number(formData.beds),
          baths: Number(formData.baths),
          sqft: Number(formData.sqft),
          status: formData.status,
          image_url: formData.image_url,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setOpenAddModal(false);
      setFormData({
        name: '',
        address: '',
        price: '',
        beds: '',
        baths: '',
        sqft: '',
        status: 'À Venda',
        image_url: '',
      });
      fetchProperties();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditProperty = async () => {
    if (!selectedProperty) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          name: formData.name,
          address: formData.address,
          price: Number(formData.price),
          beds: Number(formData.beds),
          baths: Number(formData.baths),
          sqft: Number(formData.sqft),
          status: formData.status,
          image_url: formData.image_url,
        })
        .eq('id', selectedProperty.id);

      if (error) throw error;
      setOpenEditModal(false);
      setSelectedProperty(null);
      setFormData({
        name: '',
        address: '',
        price: '',
        beds: '',
        baths: '',
        sqft: '',
        status: 'À Venda',
        image_url: '',
      });
      fetchProperties();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedProperty.id);

      if (error) throw error;
      setOpenDeleteModal(false);
      setSelectedProperty(null);
      fetchProperties();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setOpenViewModal(true);
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      name: property.name || '',
      address: property.address,
      price: property.price.toString(),
      beds: property.beds.toString(),
      baths: property.baths.toString(),
      sqft: property.sqft.toString(),
      status: property.status,
      image_url: property.image_url || '',
    });
    setOpenEditModal(true);
  };

  const handleDelete = (property: Property) => {
    setSelectedProperty(property);
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
      status: e.target.value as 'À Venda' | 'Pendente' | 'Vendido',
    }));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Listagem de Imóveis
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
          sx={{ ml: 2 }}
        >
          Novo Imóvel
        </Button>
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {property.name || property.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.address}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {property.beds} quartos | {property.baths} banheiros | {property.sqft}m²
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  R$ {property.price.toLocaleString('pt-BR')}
                </Typography>
                <Chip label={property.status} color="primary" size="small" />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => handleViewProperty(property)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(property)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(property)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Property Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Novo Imóvel</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Imóvel"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Endereço"
            value={formData.address}
            onChange={handleInputChange}
            name="address"
            sx={{ mt: 2 }}
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Preço"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                name="price"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quartos"
                type="number"
                value={formData.beds}
                onChange={handleInputChange}
                name="beds"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Banheiros"
                type="number"
                value={formData.baths}
                onChange={handleInputChange}
                name="baths"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Área (m²)"
                type="number"
                value={formData.sqft}
                onChange={handleInputChange}
                name="sqft"
              />
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleSelectChange}
              name="status"
            >
              <MenuItem value="À Venda">À Venda</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Vendido">Vendido</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Cancelar</Button>
          <Button onClick={handleAddProperty} variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Property Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Imóvel</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Imóvel"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Endereço"
            value={formData.address}
            onChange={handleInputChange}
            name="address"
            sx={{ mt: 2 }}
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Preço"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                name="price"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quartos"
                type="number"
                value={formData.beds}
                onChange={handleInputChange}
                name="beds"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Banheiros"
                type="number"
                value={formData.baths}
                onChange={handleInputChange}
                name="baths"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Área (m²)"
                type="number"
                value={formData.sqft}
                onChange={handleInputChange}
                name="sqft"
              />
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleSelectChange}
              name="status"
            >
              <MenuItem value="À Venda">À Venda</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Vendido">Vendido</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
          <Button onClick={handleEditProperty} variant="contained">
            Atualizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
          <Button onClick={handleDeleteProperty} variant="contained" color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Property Modal */}
      <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes do Imóvel</DialogTitle>
        <DialogContent>
          {selectedProperty && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedProperty.name || selectedProperty.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedProperty.address}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2">Preço:</Typography>
                  <Typography variant="h6" color="primary">
                    R$ {selectedProperty.price.toLocaleString('pt-BR')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip label={selectedProperty.status} color="primary" />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Quartos:</Typography>
                  <Typography>{selectedProperty.beds}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Banheiros:</Typography>
                  <Typography>{selectedProperty.baths}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Área:</Typography>
                  <Typography>{selectedProperty.sqft}m²</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Criado em:</Typography>
                  <Typography>
                    {new Date(selectedProperty.created_at).toLocaleDateString('pt-BR')}
                  </Typography>
                </Grid>
              </Grid>
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

export default Listings;