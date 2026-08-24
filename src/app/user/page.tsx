import { type Route } from 'next';
import { redirect } from 'next/navigation';

const UserPage = (): never => {
  redirect('/user/dashboard' as Route);
};

export default UserPage;
