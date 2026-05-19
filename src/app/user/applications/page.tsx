import type { Metadata } from 'next';
import { ApplicationsClient } from './_components/applications-client';

export const metadata: Metadata = { title: 'My Applications' };

export default function ApplicationsPage(): React.JSX.Element {
  return <ApplicationsClient />;
}
