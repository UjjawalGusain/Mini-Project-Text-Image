import React from "react";
import DashboardHeader from "../headers/DashboardHeader";
import FloatingImage from "../FloatingImage/FloatingImage";
function Dashboard() {
  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden relvative">
      <DashboardHeader />

      <div className="flex-1 w-full flex items-center justify-center flex-col">
        <div className="relative flex justify-center items-center">
          
          {/* Animated Blur */}
          <div className="absolute h-96 w-96 opacity-50 bg-[#9FD2F3] blur-xl rounded-full animate-pulse-slow z-10"></div>

          {/* Main Content */}
          <div className="relative flex justify-center items-center flex-col z-30">
            <div className="text-xl font-medium">
              Tired of going through thousands of images?
            </div>
            <div className="flex justify-center items-center flex-col mt-4 gap-5">
              <div className="text-9xl font-bold text-center relative animate-text-move">
                PiXplorer
                <div className="text-lg text-gray-600 font-semibold text-right absolute right-10">
                  Find images through text
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingImage src="cat.jpg" alt="Cat" initialPositionIndex={0} />
      <FloatingImage src="photograph.jpg" alt="Photograph" initialPositionIndex={1}/>
      <FloatingImage src="kite.jpg" alt="Kite" initialPositionIndex={2}/>
      <FloatingImage src="clock.jpg" alt="Clock" initialPositionIndex={3}/>
    </div>
  );
}

export default Dashboard;
