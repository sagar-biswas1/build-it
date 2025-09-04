"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'sonner';

const Page = () => {
  const [inputValue, setInputValue] = useState('');
  const trpc = useTRPC()
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions())


  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess(data) {
      toast.success("Message Created")
    },
    onError(error) {
      console.log("error", error)
    }
  }))
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <div>
        <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
        <p>Welcome to your Next.js application.</p>
        <Input placeholder="Type something..." className="mb-4"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={() => {
          createMessage.mutate({ value: inputValue })
        }}>
          Invoke bg job
        </Button>

        {

        }
      </div>
    </div>
  );
};

export default Page;