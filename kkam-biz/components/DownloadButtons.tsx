'use client';

interface DownloadButtonsProps {
  pptUrl?: string;
  excelUrl?: string;
  onNewResearch: () => void;
}

export default function DownloadButtons({ pptUrl, excelUrl, onNewResearch }: DownloadButtonsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-600">✅ 리서치 완료!</h2>
      </div>

      <div className="space-y-4">
        {pptUrl && (
          <a
            href={pptUrl}
            download
            className="block w-full px-6 py-4 bg-blue-600 text-white text-center font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            📊 트렌드_요약.pptx 다운로드
          </a>
        )}

        {excelUrl && (
          <a
            href={excelUrl}
            download
            className="block w-full px-6 py-4 bg-green-600 text-white text-center font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            📈 트렌드_데이터.xlsx 다운로드
          </a>
        )}

        <button
          onClick={onNewResearch}
          className="w-full px-6 py-4 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
        >
          새로운 리서치 시작
        </button>
      </div>
    </div>
  );
}
