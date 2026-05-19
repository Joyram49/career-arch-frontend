import type { Metadata } from 'next';
import { SavedJobsClient } from './_components/saved-jobs-client';

export const metadata: Metadata = { title: 'Saved Jobs' };

export default function SavedJobsPage(): React.JSX.Element {
  return <SavedJobsClient />;
}
