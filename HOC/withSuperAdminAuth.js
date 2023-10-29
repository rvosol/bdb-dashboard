
// hoc/withAuth.js
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../layout/context/AuthContext'; // Update this path accordingly

const withSuperAdminAuth = (WrappedComponent) => {
    return (props) => {
        const Router = useRouter();
        const { isAuth, loading, userInfo } = useContext(AuthContext);

        useEffect(() => {
          console.log("Checking isAuth value:", isAuth);
          if (!loading && (!isAuth || userInfo?.role !== 'superAdmin')) {
            console.log("Redirecting to login because isAuth is false or the user is not a superAdmin");
            Router.replace('/auth/login');
        }
      }, [isAuth, loading]);

        return <WrappedComponent {...props} />;
    };
};

export default withSuperAdminAuth;
