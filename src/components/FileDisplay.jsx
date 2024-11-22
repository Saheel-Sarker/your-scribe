import React from 'react'

export default function FileDisplay(props) {
    const { resetAudio, file, audioStream, handleFormSubmission, handleAudioReset } = props 


    return (
        <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center text-center pb-20 w-fit max-w-full mx-auto w-72 sm:w-96'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>Your <span className='text-orange-400'>File</span></h1>
            <div className='flex flex-col text-left my-5'>
                <h3 className="font-semibold">Name</h3>
                <p>{file? file?.name : 'Custom Audio'}</p>
            </div>
            <div className='flex items-center justify-between gap-4'>
                <button className='text-slate-500 hover:text-orange-400 duration-200' onClick={resetAudio}>
                    <p>Reset</p>
                </button>
                <button onClick={handleFormSubmission} className='flex items-center gap-2 text-1xl sm:text-2xl md:text-2xl specialButton px-4 py-2 rounded-lg text-orange-400'>
                    <p>Transcribe</p>
                    <i className="fa-solid fa-pen-clip"></i>
                </button>
            </div>
         </main>
    )
}