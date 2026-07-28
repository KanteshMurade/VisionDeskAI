import { ReactNode } from "react";

interface Props{
    children:ReactNode;
}

export default function MainLayout({children}:Props){

    return(

        <div className="flex h-screen">

            <aside className="w-64 bg-gray-900 border-r border-gray-700">

                <div className="text-2xl font-bold p-6">

                    VisionDesk AI

                </div>

                <nav className="px-4 space-y-2">

                    <button className="w-full text-left p-3 rounded hover:bg-gray-800">

                        Dashboard

                    </button>

                    <button className="w-full text-left p-3 rounded hover:bg-gray-800">

                        AI

                    </button>

                    <button className="w-full text-left p-3 rounded hover:bg-gray-800">

                        OCR

                    </button>

                    <button className="w-full text-left p-3 rounded hover:bg-gray-800">

                        Memory

                    </button>

                    <button className="w-full text-left p-3 rounded hover:bg-gray-800">

                        Plugins

                    </button>

                    <button className="w-full text-left p-3 rounded hover:bg-gray-800">

                        Settings

                    </button>

                </nav>

            </aside>

            <main className="flex-1 flex flex-col">

                <header className="h-16 border-b border-gray-700 flex items-center px-6 text-xl">

                    Dashboard

                </header>

                <div className="flex-1 p-8">

                    {children}

                </div>

                <footer className="h-10 border-t border-gray-700 flex items-center px-4 text-sm text-gray-400">

                    Status : Ready

                </footer>

            </main>

        </div>

    )

}