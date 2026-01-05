import ExcelJS from 'exceljs';
import type { ResearchData } from './types';

export async function generateExcel(data: ResearchData, topic: string): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Sheet 1: 트렌드 요약
  const summarySheet = workbook.addWorksheet('트렌드_요약');

  // 헤더 스타일
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF1F4788' },
    },
    alignment: { vertical: 'middle' as const, horizontal: 'center' as const },
  };

  // 헤더 추가
  summarySheet.columns = [
    { header: '트렌드명', key: 'title', width: 30 },
    { header: '설명', key: 'description', width: 50 },
    { header: '중요도', key: 'importance', width: 10 },
    { header: '관련키워드', key: 'keywords', width: 30 },
  ];

  // 헤더 스타일 적용
  summarySheet.getRow(1).eachCell((cell) => {
    cell.style = headerStyle;
  });

  // 데이터 추가
  data.trends.forEach((trend) => {
    summarySheet.addRow({
      title: trend.title,
      description: trend.description,
      importance: trend.importance === 'high' ? '상' : trend.importance === 'medium' ? '중' : '하',
      keywords: trend.keywords.join(', '),
    });
  });

  // Sheet 2: 상세 데이터
  const detailSheet = workbook.addWorksheet('상세_데이터');

  detailSheet.columns = [
    { header: '주제', key: 'topic', width: 40 },
    { header: '트렌드 수', key: 'trendCount', width: 15 },
    { header: '생성일시', key: 'createdAt', width: 20 },
  ];

  detailSheet.getRow(1).eachCell((cell) => {
    cell.style = headerStyle;
  });

  detailSheet.addRow({
    topic,
    trendCount: data.trends.length,
    createdAt: new Date().toLocaleString('ko-KR'),
  });

  // Sheet 3: 출처 목록
  const sourceSheet = workbook.addWorksheet('출처_목록');

  sourceSheet.columns = [
    { header: 'URL', key: 'url', width: 50 },
    { header: '제목', key: 'title', width: 40 },
    { header: '신뢰도', key: 'reliability', width: 10 },
  ];

  sourceSheet.getRow(1).eachCell((cell) => {
    cell.style = headerStyle;
  });

  data.sources.forEach((source) => {
    sourceSheet.addRow({
      url: source.url,
      title: source.title,
      reliability: source.reliability === 'high' ? '상' : source.reliability === 'medium' ? '중' : '하',
    });
  });

  // Sheet 4: 시사점
  const insightSheet = workbook.addWorksheet('시사점');

  insightSheet.columns = [
    { header: '순번', key: 'index', width: 10 },
    { header: '시사점', key: 'insight', width: 80 },
  ];

  insightSheet.getRow(1).eachCell((cell) => {
    cell.style = headerStyle;
  });

  data.insights.forEach((insight, index) => {
    insightSheet.addRow({
      index: index + 1,
      insight,
    });
  });

  // Buffer로 변환
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
