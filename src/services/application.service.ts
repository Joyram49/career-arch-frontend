import client from '@lib/axios/client';

export async function getApplications(filters?: Record<string, unknown>) {
  const { data } = await client.get('/applications', { params: filters });
  return data.data as {
    applications: unknown[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  };
}

export async function getApplicationStats() {
  const { data } = await client.get('/applications');
  const apps = (data.data?.applications ?? []) as Array<{ status: string }>;
  return {
    total: apps.length,
    interviews: apps.filter((a) => a.status === 'INTERVIEW').length,
    offers: apps.filter((a) => a.status === 'OFFERED' || a.status === 'HIRED').length,
    saved: 0, // comes from subscription
  };
}

export async function getApplicationById(id: string) {
  const { data } = await client.get(`/applications/${id}`);
  return data.data as { application: unknown };
}

export async function withdrawApplication(id: string) {
  const { data } = await client.delete(`/applications/${id}`);
  return data;
}
