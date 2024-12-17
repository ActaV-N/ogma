import { ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~components/ui/button';
import { useAnimatedLoading } from '~hooks';
import { cn } from '~libs/utils';
import { conversationRepository } from '~repositories';

export const meta: MetaFunction = () => {
  return [{ title: 'Ogma - Welcome' }, { name: 'description', content: 'Welcome to Ogma' }];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;

  if (title.trim() === '') {
    return { errors: '주제를 입력해 주세요', success: false, id: null };
  }

  const result = await conversationRepository.create({ title, modelType: 'discussion' });

  return { success: true, id: result.id, errors: null };
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  const [helperText, setHelperText] = useState('');
  const navigate = useNavigate();
  const { loading, success, error, completed } = useAnimatedLoading('submitting', {
    minimumLoadingDuration: 500,
    stateDuration: 1000,
    success: actionData?.success,
    onLoadingStart: () => {
      setHelperText('여러분의 토론 메이트를 생성중입니다. 잠시만 기다려주세요 😎');
    },
    onError: () => {
      setHelperText(actionData?.errors || '');
    },
    onSuccess: () => {
      setHelperText('잠시 후, 새로운 토론을 시작합니다. 🎊');
    },
    onComplete: () => {
      if (actionData?.success && actionData.id) {
        navigate(`/chats/${actionData.id}`);
      }
    },
  });

  return (
    <div>
      <main className="h-screen">
        <div className="flex flex-col justify-center items-center gap-2 h-full py-4 pr-4">
          <Form
            method="post"
            className={`relative transition-opacity duration-200 ease-in-out flex flex-col justify-center items-center gap-2 w-full ${
              completed ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <input
              type="text"
              name="title"
              className="transition-shadow duration-200 ease-in-out text-center bg-white rounded-full pl-4 pr-2 py-2 outline-none text-stone-800 shadow-md focus-within:shadow-sm w-full max-w-md"
              placeholder="공부하고싶은 주제를 입력해 주세요"
            />
            <Button variant="outline" type="submit" loading={loading} success={success}>
              AI 친구와 토론하기
            </Button>
            <div
              className={cn(
                'transition-opacity duration-200 ease-in-out absolute -bottom-[2rem]',
                error || loading || success ? 'opacity-100' : 'opacity-0',
                error ? 'text-red-500' : 'text-gray-500'
              )}
            >
              {helperText}
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
