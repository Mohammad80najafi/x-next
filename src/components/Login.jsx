"use client";
import { signIn, signOut, useSession } from "next-auth/react";

const Login = () => {
  const { status } = useSession();

  return (
    <div>
      {status === "authenticated" ? (
        <h1
          className="text-center mt-5 font-semibold cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          authenticated click for log out
        </h1>
      ) : (
        <h1
          className="text-center mt-5 font-semibold cursor-pointer"
          onClick={() => signIn("github")}
        >
          please log in
        </h1>
      )}
    </div>
  );
};

export default Login;
