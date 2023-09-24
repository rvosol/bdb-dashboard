import { useRouter } from "next/router";
import { useEffect } from "react";


const withoutAuth = (WrappedComponent) => {
    return (props) => {
      return <WrappedComponent {...props} />;
    };
  };
  
// const withoutAuth = (WrappedComponent) => {
//   return (props) => {
//     const Router = useRouter();

//     useEffect(() => {
//       // Make sure this code runs only in client side
//       if (typeof window !== 'undefined') {
//         const isAuth = localStorage.getItem('token');

//         if (isAuth) {
//           Router.replace("/");  // Redirect authenticated users to dashboard
//         }
//       }
//     }, []);

//     return <WrappedComponent {...props} />;
//   };
// };

export default withoutAuth;
