import { Route } from 'next';
import { redirect } from 'next/navigation';

export default function SettingsPage(): never {
  redirect('/user/settings/account' as Route);
}
