import api from './api';

interface Settings {
  id: string;
  name: string;
  value: string;
  description?: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  category: 'GENERAL' | 'EMAIL' | 'PAYMENT' | 'NOTIFICATION';
}

export const settingsService = {
  getAll: () => {
    return api.get<Settings[]>('/settings').then(response => response.data);
  },

  getById: (id: string) => {
    return api.get<Settings>(`/settings/${id}`).then(response => response.data);
  },

  update: (id: string, data: Partial<Settings>) => {
    return api.put<Settings>(`/settings/${id}`, data).then(response => response.data);
  },

  updateBulk: (settings: Array<{ id: string; value: string }>) => {
    return api.put<Settings[]>('/settings/bulk', settings).then(response => response.data);
  }
}; 