// hoc/withAuth.js
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../layout/context/AuthContext'; // Update this path accordingly

const withoutAuth = (WrappedComponent) => {
    return (props) => {
        const Router = useRouter();
        const { isAuth, loading } = useContext(AuthContext);

        useEffect(() => {
          if (!loading && isAuth) {
              Router.replace('/');
          }
      }, [isAuth, loading]);

        return <WrappedComponent {...props} />;
    };
};

export default withoutAuth;