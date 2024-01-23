'use client';
import { signOut } from "next-auth/react";

const SignOutButton = () => {
    return (
        <button
            className=""
            onClick={() => signOut()}
        >
            Sign Out
        </button>
    );
};

export default SignOutButton;
