"use client";

import { useState, useEffect } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { days } from "../../utils/data.js";
import { motion } from "framer-motion";
import { axiosInstance } from "../axiosInstance";

export default function Page() {
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [day, setDay] = useState<string>("");

 

  const handleSchedule = () => {
    if (!day || !startTime || !endTime) {
      alert("Please select a day and time.");
      return;
    }
    if (endTime.isBefore(startTime)) {
      alert("End time must be after start time.");
      return;
    }

    console.log({
      day,
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    });

    alert("Class scheduled successfully!");
  };

  async function createClassSchedule(){
    // Function to create class schedule
    const classSchedule = {
      day: day,
      startTime: startTime?.format("HH:mm"),
      endTime: endTime?.format("HH:mm"),
    };

    const response  = await axiosInstance.post("/createSchedule", classSchedule);
    if(response.status == 200){
      console.log("Class Schedule Created:", classSchedule);
    // Here you can send the classSchedule to your backend or perform any other action
    alert("Class scheduled successfully!");
    }else{
      alert("NOt created")
    }

    
  }
  return (
    <div className="min-h-screen flex items-center justify-around bg-amber-100 ">
      <div className="flex flex-col shadow-2xl bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 max-w-lg w-full font-semibold ">
        <h1 className="text-2xl font-bold mb-4 text-center">📌 Scheduled Classes</h1>
        {[
          { day: "Monday", time: "10:00 - 12:00" },
          { day: "Wednesday", time: "14:00 - 16:00" },
        ].map((schedule, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-lg shadow-lg mb-3"
          >
            <div className="flex flex-col">
              <span className="text-lg">{schedule.day}</span>
              <span className="text-sm text-gray-300">{schedule.time}</span>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
              ❌ Cancel
            </button>
          </div>
        ))}
      </div>

      <motion.div
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-lg w-full text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-center mb-6">📅 Schedule a Class</h1>

        <div className="mb-5">
          <label className="block text-lg font-semibold mb-2">Choose a Day</label>
          <select
            className="w-full p-3 rounded-lg bg-white text-gray-800 focus:outline-none shadow-md"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Select a day</option>
            {days.map((dayOption) => (
              <option key={dayOption} value={dayOption}>
                {dayOption}
              </option>
            ))}
          </select>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              className="w-full"
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              className="w-full"
            />
          </div>
        </LocalizationProvider>


        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all"
          onClick={handleSchedule}
          disabled={!day || !startTime || !endTime}
        >
          Schedule Class
        </motion.button>
      </motion.div>
    </div>
  );
}
