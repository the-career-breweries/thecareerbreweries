import ModulePlayer from '@/components/ModulePlayer';

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ModulePlayer slug={slug} />;
}
