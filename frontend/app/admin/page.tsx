"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "../axiosInstance";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import UserDraggable from "../components/draggable"
import MultipleDroppables, { DroppableProps } from "../components/droppable";
import { toast } from "react-hot-toast"
import userStoreState from "../store/userStore";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState<DroppableProps[]>([]);
  const [teachers, setTeachers] = useState<DroppableProps[]>([]);
  const [students, setStudents] = useState<DroppableProps[]>([]);
  const [group, setGroup] = useState<DroppableProps[]>([]);
  const [groups, setGroups] = useState([])
  useEffect(()=>{
    const role = userStoreState.getState().role;
    if(role!=="admin") router.push("/");

    async function getUsers_Groups(){
      const response = await axiosInstance.get("/admin");
      console.log(response)
      setUsers(response.data.users);
      setGroups(response.data.groups);
      const newStudents = users.filter((user) => user.role === "student")
      setStudents(newStudents)

      const newTeachers = users.filter((user) => user.role === "teacher")
    }

    getUsers_Groups();

  },[])
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const id = active.id;

    console.log(id)

    const user  = users.find((user) => user._id === id );
    if(user)
    setGroup((prev) => [...prev,user])
    

    console.log(group)
  }

  // useEffect(() => {

  //   async function getUsers() {
  //     const response = await axiosInstance.get("/getUsers",)
  //     setUsers(response.data.users);
  //     users.map((user) => {
  //       if (user.role === "teacher")
  //         setTeachers((prev) => [...prev, user]);

  //       if (user.role === "student")
  //         setStudents((prev) => [...prev, user]);
  //     })
  //     setStudents(response.data.students);
  //     setGroups(response.data.groups);

  //   }

  //   getUsers();
  // }, [])


  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center bg-[#FAF3E0] h-screen w-full p-6">

        <div className="w-full max-w-3xl bg-white p-4 shadow-lg rounded-lg mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Teachers</h2>
          <div className="flex flex-wrap gap-3">
            {teachers.map((teacher) => (
              <UserDraggable key={teacher._id} _id={teacher._id} email={teacher.email} />
            ))}
          </div>
        </div>

        <div className="w-full max-w-3xl bg-white p-4 shadow-lg rounded-lg mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Students</h2>
          <div className="flex flex-wrap gap-3">
            {students.map((student) => (
              <UserDraggable key={student._id} _id={student._id} email={student.email} />
            ))}
          </div>
        </div>


        <div className="w-full max-w-3xl bg-blue-100 p-6 shadow-md rounded-lg border border-blue-400">
          <h1 className="text-xl font-bold text-blue-800 mb-3">Create Group</h1>
          <MultipleDroppables users={group} setUsers = {setUsers} />
        </div>
      </div>
    </DndContext>

  );
}

