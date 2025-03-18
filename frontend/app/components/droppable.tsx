import React, { Dispatch, SetStateAction } from "react";
import { useDroppable } from "@dnd-kit/core";
import { X } from "lucide-react"
export interface DroppableProps {
  _id: string;
  email: string;
  role : string;
}

function Droppable({ _id, email }: DroppableProps) {
  const { setNodeRef } = useDroppable({
    id: _id,
  });

  return (
    <div ref={setNodeRef}>
      {email}
    </div>
  );
}

export default function MultipleDroppables({ users , setUsers }: { users: DroppableProps[] , setUsers: Dispatch<SetStateAction<DroppableProps[]>> }) {
  const { setNodeRef } = useDroppable({
    id: "group-droppable",
  });

  return (
    <div ref={setNodeRef} className="bg-blue-100 p-4 rounded-md border border-blue-400 w-full min-h-[100px] flex flex-wrap gap-2">
      {users.length === 0 ? (
        <p className="text-gray-500">Drop users here</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="bg-green-300 p-2 rounded-md shadow">
            <button className="top-0 left-0" onClick={() => {
              console.log("clicked")
              const newUsers = users.filter((u) => u._id !== user._id);
              console.log(newUsers)
              setUsers(newUsers);
              console.log(users)
            }}> <X/></button>
            {user.email}
          </div>
        ))
      )}
    </div>
  );
}
