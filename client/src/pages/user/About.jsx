import { useState, useEffect } from "react";
import Joshua from "../../assets/Anggota/JoshuaCalvin.png";
import Gibran from "../../assets/Anggota/gibran.jpg";
import Gracia from "../../assets/Anggota/gracia.jpg";

export default function About() {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  const members = [
    { 
        name: "Joshua Calvin Siahaan - IBDA", 
        nim: "222200129", 
        image: Joshua,
        linkedin: 'https://www.linkedin.com/in/joshua-calvin-12a7a2319/',
        github: 'https://github.com/jocalvinshua',
        instagram: 'https://www.instagram.com/jocalvinshua/'
    },
    {
      name: "Gracia Naimora Samosir - IBDA",
      nim: "222100986",
      image:
        Gracia,
        github: 'https://github.com/cia2003/',
        linkedin: 'https://www.linkedin.com/in/gracia-naimora-samosir/'
    },
    {
      name: "Filbert Jonathan - IBDA",
      nim: "222200129",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&auto=format&fit=crop",
    },
    {
      name: "Josh Gibran Chandlerson - IBDA",
      nim: "242301743",
      image:
        Gibran,
        instagram: 'https://www.instagram.com/cndlrsn_/',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
      setStartIndex(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = members.length - visibleCount;
  const visibleMembers = members.slice(startIndex, startIndex + visibleCount);

  return (
    <>
      <style>
        {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    *{
                        font-family: "Geist", sans-serif;
                    }
                `}
      </style>

      <section className="bg-slate-50 py-16 px-6">
        <div className="text-center mb-11">
          <h1 className="text-[42px] font-medium text-slate-900 tracking-tighter">
            PABP IBDA Kelompok 1
          </h1>
          <p className="text-base/6 italic text-slate-500 max-w-md mx-auto mt-1">
            "Just make it exist first, You can make it good later."
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8">
          <button
            onClick={() => setStartIndex((prev) => prev - 1)}
            disabled={startIndex === 0}
            className={`size-10 rounded-full border border-slate-200 flex items-center justify-center shrink-0 transition-opacity ${startIndex === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m15 18-6-6 6-6"
                stroke="#90A1B9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex gap-5">
            {visibleMembers.map((member, i) => (
              <div
                key={startIndex + i}
                className="bg-white border border-slate-100 hover:border-slate-300 transition-colors rounded-xl p-5"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-[clamp(180px,50vw,245px)] w-full object-cover object-top rounded-lg"
                />
                <h3 className="text-base font-medium text-slate-800 mt-4">
                  {member.name}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">{member.nim}</p>
                <div className="flex gap-3 mt-4">
                  <a
                    href={member.linkedin}
                    className="size-10 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a
                    href={member.github}
                    className="size-10 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </a>
                  <a
                    href={member.instagram}
                    className="size-10 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.167 1.656H5.833c-2.3 0-4.166 1.853-4.166 4.138v8.276c0 2.286 1.865 4.138 4.166 4.138h8.334c2.3 0 4.166-1.852 4.166-4.138V5.794c0-2.285-1.865-4.138-4.166-4.138"
                        stroke="#1d293d"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.333 9.41a3.3 3.3 0 0 1-.338 2.011 3.32 3.32 0 0 1-1.46 1.432 3.35 3.35 0 0 1-3.856-.616 3.29 3.29 0 0 1-.62-3.83c.315-.62.82-1.128 1.442-1.449a3.35 3.35 0 0 1 3.892.598c.506.502.835 1.152.94 1.855"
                        stroke="#1d293d"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.583 5.383h.01"
                        stroke="#1d293d"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStartIndex((prev) => prev + 1)}
            disabled={startIndex === maxIndex}
            className={`size-10 rounded-full border border-slate-200 flex items-center justify-center shrink-0 transition-opacity ${startIndex === maxIndex ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m9 18 6-6-6-6"
                stroke="#90A1B9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}