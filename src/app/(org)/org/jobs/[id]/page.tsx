import OrgJobDetailContainer from './_components/org-job-detail-container';

interface OrgJobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrgJobDetailPage({
  params,
}: OrgJobDetailPageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <OrgJobDetailContainer jobId={id} />;
}
