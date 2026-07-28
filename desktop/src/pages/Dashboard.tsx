export default function Dashboard(){

    return(

        <div>

            <h1 className="text-4xl font-bold">

                Welcome to VisionDesk AI

            </h1>

            <p className="mt-3 text-gray-400">

                Your personal AI desktop operating layer.

            </p>

            <div className="grid grid-cols-3 gap-6 mt-10">

                <div className="bg-gray-800 rounded-xl p-6">

                    <h2 className="text-lg font-semibold">

                        AI Provider

                    </h2>

                    <p className="mt-3">

                        Gemini

                    </p>

                </div>

                <div className="bg-gray-800 rounded-xl p-6">

                    <h2 className="text-lg font-semibold">

                        OCR

                    </h2>

                    <p className="mt-3">

                        Not Running

                    </p>

                </div>

                <div className="bg-gray-800 rounded-xl p-6">

                    <h2 className="text-lg font-semibold">

                        Overlay

                    </h2>

                    <p className="mt-3">

                        Disabled

                    </p>

                </div>

            </div>

        </div>

    )

}