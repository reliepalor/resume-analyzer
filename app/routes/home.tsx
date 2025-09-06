import NavBar from "~/components/NavBar";
import {useEffect} from 'react';
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuAI" },
    { name: "description", content: "Smart feedback for you dream job." },
  ];
}

export default function Home() {
    const {auth} = usePuterStore();
    const navigate = useNavigate();


    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <div className="flex justify-center items-center">
       <NavBar/>
    </div>

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Stay on Top of Your Applications & Resume Reviews</h1>
          <h2>See how your submissions perform with smart AI feedback.</h2>
        </div>
        {resumes.length > 0 && 
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume}/>
            ))}          
          </div>      
        }
      </section>





    </main>
}
