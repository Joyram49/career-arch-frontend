import ContainerLayout from '@components/layout/ContainerLayout';
import Link from 'next/link';

const AuthFooter = () => {
  return (
    <ContainerLayout className="px-8">
      <div className="flex w-full justify-between">
        <p>© 2024 CareerArch Precision Systems</p>
        <div className="flex gap-x-8">
          <Link href={{ pathname: '/privacy-policy' }}>Privacy Policy</Link>
          <Link href={{ pathname: '/terms-of-service' }}>Terms of Service</Link>
          <Link href={{ pathname: '/contact' }}>Contact Support</Link>
        </div>
      </div>
    </ContainerLayout>
  );
};

export default AuthFooter;
