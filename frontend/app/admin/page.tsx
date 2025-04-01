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
  const [doesTeacherExist, setDoesTeacherExist] = useState(false)

  useEffect(() => {
    const role = userStoreState.getState().role;
    if (role !== "admin") router.push("/");

    async function getUsers_Groups() {
      const response = await axiosInstance.get("/admin");

      setUsers(response.data.users);
      setGroups(response.data.groups || []);
    }
    getUsers_Groups();
  }, [])

  useEffect(() => {
    const newStudents = users.filter((user) => user.role === "student")
    setStudents(newStudents)

    const newTeachers = users.filter((user) => user.role === "teacher")
    setTeachers(newTeachers as DroppableProps[])
  }, [users])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const id = active.id;


    const user = users.find((user) => user._id === id);
    let isUserInGroup : DroppableProps | boolean = false;
    
    isUserInGroup = group.find((user) => user._id === id) || false;

    if (user?.role === "teacher") {
      setDoesTeacherExist(true)
    }

    if(isUserInGroup) return toast.error("User already in group")
    
    if(user)
    setGroup([...group, user]);

        
  }
 async function createGroup(){
    if (group.length === 0) return toast.error("Please add at least one user to the group!!")
    if(!doesTeacherExist) return toast.error("please Add teacher to the group!!")

    const response = await axiosInstance.post("/writeGroups", { members : group })
    if (response.status === 200) {
      toast.success("Group created successfully")
    } else {
      toast.error("Error creating group")
    }
  }
 
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
          <div className="flex flex-row justify-between">
            <h1 className="text-xl font-bold text-blue-800 mb-3">Create Group</h1>
            <button className="bg-amber-500 px-4 py-2 rounded-md text-white mb-3"  onClick={createGroup}>Create group</button>
          </div>
          <MultipleDroppables users={group} setUsers={setUsers} />
        </div>
      </div>
    </DndContext>

  );

}