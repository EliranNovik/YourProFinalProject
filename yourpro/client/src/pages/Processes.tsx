import React, { useState, useMemo, useEffect } from 'react';
import './Processes.css';
import { 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  Notes as NotesIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { mockClients } from './Clients';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';

type ProjectStatus = 'done' | 'in-progress' | 'pending';

interface ProjectRow {
  projectName: string;
  clientName: string;
  clientAvatar: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string | null;
  dueDate: string | null;
  team: string[];
  billingType: string;
  budget: number;
  clientId: number;
}

const getAllClientProjects = (clients: any[]): ProjectRow[] => {
  return clients.map((client: any) => {
    let status: ProjectStatus = 'pending';
    let dueDate: string | null = client.dueDate || null;
    let startDate = client.joined || client.createdAt || '';
    // If process exists and is an array, use its last step
    if (Array.isArray(client.process) && client.process.length > 0) {
      const lastStep = client.process[client.process.length - 1];
      status = lastStep.status;
    }
    return {
      projectName: client.project,
      clientName: client.name,
      clientAvatar: client.avatar,
      status,
      startDate,
      endDate: dueDate,
      dueDate,
      team: [client.avatar],
      billingType: 'Retainer',
      budget: Math.floor(Math.random() * 100),
      clientId: client.id || client.bookingId || Math.random(),
    };
  });
};

function isDueTomorrow(dueDate: string | null) {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return due.getFullYear() === tomorrow.getFullYear() &&
    due.getMonth() === tomorrow.getMonth() &&
    due.getDate() === tomorrow.getDate();
}

const Processes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'ended'>('all');
  const [localClients, setLocalClients] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editOverviewOpen, setEditOverviewOpen] = useState(false);
  const [editStepOpen, setEditStepOpen] = useState<{ open: boolean, idx: number | null }>({ open: false, idx: null });
  const [editReportOpen, setEditReportOpen] = useState<{ open: boolean, stepIdx: number | null, reportIdx: number | null }>({ open: false, stepIdx: null, reportIdx: null });
  const [editNoteOpen, setEditNoteOpen] = useState<{ open: boolean, idx: number | null }>({ open: false, idx: null });
  const [overviewDraft, setOverviewDraft] = useState({
    description: '',
    startDate: '',
    dueDate: '',
    budget: '',
    team: ''
  });
  const [stepDraft, setStepDraft] = useState({ step: '', status: 'pending' });
  const [reportDraft, setReportDraft] = useState({ text: '', timestamp: '' });
  const [noteDraft, setNoteDraft] = useState({ text: '', timestamp: '' });

  // Load clients from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('clients') || '[]');
    setLocalClients(stored);
  }, []);

  // Get all client projects (one per client), sorted by due date
  const allProjects = useMemo(() => {
    const allClients = [...mockClients, ...localClients];
    const projects = getAllClientProjects(allClients);
    return projects.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [localClients]);

  // Filtered and searched projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p: ProjectRow) => {
      const matchesSearch =
        (typeof p.projectName === 'string' ? p.projectName : '').toLowerCase().includes(search.toLowerCase()) ||
        p.clientName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'in-progress' && p.status === 'in-progress') ||
        (statusFilter === 'ended' && p.status === 'done');
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, allProjects]);

  // Handle project row click
  const handleProjectClick = (project: ProjectRow) => {
    setSelectedProject(project);
    // Find the client by id or name
    const allClients = [...mockClients, ...localClients];
    const client = allClients.find(
      c => (c.id === project.clientId || c.name === project.clientName)
    );
    setSelectedClient(client || null);
    setShowDetails(true);
  };

  // Handler to open overview modal and load current data
  const handleEditOverview = () => {
    setOverviewDraft({
      description: selectedClient?.project?.description || '',
      startDate: selectedProject?.startDate || '',
      dueDate: selectedProject?.dueDate || '',
      budget: selectedProject?.budget?.toString() || '',
      team: selectedProject?.team?.join(', ') || ''
    });
    setEditOverviewOpen(true);
  };

  // Handler to save overview edits
  const handleSaveOverview = () => {
    // Save logic here (update state, localStorage, or API)
    if (selectedClient && selectedProject) {
      selectedClient.project.description = overviewDraft.description;
      selectedProject.startDate = overviewDraft.startDate;
      selectedProject.dueDate = overviewDraft.dueDate;
      selectedProject.budget = Number(overviewDraft.budget);
      selectedProject.team = overviewDraft.team.split(',').map(t => t.trim());
    }
    setEditOverviewOpen(false);
  };

  // Timeline Step Handlers
  const handleAddStep = () => {
    setStepDraft({ step: '', status: 'pending' });
    setEditStepOpen({ open: true, idx: null });
  };
  const handleEditStep = (idx: number) => {
    const step = selectedClient?.process?.[idx] || { step: '', status: 'pending' };
    setStepDraft({ step: step.step || '', status: step.status || 'pending' });
    setEditStepOpen({ open: true, idx });
  };
  const handleSaveStep = () => {
    if (!selectedClient) return;
    let steps = Array.isArray(selectedClient.process) ? [...selectedClient.process] : [];
    if (editStepOpen.idx === null) {
      steps.push({ ...stepDraft, reports: [] });
    } else {
      steps[editStepOpen.idx] = { ...steps[editStepOpen.idx], ...stepDraft };
    }
    selectedClient.process = steps;
    setEditStepOpen({ open: false, idx: null });
  };
  const handleDeleteStep = (idx: number) => {
    if (!selectedClient) return;
    let steps = Array.isArray(selectedClient.process) ? [...selectedClient.process] : [];
    steps.splice(idx, 1);
    selectedClient.process = steps;
    setEditStepOpen({ open: false, idx: null });
  };

  // Report Handlers
  const handleAddReport = (stepIdx: number) => {
    setReportDraft({ text: '', timestamp: new Date().toISOString() });
    setEditReportOpen({ open: true, stepIdx, reportIdx: null });
  };
  const handleEditReport = (stepIdx: number, reportIdx: number) => {
    const report = selectedClient?.process?.[stepIdx]?.reports?.[reportIdx] || { text: '', timestamp: '' };
    setReportDraft({ text: report.text || '', timestamp: report.timestamp || '' });
    setEditReportOpen({ open: true, stepIdx, reportIdx });
  };
  const handleSaveReport = () => {
    if (!selectedClient || editReportOpen.stepIdx === null) return;
    let steps = Array.isArray(selectedClient.process) ? [...selectedClient.process] : [];
    let reports = Array.isArray(steps[editReportOpen.stepIdx].reports) ? [...steps[editReportOpen.stepIdx].reports] : [];
    if (editReportOpen.reportIdx === null) {
      reports.push({ ...reportDraft });
    } else {
      reports[editReportOpen.reportIdx] = { ...reportDraft };
    }
    steps[editReportOpen.stepIdx].reports = reports;
    selectedClient.process = steps;
    setEditReportOpen({ open: false, stepIdx: null, reportIdx: null });
  };
  const handleDeleteReport = (stepIdx: number, reportIdx: number) => {
    if (!selectedClient) return;
    let steps = Array.isArray(selectedClient.process) ? [...selectedClient.process] : [];
    let reports = Array.isArray(steps[stepIdx].reports) ? [...steps[stepIdx].reports] : [];
    reports.splice(reportIdx, 1);
    steps[stepIdx].reports = reports;
    selectedClient.process = steps;
    setEditReportOpen({ open: false, stepIdx: null, reportIdx: null });
  };

  // Note Handlers
  const handleAddNote = () => {
    setNoteDraft({ text: '', timestamp: new Date().toISOString() });
    setEditNoteOpen({ open: true, idx: null });
  };
  const handleEditNote = (idx: number) => {
    const note = selectedClient?.notes?.[idx] || { text: '', timestamp: '' };
    setNoteDraft({ text: note.text || '', timestamp: note.timestamp || '' });
    setEditNoteOpen({ open: true, idx });
  };
  const handleSaveNote = () => {
    if (!selectedClient) return;
    let notes = Array.isArray(selectedClient.notes) ? [...selectedClient.notes] : [];
    if (editNoteOpen.idx === null) {
      notes.push({ ...noteDraft });
    } else {
      notes[editNoteOpen.idx] = { ...noteDraft };
    }
    selectedClient.notes = notes;
    setEditNoteOpen({ open: false, idx: null });
  };
  const handleDeleteNote = (idx: number) => {
    if (!selectedClient) return;
    let notes = Array.isArray(selectedClient.notes) ? [...selectedClient.notes] : [];
    notes.splice(idx, 1);
    selectedClient.notes = notes;
    setEditNoteOpen({ open: false, idx: null });
  };

  // Progress calculation for timeline steps
  const getTimelineProgress = () => {
    const steps = Array.isArray(selectedClient?.process) ? selectedClient.process : [];
    if (!steps.length) return 0;
    const doneCount = steps.filter((s: any) => s.status === 'done').length;
    return Math.round((doneCount / steps.length) * 100);
  };

  return (
    <Box className="clients-page" sx={{ background: '#fff', minHeight: '100vh', py: 6, paddingTop: '84px' }}>
      {!showDetails ? (
        // Project List View
        <Box className="client-details-panel" sx={{ width: '100%', minHeight: '90vh', background: '#fff', borderRadius: 4, boxShadow: 3, p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Box sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>Projects</Box>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ 
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 16,
                px: 3,
                py: 1.5
              }}
            >
              New Project
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <SearchIcon sx={{ position: 'absolute', left: 14, top: 13, color: 'text.secondary' }} />
              <TextField
                fullWidth
                placeholder="Find a project"
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    pl: 5,
                    borderRadius: 2,
                    backgroundColor: 'background.paper'
                  }
                }}
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setStatusFilter(statusFilter === 'all' ? 'in-progress' : statusFilter === 'in-progress' ? 'ended' : 'all')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 2.5,
                py: 1.5
              }}
            >
              {statusFilter === 'all' ? 'All' : statusFilter === 'in-progress' ? 'In Progress' : 'Ended'}
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#fff !important' }}>
                  <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, background: '#fff !important' }}>Project</TableCell>
                  <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, background: '#fff !important' }}>Client</TableCell>
                  <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, background: '#fff !important' }}>Status</TableCell>
                  <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, background: '#fff !important' }}>Start Date</TableCell>
                  <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, background: '#fff !important' }}>Due Date</TableCell>
                  <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, background: '#fff !important' }}>Team</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((p: ProjectRow, idx: number) => (
                  <TableRow 
                    key={idx}
                    sx={{ 
                      backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#fff',
                      '&:hover': { backgroundColor: '#f1f5f9', cursor: 'pointer' }
                    }}
                    onClick={() => handleProjectClick(p)}
                  >
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{p.projectName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          component="img"
                          src={p.clientAvatar}
                          alt={p.clientName}
                          sx={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid', borderColor: 'primary.main' }}
                        />
                        <Box sx={{ color: 'primary.main', fontWeight: 500 }}>{p.clientName}</Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {p.status === 'done' ? 
                          <CheckCircleIcon sx={{ color: 'success.main' }} /> : 
                          p.status === 'in-progress' ? 
                          <HourglassEmptyIcon sx={{ color: 'warning.main' }} /> : 
                          <RadioButtonUncheckedIcon sx={{ color: 'text.disabled' }} />
                        }
                        <Box sx={{ 
                          color: p.status === 'done' ? 'success.main' : 
                                 p.status === 'in-progress' ? 'warning.main' : 
                                 'text.disabled',
                          fontWeight: 500
                        }}>
                          {p.status.replace('-', ' ')}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{new Date(p.startDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'No Due Date'}</TableCell>
                    <TableCell>
                      <Box
                        component="img"
                        src={p.clientAvatar}
                        alt={p.clientName}
                        sx={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid', borderColor: 'primary.light' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary', fontSize: 18 }}>
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        // Full Screen Project Details View
        <Box sx={{ 
          width: '100%', 
          minHeight: '100vh', 
          background: '#f8fafc',
        }}>
          {/* Header */}
          <Box sx={{ 
            background: '#fff', 
            borderBottom: '1px solid #e2e8f0',
            p: 3,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setShowDetails(false)}
              sx={{ 
                color: '#64748b',
                '&:hover': { background: '#f1f5f9' }
              }}
            >
              Back to Projects
            </Button>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                {typeof selectedProject?.projectName === 'string' ? selectedProject.projectName : 'Untitled Project'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ 
                background: '#2563eb',
                '&:hover': { background: '#1d4ed8' }
              }}
            >
              Edit Project
            </Button>
          </Box>

          {/* Progress Bar for Timeline */}
          <Box sx={{ background: '#f8fafc', px: 0, pt: 2, pb: 1 }}>
            <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 600, mb: 0.5, textAlign: 'center' }}>
              Project Progress: {getTimelineProgress()}%
            </Typography>
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <LinearProgress 
                variant="determinate" 
                value={getTimelineProgress()} 
                sx={{ height: 10, borderRadius: 5, background: '#e0e7ef', '& .MuiLinearProgress-bar': { background: '#2563eb' } }}
              />
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '4fr 1fr', gap: 4 }}>
              {/* Left Column - Main Content */}
              <Box>
                {/* Project Overview */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 2, position: 'relative' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon /> Project Overview
                    <IconButton size="small" sx={{ ml: 1 }} onClick={handleEditOverview}><EditIcon fontSize="small" /></IconButton>
                  </Typography>
                  <Box sx={{ color: '#64748b', fontSize: 16, mb: 3 }}>
                    {selectedClient?.project?.description || 'No description available.'}
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Start Date</Typography>
                        <Typography>{selectedProject?.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : 'N/A'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Due Date</Typography>
                        <Typography>{selectedProject?.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : 'N/A'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon sx={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Budget</Typography>
                        <Typography>${selectedProject?.budget || '-'}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Timeline/Steps */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimelineIcon /> Timeline
                    </Typography>
                    <Button startIcon={<AddIcon />} sx={{ color: '#2563eb' }} onClick={handleAddStep}>Add Step</Button>
                  </Box>
                  <Box>
                    {(Array.isArray(selectedClient?.process) ? selectedClient.process : []).map((step: any, idx: number) => (
                      <Box key={idx} sx={{ mb: 2, p: 2, background: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', position: 'relative' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{step.step || `Step ${idx + 1}`}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1, background: step.status === 'done' ? '#dcfce7' : step.status === 'in-progress' ? '#fef3c7' : '#fee2e2', color: step.status === 'done' ? '#059669' : step.status === 'in-progress' ? '#d97706' : '#dc2626', fontSize: 14, fontWeight: 500 }}>{step.status || 'pending'}</Box>
                            <IconButton size="small" onClick={() => handleEditStep(idx)}><EditIcon fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteStep(idx)}><CloseIcon fontSize="small" /></IconButton>
                          </Box>
                        </Box>
                        {step.reports && Array.isArray(step.reports) && step.reports.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>Reports <IconButton size="small" onClick={() => handleAddReport(idx)}><AddIcon fontSize="small" /></IconButton></Typography>
                            {step.reports.map((report: any, rIdx: number) => (
                              <Box key={rIdx} sx={{ p: 1.5, background: '#fff', borderRadius: 1, border: '1px solid #e2e8f0', mb: 1, position: 'relative' }}>
                                <Typography sx={{ color: '#1e293b' }}>{report.text}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>{report.timestamp ? new Date(report.timestamp).toLocaleString() : 'No date'}</Typography>
                                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                                  <IconButton size="small" onClick={() => handleEditReport(idx, rIdx)}><EditIcon fontSize="small" /></IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteReport(idx, rIdx)}><CloseIcon fontSize="small" /></IconButton>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        )}
                        {(!step.reports || step.reports.length === 0) && (
                          <Button startIcon={<AddIcon />} size="small" sx={{ mt: 1, color: '#2563eb' }} onClick={() => handleAddReport(idx)}>Add Report</Button>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* Notes Section */}
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NotesIcon /> Notes
                    </Typography>
                    <Button startIcon={<AddIcon />} sx={{ color: '#2563eb' }} onClick={handleAddNote}>Add Note</Button>
                  </Box>
                  <Box>
                    {(Array.isArray(selectedClient?.notes) ? selectedClient.notes : []).map((note: any, idx: number) => (
                      <Box key={idx} sx={{ mb: 2, p: 2, background: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', position: 'relative' }}>
                        <Typography sx={{ color: '#1e293b', mb: 1 }}>{note.text}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{note.timestamp ? new Date(note.timestamp).toLocaleString() : 'No date'}</Typography>
                        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleEditNote(idx)}><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDeleteNote(idx)}><CloseIcon fontSize="small" /></IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>

              {/* Right Column - Sidebar */}
              <Box sx={{ ml: 6 }}>
                {/* Status Card */}
                <Paper sx={{ p: 4, mb: 5, borderRadius: 3, minWidth: 0, maxWidth: 340, fontSize: 18, boxShadow: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: '#1e293b', fontWeight: 700, fontSize: 24 }}>Status</Typography>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: 1.5, borderRadius: 1, background: selectedProject?.status === 'done' ? '#dcfce7' : selectedProject?.status === 'in-progress' ? '#fef3c7' : '#fee2e2', color: selectedProject?.status === 'done' ? '#059669' : selectedProject?.status === 'in-progress' ? '#d97706' : '#dc2626', fontWeight: 600, fontSize: 18 }}>{selectedProject?.status?.replace('-', ' ') || 'pending'}</Box>
                </Paper>

                {/* Client Info */}
                <Paper sx={{ p: 4, mb: 5, borderRadius: 3, minWidth: 0, maxWidth: 340, fontSize: 18, boxShadow: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: '#1e293b', fontWeight: 700, fontSize: 24 }}>Client</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="img" src={selectedProject?.clientAvatar} alt={selectedProject?.clientName} sx={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #e2e8f0' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: 20 }}>{selectedProject?.clientName}</Typography>
                      <Typography variant="body1" sx={{ color: '#64748b', fontSize: 16 }}>Client ID: {selectedProject?.clientId}</Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Billing Info */}
                <Paper sx={{ p: 4, borderRadius: 3, minWidth: 0, maxWidth: 340, fontSize: 18, boxShadow: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: '#1e293b', fontWeight: 700, fontSize: 24 }}>Billing</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: 16 }}>Type</Typography>
                      <Typography sx={{ fontSize: 18 }}>{selectedProject?.billingType || '-'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: 16 }}>Budget</Typography>
                      <Typography sx={{ fontSize: 18 }}>${selectedProject?.budget || '-'}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Dialog open={editOverviewOpen} onClose={() => setEditOverviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project Overview<IconButton onClick={() => setEditOverviewOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <TextField label="Description" fullWidth multiline minRows={2} value={overviewDraft.description} onChange={e => setOverviewDraft({ ...overviewDraft, description: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Start Date" type="date" fullWidth value={overviewDraft.startDate} onChange={e => setOverviewDraft({ ...overviewDraft, startDate: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="Due Date" type="date" fullWidth value={overviewDraft.dueDate} onChange={e => setOverviewDraft({ ...overviewDraft, dueDate: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="Budget" type="number" fullWidth value={overviewDraft.budget} onChange={e => setOverviewDraft({ ...overviewDraft, budget: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Team (comma separated)" fullWidth value={overviewDraft.team} onChange={e => setOverviewDraft({ ...overviewDraft, team: e.target.value })} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOverviewOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveOverview} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editStepOpen.open} onClose={() => setEditStepOpen({ open: false, idx: null })} maxWidth="xs" fullWidth>
        <DialogTitle>{editStepOpen.idx === null ? 'Add Step' : 'Edit Step'}<IconButton onClick={() => setEditStepOpen({ open: false, idx: null })} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <TextField label="Step Name" fullWidth value={stepDraft.step} onChange={e => setStepDraft({ ...stepDraft, step: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Status" select fullWidth value={stepDraft.status} onChange={e => setStepDraft({ ...stepDraft, status: e.target.value })} sx={{ mb: 2 }}>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStepOpen({ open: false, idx: null })}>Cancel</Button>
          <Button onClick={handleSaveStep} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editReportOpen.open} onClose={() => setEditReportOpen({ open: false, stepIdx: null, reportIdx: null })} maxWidth="xs" fullWidth>
        <DialogTitle>{editReportOpen.reportIdx === null ? 'Add Report' : 'Edit Report'}<IconButton onClick={() => setEditReportOpen({ open: false, stepIdx: null, reportIdx: null })} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <TextField label="Report Text" fullWidth multiline minRows={2} value={reportDraft.text} onChange={e => setReportDraft({ ...reportDraft, text: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Timestamp" type="datetime-local" fullWidth value={reportDraft.timestamp.slice(0, 16)} onChange={e => setReportDraft({ ...reportDraft, timestamp: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditReportOpen({ open: false, stepIdx: null, reportIdx: null })}>Cancel</Button>
          <Button onClick={handleSaveReport} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editNoteOpen.open} onClose={() => setEditNoteOpen({ open: false, idx: null })} maxWidth="xs" fullWidth>
        <DialogTitle>{editNoteOpen.idx === null ? 'Add Note' : 'Edit Note'}<IconButton onClick={() => setEditNoteOpen({ open: false, idx: null })} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <TextField label="Note Text" fullWidth multiline minRows={2} value={noteDraft.text} onChange={e => setNoteDraft({ ...noteDraft, text: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Timestamp" type="datetime-local" fullWidth value={noteDraft.timestamp.slice(0, 16)} onChange={e => setNoteDraft({ ...noteDraft, timestamp: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditNoteOpen({ open: false, idx: null })}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Processes; 