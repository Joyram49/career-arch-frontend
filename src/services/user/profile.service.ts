import api from '@lib/axios';

export async function getProfile() {
  const { data } = await api.get('/user/profile');
  return data.data as { user: unknown; profile: unknown };
}

export async function updateProfile(payload: Record<string, unknown>) {
  const { data } = await api.put('/user/profile', payload);
  return data.data;
}

export async function uploadAvatar(file: File) {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await api.post('/user/profile/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function uploadResume(file: File) {
  const form = new FormData();
  form.append('resume', file);
  const { data } = await api.post('/user/profile/resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteResume() {
  const { data } = await api.delete('/user/profile/resume');
  return data;
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  const { data } = await api.put('/user/change-password', payload);
  return data;
}
