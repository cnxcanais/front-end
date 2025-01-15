

export function PageHeader({ headName }: { headName: string }) {
  return (
    <div className='mt-3 mb-3 text-xl'>
      <h1>{headName}</h1>
    </div>
  );
}