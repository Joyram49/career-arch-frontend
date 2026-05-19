import { Route } from 'next';
import { redirect } from 'next/navigation';

const UserPage = () => {
  redirect('/user/overview' as Route);
};

export default UserPage;
