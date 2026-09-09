import { OrgAuthGate } from './_components/org-auth-gate';

export default function OrgLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <OrgAuthGate>{children}</OrgAuthGate>;
}
