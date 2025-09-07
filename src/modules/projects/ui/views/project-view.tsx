"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React, { Suspense, useState } from 'react';
import MessagesContainer from '../components/messages-container';
import { Fragment } from '@/generated/prisma';
import FragmentWeb from '../components/fragment-web';
import ProjectHeader from '../components/project-header';

interface Props {
    projectId: string
}

const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)

    return (
        <div className='h-screen'>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel defaultSize={35}
                    minSize={20}
                    className='flex flex-col min-h-0'
                >
                    <Suspense fallback={"Loading"}>
                        <ProjectHeader projectId={projectId} />
                    </Suspense>
                    <Suspense fallback={"Loading messages"}>
                        <MessagesContainer projectId={projectId}
                            activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={65}
                    minSize={50}
                    className='flex flex-col min-h-0'
                >
                    {
                        !!activeFragment && <FragmentWeb data={activeFragment} />
                    }
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    );
};

export default ProjectView;