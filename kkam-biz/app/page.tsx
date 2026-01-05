'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import LoadingState from '@/components/LoadingState';
import DownloadButtons from '@/components/DownloadButtons';

type ViewState = 'input' | 'loading' | 'result';

interface LoadingStep {
  label: string;
  completed: boolean;
}

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { label: '웹 리서치 진행 중...', completed: false },
    { label: '인사이트 정리 중...', completed: false },
    { label: 'PPT 생성 중...', completed: false },
    { label: 'Excel 생성 중...', completed: false },
  ]);
  const [pptUrl, setPptUrl] = useState<string>();
  const [excelUrl, setExcelUrl] = useState<string>();

  const handleSubmit = async (apiKey: string, topic: string) => {
    setIsLoading(true);
    setViewState('loading');

    try {
      // Step 1: 웹 리서치
      setLoadingSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, completed: false } : s));

      const researchRes = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, topic }),
      });

      if (!researchRes.ok) {
        throw new Error('리서치 실패');
      }

      const researchData = await researchRes.json();
      setLoadingSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, completed: true } : s));

      // Step 2: 인사이트 정리 (리서치에 포함되어 있으므로 바로 완료)
      setLoadingSteps((prev) => prev.map((s, i) => i === 1 ? { ...s, completed: true } : s));

      // Step 3: PPT 생성
      const pptRes = await fetch('/api/generate-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchData: researchData.data, topic }),
      });

      if (!pptRes.ok) {
        throw new Error('PPT 생성 실패');
      }

      const pptBlob = await pptRes.blob();
      const pptUrl = URL.createObjectURL(pptBlob);
      setPptUrl(pptUrl);
      setLoadingSteps((prev) => prev.map((s, i) => i === 2 ? { ...s, completed: true } : s));

      // Step 4: Excel 생성
      const excelRes = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchData: researchData.data, topic }),
      });

      if (!excelRes.ok) {
        throw new Error('Excel 생성 실패');
      }

      const excelBlob = await excelRes.blob();
      const excelUrl = URL.createObjectURL(excelBlob);
      setExcelUrl(excelUrl);
      setLoadingSteps((prev) => prev.map((s, i) => i === 3 ? { ...s, completed: true } : s));

      // 완료
      setViewState('result');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : '리서치 중 오류가 발생했습니다.');
      setViewState('input');
      resetLoadingSteps();
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewResearch = () => {
    setViewState('input');
    setPptUrl(undefined);
    setExcelUrl(undefined);
    resetLoadingSteps();
  };

  const resetLoadingSteps = () => {
    setLoadingSteps([
      { label: '웹 리서치 진행 중...', completed: false },
      { label: '인사이트 정리 중...', completed: false },
      { label: 'PPT 생성 중...', completed: false },
      { label: 'Excel 생성 중...', completed: false },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">KKAM_BIZ</h1>
          <p className="text-gray-600">키워드 입력 → AI 트렌드 리서치 → PPT + Excel 자동 생성</p>
        </header>

        {viewState === 'input' && (
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}

        {viewState === 'loading' && <LoadingState steps={loadingSteps} />}

        {viewState === 'result' && (
          <DownloadButtons
            pptUrl={pptUrl}
            excelUrl={excelUrl}
            onNewResearch={handleNewResearch}
          />
        )}
      </div>
    </div>
  );
}
