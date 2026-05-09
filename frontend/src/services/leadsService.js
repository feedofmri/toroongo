import { api } from './api';

export const leadsService = {
    getSubscribers: () => api('/newsletter/subscribers'),
    getContactSubmissions: () => api('/contact/submissions'),
    markContactRead: (id) => api(`/contact/submissions/${id}/read`, { method: 'PUT' }),
};
