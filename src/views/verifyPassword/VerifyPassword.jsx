import React, { useState } from 'react'

export default function VerifyPassword() {

    const [ loading, setLoading ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ userEmail, setUserEmail ] = useState("");
    const [ pin, setPin ] = useState("");

    const handleSubmit = (e) => {

    };


  return (
    <section className='flex flex-col justify-center items-center h-screen'>
        <div className='bg-slate-300 rounded-md'>
            <div className='flex flex-col justify-center items-center space-y-4 p-8'>
                <h1 className='text-4xl font-bold'>Verify it's you</h1>
                <p className='w-2/3 text-center'>We've sent a verification PIN CODE to your email <span className='font-semibold'>{userEmail}</span></p>
                <p>Enter the code from the email in the field below:</p>
                <form className='flex flex-col justify-center items-center space-y-4'>
                    <input 
                        id='pin'
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        autoComplete='off'
                        required
                        placeholder="Enter PIN"
                        className="block w-1/2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-2xl text-center sm:leading-6"
                        />
                    <div>
                    <button onClick={handleSubmit} disabled={buttonDisabled} className={`w-full rounded-md py-1 px-6 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                        (buttonDisabled)
                        ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed'
                        : 'w-full bg-blue-950 bg-opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                    }`}>
                    {!loading && <p>Click to reset password</p>}
                    {loading && 
                    <div className='flex flex-row justify-center space-x-2'>
                        <div>
                            <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            <div>
                            <span class="font-medium"> Processing... </span>
                        </div>
                    </div>
                    }
                    </button>
                    </div>
                </form>
            </div>
        </div>
        </section>
  )
}
