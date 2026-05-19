import type { Metadata } from 'next';
import { ProfileClient } from './_components/profile-client';

export const metadata: Metadata = { title: 'My Profile' };

export default function ProfilePage(): React.JSX.Element {
  return <ProfileClient />;
}
