import OrgJobEditContainer from './_components/org-job-edit-container';

interface OrgJobEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrgJobEditPage({
  params,
}: OrgJobEditPageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <OrgJobEditContainer jobId={id} />;
}
