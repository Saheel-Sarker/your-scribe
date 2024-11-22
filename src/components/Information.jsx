import React, { useState, useEffect, useRef } from 'react'
import Transcription from './Transcription';
import Translation from './Translation';

export default function Information(props) {
    const {output, finished} = props
    console.log(output)
    const [tab, setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [translating, setTranslating] = useState(null)
    const [toLanguage, setToLanguage] = useState('Select language')

    const worker = useRef()

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
                type: 'module'
            })
        }

        const onMessageReceived = async (e) => {
            switch (e.data.status) {
                case 'initiate':
                    console.log('DOWNLOADING')
                    break;
                case 'progress':
                    console.log('LOADING')
                    break;
                case 'update':
                    setTranslation(e.data.output)
                    break;
                case 'complete':
                    setTranslating(false)
                    console.log("DONE")
                    break;
            }
        }

        worker.current.addEventListener('message', onMessageReceived)

        return () => worker.current.removeEventListener('message', onMessageReceived)
    })

    const textElement = tab === 'transcription' ? output.map(val => val.text) : translation || ''

    function handleCopy() {
        navigator.clipboard.writeText(textElement)
    }

    function handleDownload() {
        const element = document.createElement('a')
        const file = new Blob([], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = 'YourScribe_' + Date().toString() + '.txt'
        document.body.appendChild(element)
        element.click()
    }
     
    function generateTranslation() {
        if (translating || toLanguage === 'Select Language') {
            return
        }

        setTranslating(true)

        worker.current.postMessage({
            text: output.map(val => val.text),
            src_lang: 'eng_Latn',
            tgt_lang: toLanguage
        })
    }

    return (
        <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center text-center pb-20 max-w-full mx-auto items-center'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl whitespace-nowrap'>Your <span className='text-orange-400'>Transcription</span></h1>
            <div className='grid grid-cols-2 mx-auto bg-white specialButton rounded-full overflow-hidden items-center'>
                <button onClick={() => setTab('transcription')} className={'px-4 duration-200 py-1 ' + (tab === 'transcription' ? 'bg-orange-300 text-white' :
                    'text-orange-400 hover:text-orange-600')}>Transcription</button>
                <button onClick={() => setTab('translation')} className={'px-4 duration-200 py-1 ' + (tab === 'translation' ? 'bg-orange-300 text-white' :
                    'text-orange-400 hover:text-orange-600')}>Translation</button>
            </div>
            <div className='my-8 flex flex-col'>
                {(translating) && (
                    <div className='grid place-items-center'>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                    </div>
                )}
                {tab === 'transcription' ? (
                    <Transcription {...props} textElement={textElement}></Transcription>
                ) : (
                        <Translation {...props} toLanguage={toLanguage} translating={translating} textElement={textElement} setTranslating={setTranslating} setTranslation={setTranslation} setToLanguage={setToLanguage} generateTranslation={generateTranslation}></Translation>
                )}
            </div>
            <div className='flex items-center gap-4 mx-auto'>
                <button onClick={handleCopy} title="Copy" className='hover:text-orange-500 duration-200 p-2 rounded px-2 aspect-square grid place-items-center text-orange-300'>
                    <i className="fa-regular fa-copy"></i>
                </button>
                <button onClick={handleDownload} title="Download" className='hover:text-orange-500 duration-200 p-2 rounded px-2 aspect-square grid place-items-center text-orange-300'>
                    <i className="fa-solid fa-download"></i>
                </button>
            </div>
        </main>
    )
}