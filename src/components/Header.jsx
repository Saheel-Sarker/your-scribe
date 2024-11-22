import React from 'react'

export default function Header() {
    return (
        <header className='flex items-center justify-between gap-4 p-4'>
            <a href="/"> <h1 className='text-1xl sm:text-2xl md:text-2xl'>Your<span className='font-medium text-orange-400'>Scribe</span></h1></a>
            <a href="/" className='flex items-center gap-2 text-1xl sm:text-1xl md:text-1xl specialButton px-4 py-2 rounded-lg text-orange-400 text-sm'>
                <p>New</p>
                <i className="fa-solid fa-plus"></i>
            </a>
        </header>
    )
}