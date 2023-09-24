import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();

    useEffect(() => {
      // Make sure this code runs only in client side
      if (typeof window !== 'undefined') {
        const isAuth = localStorage.getItem('token');

        if (!isAuth) {
          Router.replace("/auth/login");
        }
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
