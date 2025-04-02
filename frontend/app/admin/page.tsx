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
  const [groups, setGroups] = useState<any>(null);
  const [doesTeacherExist, setDoesTeacherExist] = useState(false)
  const [groupName, setGroupName] = useState("")

  useEffect(() => {
    const role = userStoreState.getState().role;
    // if (role !== "admin") router.push("/");

    async function getUsers_Groups() {
      const response = await axiosInstance.get("/admin");
      setUsers(response.data.users);
      setGroups(response.data.groups);
      console.log(response.data.groups);
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
    let isUserInGroup: DroppableProps | boolean = false;

    isUserInGroup = group.find((user) => user._id === id) || false;

    if (user?.role === "teacher") {
      setDoesTeacherExist(true)
    }

    if (isUserInGroup) return toast.error("User already in group")

    if (user)
      setGroup([...group, user]);
  }
  async function createGroup() {
    if (groupName === "") return toast.error("Please enter group Name!!")
    if (group.length === 0) return toast.error("Please add at least one user to the group!!")
    if (!doesTeacherExist) return toast.error("please Add teacher to the group!!")

    const response = await axiosInstance.post("/writeGroups", { members: group, groupName })
    if (response.status === 200) {
      toast.success("Group created successfully")
    } else {
      toast.error("Error creating group")
    }
    setGroup([])
    setGroupName("")
    setDoesTeacherExist(false)
    setGroups([...groups, { members: group , groupName }])
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-200 min-h-screen w-full p-10 space-y-8">
      <DndContext onDragEnd={handleDragEnd}>
        {/* Teachers Section */}
        <div className="w-full max-w-3xl bg-white p-8 shadow-xl rounded-2xl border border-gray-300 ">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Teachers</h2>
          <div className="flex flex-wrap gap-4">
            {teachers.map((teacher) => (
              <UserDraggable key={teacher._id} _id={teacher._id} email={teacher.email} />
            ))}
          </div>
        </div>

        {/* Students Section */}
        <div className="w-full max-w-3xl bg-white p-8 shadow-xl rounded-2xl border border-gray-300 ">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Students</h2>
          <div className="flex flex-wrap gap-4">
            {students.map((student) => (
              <UserDraggable key={student._id} _id={student._id} email={student.email} />
            ))}
          </div>
        </div>

        {/* Group Creation Section */}
        <div className="w-full max-w-3xl bg-blue-100 p-8 shadow-xl rounded-2xl border border-blue-400 ">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h1 className="text-3xl font-extrabold text-blue-900">Create Group</h1>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Enter Group Name"
                className="bg-amber-200 p-2 rounded-md w-full sm:w-64 outline-none focus:ring-2 focus:ring-amber-400"
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button
                className="bg-amber-500 px-6 py-3 rounded-lg text-white font-semibold text-lg hover:bg-amber-600 transition-transform transform hover:scale-105"
                onClick={createGroup}
              >
                + Create Group
              </button>
            </div>
          </div>
          <MultipleDroppables users={group} setUsers={setUsers} />
        </div>
      </DndContext>

      {/* Groups Display Section */}
      <div className="w-full max-w-4xl bg-white p-8 shadow-2xl rounded-2xl border border-gray-300  ">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups && groups.length > 0 && groups.map((group: any, index: number) => (
            <div key={index} className="flex flex-col bg-gray-50 p-6 rounded-xl shadow-md border border-gray-300 hover:shadow-lg transition-transform transform hover:scale-105">
              <div className="flex flex-row justify-between mb-4 ">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">{group.groupName}</h3>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg ml-auto" onClick={() => {
                  setGroups(groups.filter((_, i: any) => i !== index));
                  const res = axiosInstance.post("/deleteGroups", { group });
                  toast.success("Group deleted successfully");
                }}>
                  Delete
                </button>
              </div>
              {/* Teachers First */}
              {group.members.filter((member: any) => member.role === "teacher").map((member: any) => (
                <div className="bg-indigo-500 text-white px-5 py-2 rounded-lg shadow-md text-center mb-2 font-medium" key={member._id}>
                  {member.email} <span className="text-sm opacity-75">(Teacher)</span>
                </div>
              ))}
              {/* Other Members */}
              {group.members.filter((member: any) => member.role !== "teacher").map((member: any) => (
                <div className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md text-center mb-2 font-medium" key={member._id}>
                  {member.email}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}