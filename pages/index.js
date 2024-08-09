import Head from 'next/head';
import { useState } from 'react';
import Modal from '../components/Modal';





export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [skills, setSkills] = useState('');
  const [profession, setProfession] = useState('');
  const [recommendedStream, setRecommendedStream] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
 

        
        body: JSON.stringify({ skills, occupation: profession }),
      });

      log({ skills, occupation: profession });
      log(response);

      const data = await response.json();
      if (response.ok) {
        setRecommendedStream(data.predicted_stream);
      } else {
        console.error('Error:', data.error);
        setRecommendedStream('An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setRecommendedStream('An error occurred');
    }
  };
  // const handleSubmit = () => {
  //   // Here you would typically make an API call to get the recommendation
  //   setRecommendedStream('Your recommended A/L stream');
  // };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Head>
        <title>A/L Stream Recommendation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex justify-between items-center p-4 bg-gray-800 w-full">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" />
          <div className="text-xl font-bold">A/L STREAM RECOMMENDATION</div>
        </div>
        <nav className="space-x-4">
          <a href="#" className="hover:underline">HOME</a>
          <a href="#" className="hover:underline">ABOUT</a>
          <a href="#" className="hover:underline">CONTACT</a>
          <button className="bg-blue-600 px-4 py-2 rounded">SIGNIN</button>
          <button className="bg-blue-600 px-4 py-2 rounded">REGISTER</button>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center py-20 px-4 relative">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/background.jpeg')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-1"></div>

        {/* Content overlay */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-white text-sm font-bold mb-2">A/L STREAM RECOMMENDATION</div>
          <h1 className="text-5xl font-bold mb-4">WELCOME TO YOUR FUTURE</h1>
          <p className="text-xl mb-8">
            Empowering students to make informed advanced level stream choices.
          </p>
          <button
            className="bg-blue-600 px-6 py-3 rounded text-lg mb-8"
            onClick={() => setShowModal(true)}
          >
            START <span className="ml-2">&#x279C;</span>
          </button>

          <div className="flex flex-col items-center mt-8">
            <h2 className="text-3xl font-bold mb-4">WHY CHOOSE US?</h2>
            <div className="flex flex-wrap justify-center space-x-4">
              <div className="bg-blue-600 rounded-lg flex items-center p-3 w-64 m-2">
                <div className="bg-blue-500 rounded-full p-2 mr-3">
                  <img src="/data-icon.png" alt="Data-Driven Insights" className="w-6" />
                </div>
                <p className="text-sm font-semibold">DATA-DRIVEN INSIGHTS</p>
              </div>
              <div className="bg-blue-600 rounded-lg flex items-center p-3 w-64 m-2">
                <div className="bg-blue-500 rounded-full p-2 mr-3">
                  <img src="/person-icon.png" alt="Personalized Recommendation" className="w-6" />
                </div>
                <p className="text-sm font-semibold flex-1 text-left">PERSONALIZED RECOMMENDATION</p>
              </div>
              <div className="bg-blue-600 rounded-lg flex items-center p-3 w-64 m-2">
                <div className="bg-blue-500 rounded-full p-2 mr-3">
                  <img src="/career-icon.png" alt="Career Guidance" className="w-6" />
                </div>
                <p className="text-sm font-semibold">CAREER GUIDANCE</p>
              </div>
            </div>
          </div>
        </div>
      </main>

       <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-bold mb-4 text-center">
          ADVANCED LEVEL STREAM SELECTION WITH ENTREPRENEURIAL INSIGHTS
        </h2>
        <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
          <select
            className="w-full md:w-1/2 p-2 mb-2 md:mb-0 border border-gray-300 rounded"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          >
            <option value="">Select Skills</option>
            <option value="Communication">Communication</option>
            <option value="Leadership">Leadership</option>
            <option value="Problem-Solving">Problem-Solving</option>
            <option value="Technical Skill">Technical Skill</option>
            <option value="Critical Thinking">Critical Thinking</option>
            <option value="Organizational Skills">Organizational Skills</option>
            <option value="Creativity">Creativity</option>
            <option value="Marketing">Marketing</option>
            <option value="Accounting">Accounting</option>
            <option value="Art Skills (Dancing, Singing)">Art Skills (Dancing, Singing)</option>
          </select>
          <select
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          >
            <option value="">Select Your Passionate Profession</option>
            <option value="Engineer">Engineer</option>
            <option value="Doctor">Doctor</option>
            <option value="Artist">Artist</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Scientist">Scientist</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-blue-400 px-4 py-2 rounded"
            onClick={() => setShowModal(false)}
          >
            CANCEL
          </button>
          <button
            className="bg-blue-600 px-4 py-2 rounded text-white"
            onClick={handleSubmit}
          >
            SUBMIT
          </button>
        </div>
        {recommendedStream && (
          <div className="mt-4 text-center">
            <p>BASED ON YOUR RESPONSES, WE RECOMMEND THE FOLLOWING A/L STREAM</p>
            <div className="bg-blue-200 text-blue-800 p-2 rounded mt-2">
              {recommendedStream}
            </div>
          </div>
        )}
      </Modal>

      <footer className="bg-gray-800 p-6 mt-auto">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-white text-lg font-bold mb-2">A/L Stream Recommendation</h2>
            <p className="text-gray-400">Empowering students to make informed advanced level stream choices.</p>
          </div>
          <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
            <nav className="space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">FAQ</a>
              <a href="#" className="text-gray-400 hover:text-white">Feedback</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            </nav>
          </div>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <div className="space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-4 text-center">
          <p className="text-gray-400">&copy; 2024 A/L Stream Recommendation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
