import { Avatar, AvatarFallback, AvatarImage } from '~components/ui/avatar';
import { TypeAnimation } from 'react-type-animation';
import { Message } from '~models';

function Chat(props: { message: Partial<Message>; animate?: boolean }) {
  const { message, animate = false } = props;

  return (
    <div className="flex flex-col gap-2">
      <Avatar className={`size-8 ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
        <AvatarImage src={message.role === 'assistant' ? '/assets/images/socrates.png' : ''} />
        <AvatarFallback>Y</AvatarFallback>
      </Avatar>
      {animate ? (
        <TypeAnimation
          sequence={[message.content?.replace(/<br>/g, '\n') || '']}
          speed={50}
          cursor={false}
          className={`p-2 rounded-md shadow-md bg-slate-400 self-start max-w-md`}
        />
      ) : (
        <div
          className={`py-2 px-3 rounded-md shadow-md bg-${message.role === 'user' ? 'white' : 'slate-400'} ${message.role === 'user' ? 'self-end' : 'self-start'} max-w-md break-keep`}
        >
          {message.content?.split('<br>').map((text, index, array) => (
            <span key={index}>
              {text}
              {index < array.length - 1 && <br />}
            </span>
          )) || <l-bouncy size="24" speed="1.25" color="rgb(71 85 105)"></l-bouncy>}
        </div>
      )}
    </div>
  );
}

export { Chat };
export default Chat;
