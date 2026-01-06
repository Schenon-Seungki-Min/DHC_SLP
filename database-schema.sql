-- 병원 영업 관리 시스템 Database Schema
-- Supabase PostgreSQL

-- 1. 협력사 (Partners) 테이블
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 사용자 (Users) 테이블 (Supabase Auth와 연동)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 3. 병원 (Hospitals) 테이블
CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  neca_registered_date DATE,
  is_prescribing BOOLEAN DEFAULT false,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 의사 (Doctors) 테이블
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_representative BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 병원-협력사 매핑 (Hospital-Partner mapping)
CREATE TABLE hospital_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, partner_id)
);

-- 6. 방문 기록 (Visit Logs)
CREATE TABLE visit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  is_scheduled BOOLEAN DEFAULT false,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 동선 계획 (Route Planning)
CREATE TABLE route_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  sort_order INTEGER,
  planned_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_hospitals_name ON hospitals(name);
CREATE INDEX idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX idx_visit_logs_hospital_id ON visit_logs(hospital_id);
CREATE INDEX idx_visit_logs_user_id ON visit_logs(user_id);
CREATE INDEX idx_hospital_partners_hospital_id ON hospital_partners(hospital_id);
CREATE INDEX idx_hospital_partners_partner_id ON hospital_partners(partner_id);

-- Row Level Security (RLS) 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_plans ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 일반 사용자는 자신의 담당 병원만 볼 수 있음
CREATE POLICY "Users can view their assigned hospitals"
  ON hospitals FOR SELECT
  USING (
    auth.uid() IN (
      SELECT up.id FROM user_profiles up
      WHERE up.role = 'admin'
    )
    OR
    id IN (
      SELECT hp.hospital_id FROM hospital_partners hp
      JOIN user_profiles up ON up.partner_id = hp.partner_id
      WHERE up.id = auth.uid()
    )
  );

-- RLS 정책: Admin은 모든 것을 볼 수 있음
CREATE POLICY "Admins can view all data"
  ON hospitals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 샘플 데이터 삽입
INSERT INTO partners (name) VALUES
  ('A파트너'),
  ('B파트너'),
  ('C파트너'),
  ('D파트너');

INSERT INTO hospitals (name, address, phone, email, neca_registered_date, is_prescribing, latitude, longitude) VALUES
  ('서울수면클리닉', '서울시 강남구 테헤란로 123', '02-1234-5678', 'seoul@sleep.kr', '2024-06-15', true, 37.498, 127.028),
  ('강남브레인의원', '서울시 강남구 역삼동 456', '02-2345-6789', 'brain@clinic.kr', '2024-07-20', true, 37.495, 127.038),
  ('분당숙면병원', '경기도 성남시 분당구 정자동 789', '031-1111-2222', 'bundang@sleep.kr', '2024-08-10', true, 37.359, 127.105),
  ('인천꿈의원', '인천시 연수구 송도동 321', '032-456-7890', 'dream@incheon.kr', NULL, false, 37.392, 126.640);
