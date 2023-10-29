
// hoc/withAuth.js
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../layout/context/AuthContext'; // Update this path accordingly

const withAuth = (WrappedComponent) => {
    return (props) => {
        const Router = useRouter();
        const { isAuth, loading } = useContext(AuthContext);

        useEffect(() => {
          console.log("Checking isAuth value:", isAuth);
          if (!loading && !isAuth) {
              console.log("Redirecting to login because isAuth is false");
              Router.replace('/auth/login');
          }
      }, [isAuth, loading]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
