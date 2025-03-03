import db from "@/lib/db";
import { unstable_cache as nextCache } from "next/cache";
import getSession from "@/lib/session";
import ChatRoomList from "@/components/chat-room-list";

const getChats = async (userId: number) => {
  const chats = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      messages: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
      },
      users: {
        where: {
          id: {
            not: userId,
          },
        },
        select: {
          avatar: true,
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return chats;
};

const getCachedChats = nextCache(getChats, ["chat-list"], {
  tags: ["chat-list"],
});

const Chat = async () => {
  const session = await getSession();
  const chats = await getCachedChats(session.id!);
  return (
    <div>
      <h1 className="text-white text-4xl">Chats</h1>
      {chats.map((chat) => (
        <ChatRoomList
          key={chat.id}
          id={chat.id}
          users={chat.users}
          messages={chat.messages}
          userId={session.id!}
        />
      ))}
    </div>
  );
};

export default Chat;
