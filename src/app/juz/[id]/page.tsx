import JuzClient from "./JuzClient";

export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <JuzClient id={params.id} />;
}
