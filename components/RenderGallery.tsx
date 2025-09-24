import React from 'react';

const embeds = [
  {
    title: 'Tibia Humana (Muscular)',
    iframeSrc: "https://sketchfab.com/models/2ff28ae5d41b42b1ab6a019f1f3b1586/embed",
    iframeTitle: "The Podiatrist's Leg",
    modelLink: "https://sketchfab.com/3d-models/the-podiatrists-leg-2ff28ae5d41b42b1ab6a019f1f3b1586?utm_medium=embed&utm_campaign=share-popup&utm_content=2ff28ae5d41b42b1ab6a019f1f3b1586",
    modelName: "The Podiatrist's Leg",
    authorLink: "https://sketchfab.com/SadLittleKing?utm_medium=embed&utm_campaign=share-popup&utm_content=2ff28ae5d41b42b1ab6a019f1f3b1586",
    authorName: "SadLittleKing",
  },
  {
    title: 'Tibia Humana (Óseo)',
    iframeSrc: "https://sketchfab.com/models/fc18a6eb429c40e8ab1c1c28d7101b9d/embed",
    iframeTitle: "Leg Skeleton | Leg Bones | Human Leg",
    modelLink: "https://sketchfab.com/3d-models/leg-skeleton-leg-bones-human-leg-fc18a6eb429c40e8ab1c1c28d7101b9d?utm_medium=embed&utm_campaign=share-popup&utm_content=fc18a6eb429c40e8ab1c1c28d7101b9d",
    modelName: "Leg Skeleton | Leg Bones | Human Leg",
    authorLink: "https://sketchfab.com/omkarbonline?utm_medium=embed&utm_campaign=share-popup&utm_content=fc18a6eb429c40e8ab1c1c28d7101b9d",
    authorName: "omkarb",
  },
  {
    title: 'Prótesis Trans-tibial',
    iframeSrc: "https://sketchfab.com/models/cbd217398f2e41b3b01451ad0536d0a6/embed",
    iframeTitle: "Ugani - Transtibial prosthetic model",
    modelLink: "https://sketchfab.com/3d-models/ugani-transtibial-prosthetic-model-cbd217398f2e41b3b01451ad0536d0a6?utm_medium=embed&utm_campaign=share-popup&utm_content=cbd217398f2e41b3b01451ad0536d0a6",
    modelName: "Ugani - Transtibial prosthetic model",
    authorLink: "https://sketchfab.com/uganiprosthetics?utm_medium=embed&utm_campaign=share-popup&utm_content=cbd217398f2e41b3b01451ad0536d0a6",
    authorName: "uganiprosthetics",
  }
];

const RenderGallery: React.FC = () => {
  return (
    <div className="p-2 md:p-0 lg:p-0 grid grid-cols-1 xl:grid-cols-3 gap-6">
      {embeds.map((embed) => (
        <div key={embed.title} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex-shrink-0">{embed.title}</h3>
          <div className="flex-grow flex flex-col min-h-0">
            <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                title={embed.iframeTitle}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src={embed.iframeSrc}
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 'normal', margin: '10px 0 5px 0', color: '#4A4A4A' }}>
              <a href={embed.modelLink} target="_blank" rel="nofollow" style={{ fontWeight: 'bold', color: '#1CAAD9' }}>
                {embed.modelName}
              </a> by{' '}
              <a href={embed.authorLink} target="_blank" rel="nofollow" style={{ fontWeight: 'bold', color: '#1CAAD9' }}>
                {embed.authorName}
              </a> on{' '}
              <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup" target="_blank" rel="nofollow" style={{ fontWeight: 'bold', color: '#1CAAD9' }}>
                Sketchfab
              </a>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderGallery;
