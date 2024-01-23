'use client';
import { signIn } from "next-auth/react";

const SignInButton = () => {
    return (
        <button
            className=""
            onClick={() => signIn()}
        >
            Sign In
        </button>
    );
};

export default SignInButton;
