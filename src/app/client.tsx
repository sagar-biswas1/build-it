"use client";
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';

const Client = () => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.hello.queryOptions({ text: "from tRPC in Client Component" }))
    return (
        <div>
            {data.greeting}
        </div>
    );
};

export default Client;