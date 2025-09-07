import { Card } from '@/components/ui/card';
import { Fragment, MessageRole, MessageType } from '@/generated/prisma';
import { cn } from '@/lib/utils';
import React from 'react';
import { format } from 'date-fns'
import { ChevronRightIcon, Code, Drama } from 'lucide-react';
interface MessageCardProps {
    type: MessageType
    role: MessageRole
    fragment: Fragment | null
    createdAt: Date
    isActiveFragment: boolean
    onFragmentClick: (fragment: Fragment) => void
    content: string
}


interface UserMessageProps {
    content: string
}


interface AssistantMessageProps {

    fragment: Fragment | null
    createdAt: Date
    isActiveFragment: boolean
    onFragmentClick: (fragment: Fragment) => void
    content: string
    type: MessageType
}

interface FragmentCardProps {

    fragment: Fragment | null

    isActiveFragment: boolean
    onFragmentClick: (fragment: Fragment) => void

}

const MessageCard = ({ role, fragment, createdAt, isActiveFragment, onFragmentClick, content, type }: MessageCardProps) => {

    if (role === "ASSISTANT") {
        return <AssistantMessage
            fragment={fragment}
            createdAt={createdAt}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
            content={content}
            type={type}
        />
    }
    return (
        <div>
            <UserMessage content={content} />
        </div>
    );
};



const UserMessage = ({ content }: UserMessageProps) => {
    return <div className='flex justify-end pb-4 pr-2 pl-10' >
        <Card className='rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words'>
            {content}
        </Card>
    </div>
}
const AssistantMessage = ({ content, fragment, createdAt, isActiveFragment, type, onFragmentClick }: AssistantMessageProps) => {
    return <div className={cn("flex flex-col group px-2 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500"
    )} >
        <div className='flex items-center gap-2 pl-2 mb-2'>
            <Drama color="#8301a7" />
            <span className='text-sm font-medium'>
                Vibe
            </span>
            <span className='text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'>
                {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
            </span>
        </div>
        <div className='pl-8.5 flex flex-col gap-y-4'>
            <span>
                {content}
            </span>
            {
                fragment && type === 'RESULT' && <FragmentCard
                    fragment={fragment}

                    isActiveFragment={isActiveFragment}
                    onFragmentClick={onFragmentClick}
                />
            }

        </div>
    </div>
}


const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }: FragmentCardProps) => {
    return <button
        onClick={() => fragment && onFragmentClick(fragment)}
        className={cn("flex items-start text-start gap-2 rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",

            isActiveFragment && "bg-primary text-primary-foreground border-primary  hover:bg-primary"

        )}>
        <Code className='size-4 mt-0.5' />
        <div className='flex flex-col flex-1'>
            <span className=' text-sm font-medium line-clamp-1'>
                {fragment?.title}
            </span>
            <span className='text-sm'>
                preview
            </span>
        </div>
        <div className='flex- items-center justify-center mt-0.5'>
            <ChevronRightIcon className='size-4' />
        </div>
    </button>
}
export default MessageCard;