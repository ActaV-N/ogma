import { type MetaFunction } from '@remix-run/node';
import { Button } from '~components';

export const meta: MetaFunction = () => {
  return [{ title: 'Ogma - Welcome' }, { name: 'description', content: 'Welcome to Ogma' }];
};

export default function Index() {
  return (
    <div>
      <main className="h-screen">
        <div className="flex items-center justify-center h-full">
          <Button>새로운 주제 공부하기</Button>
        </div>
      </main>
    </div>
  );
}
