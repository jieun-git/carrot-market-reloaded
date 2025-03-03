import Link from "next/link";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";

interface UsersProps {
  username: string;
  avatar?: string;
}

interface MessageProps {
  id: number;
  payload: string;
  created_at: Date;
  updated_at: Date;
  chatRoomId: string;
  userId: number;
  isRead: boolean;
}

interface ChatRoomListProps {
  id: string;
  users: UsersProps[];
  messages: MessageProps[];
  userId: number;
}

const ChatRoomList = ({ id, users, messages, userId }: ChatRoomListProps) => {
  const user = users[0];
  if (!user) return;

  const message = messages[0];

  return (
    <Link
      href={`/chats/${id}`}
      className="flex gap-5 p-5 items-center hover:opacity-80
      transition-opacity"
    >
      {user.avatar ? (
        <Image
          src={user.avatar || "/carrot.jpeg"}
          alt={user.username}
          width={50}
          height={50}
          className="rounded-full"
        />
      ) : (
        <UserIcon className="size-14 text-white" />
      )}
      <div>
        <h2 className="text-lg text-white">{user.username}</h2>
        {message && (
          <>
            <h3 className="text-sm text-neutral-500">
              <span className="text-neutral-400">
                {message.userId === userId ? "나" : user.username}
              </span>
              {message.payload}
            </h3>
          </>
        )}
      </div>
      {message && !message.isRead && message.userId !== userId && (
        <div className="size-2 rounded-full bg-white ml-auto" />
      )}
    </Link>
  );
};

export default ChatRoomList;
