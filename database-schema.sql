-- 거래처 영업 관리 시스템 v2.0 Database Schema
-- Supabase PostgreSQL
-- 멀티 포트폴리오 (SleepQ + 코칭서비스) + 멀티 거래처 (병원 + 약국)

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
  role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 3. 거래처 (Clients) 테이블 - 병원 + 약국
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hospital', 'pharmacy')),
  address TEXT,
  address_city TEXT,
  address_district TEXT,
  address_dong TEXT,
  phone TEXT,
  email TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 거래처별 포트폴리오 속성 테이블
CREATE TABLE client_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  portfolio_type TEXT NOT NULL CHECK (portfolio_type IN ('sleepq', 'coaching')),

  -- SleepQ 전용 필드
  neca_status TEXT CHECK (neca_status IN ('none', 'pending', 'completed')),
  neca_registered_date DATE,
  is_prescribing BOOLEAN DEFAULT false,

  -- 코칭서비스 전용 필드
  specialty TEXT CHECK (specialty IN ('obesity', 'diabetes', 'both')),
  team TEXT CHECK (team IN ('south_east', 'north')),
  service_type TEXT CHECK (service_type IN ('glpop', 'cgm')),
  cgm_barozen_purchased BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, portfolio_type)
);

-- 5. 담당자 (Staff) 테이블 - 의사 + 약사
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_representative BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 거래처-협력사 매핑 (Client-Partner mapping)
CREATE TABLE client_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, partner_id)
);

-- 7. 진척도 (Progress) 테이블
CREATE TABLE client_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  progress_level INTEGER CHECK (progress_level BETWEEN 1 AND 5),
  progress_stage TEXT CHECK (progress_stage IN ('contact', 'interest', 'review', 'negotiation', 'complete')),
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, partner_id)
);

-- 8. 방문 기록 (Visit Logs)
CREATE TABLE visit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  is_scheduled BOOLEAN DEFAULT false,
  memo TEXT,
  is_memo_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. 동선 계획 (Route Planning)
CREATE TABLE route_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  sort_order INTEGER,
  planned_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 수정 이력 (Change Logs)
CREATE TABLE change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_type TEXT CHECK (change_type IN ('create', 'update', 'delete')),
  change_detail JSONB
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_city ON clients(address_city);
CREATE INDEX idx_client_portfolio_client_id ON client_portfolio(client_id);
CREATE INDEX idx_client_portfolio_type ON client_portfolio(portfolio_type);
CREATE INDEX idx_staff_client_id ON staff(client_id);
CREATE INDEX idx_visit_logs_client_id ON visit_logs(client_id);
CREATE INDEX idx_visit_logs_user_id ON visit_logs(user_id);
CREATE INDEX idx_client_partners_client_id ON client_partners(client_id);
CREATE INDEX idx_client_partners_partner_id ON client_partners(partner_id);
CREATE INDEX idx_client_progress_client_id ON client_progress(client_id);
CREATE INDEX idx_change_logs_table_record ON change_logs(table_name, record_id);

-- Row Level Security (RLS) 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_logs ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 일반 사용자는 자신의 담당 거래처만 볼 수 있음
CREATE POLICY "Users can view their assigned clients"
  ON clients FOR SELECT
  USING (
    auth.uid() IN (
      SELECT up.id FROM user_profiles up
      WHERE up.role IN ('admin', 'manager')
    )
    OR
    id IN (
      SELECT cp.client_id FROM client_partners cp
      JOIN user_profiles up ON up.partner_id = cp.partner_id
      WHERE up.id = auth.uid()
    )
  );

-- RLS 정책: Admin/Manager는 모든 것을 볼 수 있음
CREATE POLICY "Admins and managers can view all data"
  ON clients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- RLS 정책: 포트폴리오 정보는 거래처 권한과 동일
CREATE POLICY "Portfolio follows client visibility"
  ON client_portfolio FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients
    )
  );

-- RLS 정책: 진척도 정보는 거래처 권한과 동일
CREATE POLICY "Progress follows client visibility"
  ON client_progress FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients
    )
  );

-- 샘플 데이터 삽입
INSERT INTO partners (name) VALUES
  ('A파트너'),
  ('B파트너'),
  ('C파트너'),
  ('D파트너');

-- 샘플 거래처 데이터 (병원 + 약국)
INSERT INTO clients (name, type, address, address_city, address_district, address_dong, phone, email, latitude, longitude) VALUES
  ('서울수면클리닉', 'hospital', '서울시 강남구 테헤란로 123', '서울', '강남구', '역삼동', '02-1234-5678', 'seoul@sleep.kr', 37.498, 127.028),
  ('강남브레인의원', 'hospital', '서울시 강남구 역삼동 456', '서울', '강남구', '역삼동', '02-2345-6789', 'brain@clinic.kr', 37.495, 127.038),
  ('분당숙면병원', 'hospital', '경기도 성남시 분당구 정자동 789', '경기', '성남시', '정자동', '031-1111-2222', 'bundang@sleep.kr', 37.359, 127.105),
  ('인천꿈의원', 'hospital', '인천시 연수구 송도동 321', '인천', '연수구', '송도동', '032-456-7890', 'dream@incheon.kr', 37.392, 126.640),
  ('건강약국', 'pharmacy', '서울시 송파구 잠실동 100', '서울', '송파구', '잠실동', '02-3333-4444', 'health@pharm.kr', 37.513, 127.100),
  ('웰빙약국', 'pharmacy', '경기도 고양시 일산동구 마두동 200', '경기', '고양시', '마두동', '031-9999-8888', 'wellbeing@pharm.kr', 37.658, 126.776);

-- 샘플 포트폴리오 속성 데이터
-- SleepQ 포트폴리오
INSERT INTO client_portfolio (client_id, portfolio_type, neca_status, neca_registered_date, is_prescribing)
SELECT id, 'sleepq', 'completed', '2024-06-15', true FROM clients WHERE name = '서울수면클리닉';

INSERT INTO client_portfolio (client_id, portfolio_type, neca_status, neca_registered_date, is_prescribing)
SELECT id, 'sleepq', 'completed', '2024-07-20', true FROM clients WHERE name = '강남브레인의원';

INSERT INTO client_portfolio (client_id, portfolio_type, neca_status, neca_registered_date, is_prescribing)
SELECT id, 'sleepq', 'pending', NULL, false FROM clients WHERE name = '분당숙면병원';

-- 코칭서비스 포트폴리오
INSERT INTO client_portfolio (client_id, portfolio_type, specialty, team, service_type, cgm_barozen_purchased)
SELECT id, 'coaching', 'obesity', 'south_east', 'glpop', true FROM clients WHERE name = '건강약국';

INSERT INTO client_portfolio (client_id, portfolio_type, specialty, team, service_type, cgm_barozen_purchased)
SELECT id, 'coaching', 'diabetes', 'north', 'cgm', false FROM clients WHERE name = '웰빙약국';

-- 샘플 담당자 데이터
INSERT INTO staff (client_id, name, phone, email, is_representative)
SELECT id, '김원장', '010-1234-5678', 'kim@sleep.kr', true FROM clients WHERE name = '서울수면클리닉';

INSERT INTO staff (client_id, name, phone, email, is_representative)
SELECT id, '박약사', '010-8888-9999', 'park@pharm.kr', true FROM clients WHERE name = '건강약국';

-- ========================================
-- Phase 0: Backend Migration 추가 스키마
-- ========================================

-- 1. 회원 가입 승인 테이블 (User Registration Approval)
CREATE TABLE user_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  address TEXT,
  password TEXT NOT NULL, -- Supabase Auth 승인 전까지 임시 저장
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ
);

-- 2. visit_logs 테이블에 방문 상태 추적 필드 추가
ALTER TABLE visit_logs
ADD COLUMN products JSONB DEFAULT '[]'::jsonb,
ADD COLUMN status TEXT CHECK (status IN ('completed', 'cancelled')) DEFAULT 'completed',
ADD COLUMN visit_type TEXT,
ADD COLUMN cancel_reason TEXT,
ADD COLUMN reschedule_date DATE;

-- 3. route_plans 테이블에 확정 상태 추가
ALTER TABLE route_plans
ADD COLUMN status TEXT CHECK (status IN ('planned', 'confirmed')) DEFAULT 'planned';

-- 4. visit_logs, route_plans → user_profiles 직접 FK 추가 (Supabase JOIN용)
ALTER TABLE visit_logs
ADD CONSTRAINT visit_logs_user_profile_fkey
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE route_plans
ADD CONSTRAINT route_plans_user_profile_fkey
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- 추가 인덱스 생성
CREATE INDEX idx_user_registrations_status ON user_registrations(status);
CREATE INDEX idx_user_registrations_email ON user_registrations(email);
CREATE INDEX idx_visit_logs_status ON visit_logs(status);
CREATE INDEX idx_visit_logs_date ON visit_logs(visit_date);
CREATE INDEX idx_visit_logs_partner_id ON visit_logs(partner_id);
CREATE INDEX idx_route_plans_status ON route_plans(status);
CREATE INDEX idx_route_plans_date ON route_plans(planned_date);
CREATE INDEX idx_route_plans_user_id ON route_plans(user_id);

-- RLS 정책 추가
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Admin만 회원 가입 신청 목록 조회 가능
CREATE POLICY "Only admins can view user registrations"
  ON user_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin만 회원 승인/거부 가능
CREATE POLICY "Only admins can update user registrations"
  ON user_registrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
