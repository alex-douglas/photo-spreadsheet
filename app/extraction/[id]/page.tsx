import { ExtractionLoader } from "./extraction-loader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExtractionPage({ params }: PageProps) {
  const { id } = await params;
  return <ExtractionLoader id={id} />;
}
