import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";


function Header() {
  return (
    <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
            <div className="w-fit bg-[#1060FE]">
                <Image
                    src="data:image/png;base64,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"
                    alt="logo"
                    className=""
                    height={50}
                    width={50}
                 />
            </div>
            <h1 className="font-bold text-xl">Dropbox</h1>
        </Link>

        <div className="px-5 flex space-x-2 items-center">
            <ThemeToggler />

            <UserButton afterSignOutUrl="/" />

            <SignedOut>
                <SignInButton afterSignInUrl="/dashboard" mode="modal" />
            </SignedOut>
        </div>
    </header>
  )
}

export default Header;
