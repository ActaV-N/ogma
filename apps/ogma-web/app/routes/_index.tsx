import { ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { Button } from '~components/ui/button';
import { useAnimatedLoading, useSubmitting } from '~hooks';
import { conversationRepository } from '~repositories';

export const meta: MetaFunction = () => {
  return [{ title: 'Ogma - Welcome' }, { name: 'description', content: 'Welcome to Ogma' }];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const result = await conversationRepository.create({ title, modelType: 'discussion' });

  return { success: true, id: result.id };
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const { loading } = useSubmitting();
  const { showLoading, showSuccess, completed } = useAnimatedLoading(loading, {
    loadingDuration: 500,
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
          <Form method="post" className="flex flex-col justify-center items-center gap-2 w-full">
            <input
              type="text"
              name="title"
              className="transition-shadow duration-200 ease-in-out text-center bg-white rounded-full pl-4 pr-2 py-2 outline-none text-stone-800 shadow-md focus-within:shadow-sm w-full max-w-md"
              placeholder="공부하고싶은 주제를 입력해 주세요"
            />
            <Button type="submit">AI 친구와 토론하기</Button>
          </Form>
        </div>
      </main>
    </div>
  );
}
