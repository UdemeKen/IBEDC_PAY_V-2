import React, { useState } from 'react'

export default function ResetPassword() {

    const [ loading, setLoading ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');



    const handleSubmit = (e) => {

    };

  return (
    <section>
        <div className='flex justify-center items-center h-screen'>
            <div className='bg-slate-300 flex flex-col justify-center items-center rounded-lg p-10 space-y-4 w-1/3'>
                <div className='flex flex-col justify-center items-center space-y-4 w-full'>
                    <h1 className='text-xl capitalize font-semibold font-sans'>reset password</h1>
                    <form className='flex flex-col justify-center space-y-8 xs:w-64 w-full' 
                    onSubmit={handleSubmit}
                    >
                        <div className="">
                        <label htmlFor="password" className='text-sm font-semibold'>Password</label>
                            <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            name="password"
                            placeholder='Enter new password'
                            className="block w-full rounded-md border-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                            />
                        </div>
                        <div className="">
                        <label htmlFor="password" className='text-sm font-semibold'>Confirm Password</label>
                            <input
                            type="password"
                            id="confirmpassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            name="confirm password"
                            placeholder='Enter confirmed password'
                            className="block w-full rounded-md border-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                            />
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                        <button
                        type="submit"
                        disabled={buttonDisabled}
                        className={`w-full rounded-md py-1 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                            (buttonDisabled)
                            ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed '
                            : 'w-full bg-blue-950 opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                        }`}
                        onClick={handleSubmit}
                        >
                        {!loading && <p>Reset</p>}
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
        </div>
    </section>
  )
}
