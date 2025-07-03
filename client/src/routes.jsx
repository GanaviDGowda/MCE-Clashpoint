import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Auth Pages
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

// Public Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import NotFound from './pages/NotFound';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AttendanceConfirmationPage from './pages/student/AttendanceConfirmationPage';
import EventAttendancePage from './pages/student/EventAttendancePage';

// Host Pages
import HostDashboard from './pages/host/HostDashboard';
import AddEvent from './pages/host/AddEvent';
import EditEvent from './pages/host/EditEvent';
import ParticipantList from './pages/host/ParticipantsList';
import EventQRCodePage from './pages/host/EventQRDisplayPage';

// Optional: Separate review page, if ever needed
// import ReviewPage from './pages/ReviewPage';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/events" element={<Events />} />
    <Route path="/events/:id" element={<EventDetails />} />
    {/* If review listing/editing ever gets separate page: */}
    {/* <Route path="/events/:id/reviews" element={<ReviewPage />} /> */}

    {/* Auth */}
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />

    {/* Student */}
    <Route path="/student/dashboard" element={<StudentDashboard />} />
    <Route path="/events/:eventId/attendance" element={<EventAttendancePage />} />
    <Route path="/attendance-confirmation" element={<AttendanceConfirmationPage />} />

    {/* Host */}
    <Route path="/host/dashboard" element={<HostDashboard />} />
    <Route path="/host/add-event" element={<AddEvent />} />
    <Route path="/host/edit-event/:id" element={<EditEvent />} />
    <Route path="/host/event/:eventId" element={<EventQRCodePage />} />
    {/* <Route path="/host/event/:eventId/participants" element={<ParticipantList />} /> */}

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
