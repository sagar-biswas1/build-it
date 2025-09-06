"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';
import { toast } from 'sonner';

const Page = () => {

  const router = useRouter()
  const [inputValue, setInputValue] = useState('');
  const trpc = useTRPC()



  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onSuccess(data) {
      router.push(`/projects/${data.id}`)
      toast.success("Message Created")
    },
    onError(error) {
      toast.error(error.message)
    }
  }))
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className='max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center'>

        <Input placeholder="Type something..." className="mb-4"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          disabled={createProject.isPending}
          onClick={() => {
            createProject.mutate({ value: inputValue })
          }}>
          Submit
        </Button>

        {

        }
      </div>
    </div>
  );
};

export default Page;