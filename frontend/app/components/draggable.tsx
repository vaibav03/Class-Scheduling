import {useDraggable} from "@dnd-kit/core"
type DraggableProps = {
  _id: string;
  email: string;
}
const UserDraggable = ({ _id,email} : DraggableProps) =>{
 const {attributes,listeners,setNodeRef,transform} = useDraggable({
 id: _id
 })
 const style = transform ? {
  transform : `translate(${transform.x}px , ${transform.y}px)` ,
 } : undefined;
 return(
  <div ref={setNodeRef}
   style = {style}
   {...attributes}
   {...listeners}
   className= "bg-green-300 p-2 rounded"
   >
    {email}
   </div>
 )
}

export default UserDraggable;