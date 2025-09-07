import { Fragment } from '@/generated/prisma';
import React from 'react';

interface Props {
    data: Fragment
}

const FragmentWeb = ({ data }: Props) => {
    return (
        <div className='flex flex-col w-full h-full'>
            <iframe
                className='h-full w-full'
                sandbox='allow-forms allow-scripts allow-same-origin'
                loading='lazy'
                src={data.sandboxUrl}
            />
        </div>
    );
};

export default FragmentWeb;