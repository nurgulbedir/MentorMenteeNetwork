import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import trLocale from '@fullcalendar/core/locales/tr';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress
} from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';

const CalendarPage = () => {
  const [events, setEvents] = useState([]); // Başlangıçta boş

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    person: '',
    start: new Date().toISOString().slice(0, 16),
    end: new Date().toISOString().slice(0, 16)
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore'dan etkinlikleri çekme
  useEffect(() => {
    const fetchEventsAndUsers = async () => {
      setLoading(true);
      try {
        // Kullanıcıları çek (Mentor ve Mentee)
        const mentorsQuery = query(collection(db, 'users'), where('role', '==', 'mentor'));
        const mentorsSnapshot = await getDocs(mentorsQuery);
        const mentors = mentorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          displayName: `${doc.data().name || ''} ${doc.data().surname || ''} (Mentor)`
        }));

        const menteesQuery = query(collection(db, 'users'), where('role', '==', 'mentee'));
        const menteesSnapshot = await getDocs(menteesQuery);
        const mentees = menteesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          displayName: `${doc.data().name || ''} ${doc.data().surname || ''} (Mentee)`
        }));

        setUsers([...mentors, ...mentees]);

        // Etkinlikleri çek
        const eventsCollectionRef = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollectionRef);
        const fetchedEvents = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          start: doc.data().start,
          end: doc.data().end,
          extendedProps: {
            description: doc.data().description,
            person: doc.data().person
          }
        }));
        setEvents(fetchedEvents);

      } catch (error) {
        console.error('Veriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndUsers();
  }, []);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await deleteDoc(doc(db, 'events', selectedEvent.id));
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        handleCloseDialog();
      } catch (error) {
        console.error('Etkinlik silinirken hata:', error);
      }
    }
  };

  const handleDateClick = (arg) => {
    setNewEvent({
      ...newEvent,
      start: arg.dateStr + 'T00:00',
      end: arg.dateStr + 'T01:00'
    });
    setIsAddDialogOpen(true);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.person) return;

    const selectedUser = users.find(user => user.id === newEvent.person);

    const eventData = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      description: newEvent.description,
      person: selectedUser ? selectedUser.displayName : 'Seçilmedi'
    };

    try {
      const docRef = await addDoc(collection(db, 'events'), eventData);
      setEvents([...events, { id: docRef.id, ...eventData }]);
      setIsAddDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        person: '',
        start: new Date().toISOString().slice(0, 16),
        end: new Date().toISOString().slice(0, 16)
      });
    } catch (error) {
      console.error('Etkinlik eklenirken hata:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        locale={trLocale}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        height="auto"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
      />

      {/* Etkinlik Detay Dialog'u */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Kişi:</strong> {selectedEvent.extendedProps.person}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Başlangıç:</strong> {new Date(selectedEvent.start).toLocaleString('tr-TR')}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Bitiş:</strong> {new Date(selectedEvent.end).toLocaleString('tr-TR')}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Açıklama:</strong> {selectedEvent.extendedProps.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Kapat</Button>
              <Button onClick={handleDeleteEvent} color="error">
                Sil
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Yeni Etkinlik Ekleme Dialog'u */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Etkinlik Başlığı"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kişi Seçin</InputLabel>
                <Select
                  value={newEvent.person}
                  label="Kişi Seçin"
                  onChange={(e) => setNewEvent({ ...newEvent, person: e.target.value })}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Açıklama"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Başlangıç"
                type="datetime-local"
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bitiş"
                type="datetime-local"
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>İptal</Button>
          <Button onClick={handleAddEvent} variant="contained">
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage; 