import {useState, type FormEvent} from 'react'
import FileUploader from '~/components/FileUploader';
import NavBar from '~/components/NavBar'

const upload = () => {

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    }
  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <div className="flex justify-center items-center">
        <NavBar/>
        </div>

        <section className="main-section">
            <div className='page-heading py-16 '>
                <h1>Smart feedback for your dream job</h1>
                {isProcessing ? (
                    <>
                        <h2>{statusText}</h2>
                        <img src="/images/resume-scan.gif" alt="" />
                        <h2>Drop your resume for ATS score and improvement tips.</h2>
                    </>
                ) : (
                    <h2>Drop your resume for ATS score and improvement tips.</h2>
                )}

                {!isProcessing && (
                    <form action="" id='upload-form' 
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-4 mt-8'
                    >
                        <div className='form-div'>
                            <label htmlFor="company-name">Company Name</label>
                            <input type="text" name='company-name' id='company-name' placeholder='Company Names' />
                        </div>
                        <div className='form-div'>
                            <label htmlFor="job-title">Job Title</label>
                            <input type="text" name='job-title' id='job-title' placeholder='Job Title' />
                        </div>
                        <div className='form-div'>
                            <label htmlFor="uploader">Upload Resume</label>
                            <FileUploader onFileSelect={handleFileSelect}/>
                        </div>

                        <button className='primary-button' type='submit'>
                            Analyze Resume
                        </button>
                    </form>
                )}
            </div>
        </section>
    </main>
  )
}

export default upload
