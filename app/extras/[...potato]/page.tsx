export default function Extras({ params }: { params: { potato: string[] } }) {
  return (
    <div className="flex flex-col gap-3 p-12">
      <h1 className="text-6xl font-metallica">Extras!</h1>
      <h2 className="font-rubik">So much more to learn!</h2>
    </div>
  );
}
