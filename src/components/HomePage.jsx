import React, { useState, useEffect, useRef} from 'react'

export default function HomePage(props) {
    const { setAudioStream, setFile } = props
    const [ recordingStatus, setRecordingStatus ] = useState('inactive')
    const [ audioChunks, setAudioChunks ] = useState([])
    const [ duration, setDuration] = useState(0)  
    const mediaRecorder = useRef(null)
    const mimeType = 'audio/webm'
    const startRecording = async () => {
        let tempStream
        try{
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            tempStream = streamData
        } catch (err) {
            console.log(err.message)
            return
        }
        setRecordingStatus('recording');
        const media = new MediaRecorder(tempStream, { type: mimeType });

        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus('inactive');
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            setAudioStream(audioBlob);
            setAudioChunks([]);
            setDuration(0);
        };
    };

    useEffect(() => {
        if (recordingStatus === 'inactive') return;
        const interval = setInterval(() => {
            setDuration(curr => curr + 1)
        },1000)
        return () => clearInterval(interval)
    })

    return (
        <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center text-center pb-20'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>Your<span className='text-orange-400'>Scribe</span></h1>
            <h3 className='font-medium sm:text-1xl md:text-2xl'>Record <span className='text-orange-400'>&rarr;</span> Transcribe
                <span className='text-orange-400'> &rarr;</span> Translate</h3>
            <button onClick={recordingStatus === 'recording' ? stopRecording : startRecording} className='flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialButton rounded-xl px-4 py-2'>
                <p className='text-orange-400'>{recordingStatus === 'inactive' ? 'Record' : 'Stop recording'}</p>
                <div className='flex items-center gap-2'>
                    {duration !== 0 && (
                        <p className='text-sm'>{duration}s</p>
                    )}
                    <i className={"fa-solid fa-microphone duration-200 " + (recordingStatus === 'recording' ? 'text-red-400' :'')}></i>
                </div>

            </button>
            <p className='text-base'>Or <label className='text-orange-400 cursor-pointer hover:text-orange-600 duration-200'>Upload <input onChange={(e) => {
                const tempfile = e.target.files[0]
                setFile(tempfile)
            }} className='hidden' type='file' accept='.mp3,.wave'></input> </label> a mp3 file </p>
            <p className='italic text-slate-500'>Your voice, Understood by the World</p>
        </main>
    )
}