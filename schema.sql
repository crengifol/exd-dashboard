-- ============================================================================
-- ExD Control Center Database Schema
-- PostgreSQL 14+
-- ============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PERSONAS TABLE
-- ============================================================================
CREATE TABLE personas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL,
  empresa_actual TEXT,
  area TEXT,

  -- Career tracking
  nivel_seniority VARCHAR(20) DEFAULT 'Mid',
    CHECK (nivel_seniority IN ('Junior', 'Mid', 'Senior', 'Lead', 'Director')),
  anos_experiencia INT,

  -- Expanded profile
  habilidades JSONB DEFAULT '[]',           -- ["UX Research", "UI Design", "Service Design", "Product Design", "Design Systems"]
  certificaciones JSONB DEFAULT '[]',       -- ["Nielsen Norman", "GDD", "Google Design Thinking", ...]
  intereses JSONB DEFAULT '[]',             -- ["Service Design", "Design Systems", ...]
  disponible_mentoria BOOLEAN DEFAULT false,
  portfolio_link VARCHAR(500),

  -- Evaluation tracking
  evaluacion_ultima JSONB,                  -- {score: 8.5, date: "2026-Q1", self: 8, manager: 8.5, peer: 8}
  evaluacion_historico JSONB DEFAULT '[]',  -- [{q: "2025-Q1", score: 7.5}, {q: "2025-Q2", score: 7.8}, ...]

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_personas_nivel_seniority ON personas(nivel_seniority);
CREATE INDEX idx_personas_nombre ON personas(nombre);

-- ============================================================================
-- ASIGNACIONES TABLE (Person <-> Project Assignments)
-- ============================================================================
CREATE TABLE asignaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id TEXT NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  proyecto_id VARCHAR(100) NOT NULL,
  cliente VARCHAR(200) NOT NULL,

  -- Assignment details
  dedicacion INT DEFAULT 100,               -- % (100, 50, 25, ...)
    CHECK (dedicacion > 0 AND dedicacion <= 100),

  -- Timeline
  fecha_inicio DATE NOT NULL,
  fecha_liberacion DATE,

  -- Status
  estado VARCHAR(50) DEFAULT 'active',
    CHECK (estado IN ('active', 'paused', 'completed')),

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraint: no overlapping active assignments for same person in different projects
  CONSTRAINT check_dates CHECK (fecha_inicio <= fecha_liberacion OR fecha_liberacion IS NULL)
);

CREATE INDEX idx_asignaciones_persona ON asignaciones(persona_id);
CREATE INDEX idx_asignaciones_fecha_liberacion ON asignaciones(fecha_liberacion);
CREATE INDEX idx_asignaciones_estado ON asignaciones(estado);
CREATE INDEX idx_asignaciones_cliente ON asignaciones(cliente);

-- ============================================================================
-- PROYECTOS TABLE (Active Projects)
-- ============================================================================
CREATE TABLE proyectos (
  id VARCHAR(100) PRIMARY KEY,
  nombre TEXT NOT NULL,
  cliente VARCHAR(200) NOT NULL,
  descripcion TEXT,

  -- Phases
  fase VARCHAR(50) DEFAULT 'discovery',
    CHECK (fase IN ('discovery', 'design', 'testing', 'launch', 'evolution')),

  -- Progress
  porcentaje_completado INT DEFAULT 0,
    CHECK (porcentaje_completado >= 0 AND porcentaje_completado <= 100),

  -- Timeline
  fecha_inicio DATE,
  fecha_launch DATE,

  -- Leadership
  stakeholder VARCHAR(200),

  -- Health status
  health VARCHAR(50) DEFAULT 'on_track',
    CHECK (health IN ('on_track', 'at_risk', 'blocked')),

  -- Team assignment
  equipo JSONB DEFAULT '[]',  -- [{persona_id: "...", rol: "Lead Designer"}, ...]

  -- Issues
  issues TEXT,
  next_milestone TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proyectos_fase ON proyectos(fase);
CREATE INDEX idx_proyectos_health ON proyectos(health);
CREATE INDEX idx_proyectos_cliente ON proyectos(cliente);

-- ============================================================================
-- OPORTUNIDADES TABLE (Pipeline / Future Projects)
-- ============================================================================
CREATE TABLE oportunidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  cliente VARCHAR(200) NOT NULL,
  alcance TEXT,

  -- Phases timeline
  fases JSONB,  -- {discovery: {duration_weeks: 2}, design: {duration_weeks: 4}, ...}

  -- Resource requirements
  vacantes INT DEFAULT 1,
    CHECK (vacantes > 0),
  nivel_requerido VARCHAR(20),
    CHECK (nivel_requerido IS NULL OR nivel_requerido IN ('Junior', 'Mid', 'Senior', 'Lead', 'Director')),
  competencias_requeridas JSONB DEFAULT '[]',  -- ["UX Research", "Service Design"]

  -- Timeline
  timeline_start DATE,
  timeline_end DATE,

  -- Status
  status VARCHAR(50) DEFAULT 'opportunity',
    CHECK (status IN ('opportunity', 'approved', 'bidding', 'signed', 'executing')),

  -- Leadership
  owner VARCHAR(200),

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_timeline CHECK (timeline_start <= timeline_end OR timeline_end IS NULL)
);

CREATE INDEX idx_oportunidades_status ON oportunidades(status);
CREATE INDEX idx_oportunidades_timeline_start ON oportunidades(timeline_start);

-- ============================================================================
-- HELPER VIEW: Current Availability (Personas sin asignaciones activas)
-- ============================================================================
CREATE VIEW v_personas_disponibles AS
SELECT p.id, p.nombre, p.nivel_seniority
FROM personas p
WHERE NOT EXISTS (
  SELECT 1 FROM asignaciones a
  WHERE a.persona_id = p.id
  AND a.estado = 'active'
  AND (a.fecha_liberacion IS NULL OR a.fecha_liberacion > CURRENT_DATE)
);

-- ============================================================================
-- HELPER VIEW: Upcoming Liberations (Next 4 weeks)
-- ============================================================================
CREATE VIEW v_liberaciones_proximas AS
SELECT
  a.persona_id,
  p.nombre,
  a.proyecto_id,
  a.cliente,
  a.fecha_liberacion,
  CURRENT_DATE - a.fecha_liberacion AS dias_hasta_liberacion
FROM asignaciones a
JOIN personas p ON a.persona_id = p.id
WHERE a.estado = 'active'
AND a.fecha_liberacion IS NOT NULL
AND a.fecha_liberacion <= CURRENT_DATE + INTERVAL '28 days'
AND a.fecha_liberacion > CURRENT_DATE
ORDER BY a.fecha_liberacion ASC;

-- ============================================================================
-- SEED DATA (Sample for development)
-- ============================================================================

-- Insert sample personas
INSERT INTO personas (id, nombre, rol, nivel_seniority, anos_experiencia, habilidades, disponible_mentoria) VALUES
('carlos-rojas', 'Carlos Rojas', 'Lead Designer', 'Lead', 8, '["UX Design", "Product Design", "Design Systems"]'::jsonb, true),
('rebecca-tapia', 'Rebecca Tapia', 'UX Researcher', 'Senior', 6, '["UX Research", "Data Analysis", "Wireframing"]'::jsonb, true),
('isidora-perez', 'Isidora Pérez', 'UI Designer', 'Senior', 5, '["UI Design", "Design Systems", "Prototyping"]'::jsonb, false),
('brigitte-arriojas', 'Brigitte Arriojas', 'Service Designer', 'Senior', 7, '["Service Design", "Workshop Facilitation"]'::jsonb, true),
('alejandro-penaloza', 'Alejandro Peñaloza', 'Designer', 'Mid', 3, '["UX Design", "UI Design"]'::jsonb, false),
('alexandra-salosny', 'Alexandra Salosny', 'Designer', 'Mid', 4, '["Product Design", "UX Research"]'::jsonb, true),
('carolina-espinoza', 'Carolina Espinoza', 'Designer', 'Mid', 3, '["UI Design", "Design Systems"]'::jsonb, false),
('carolina-varela', 'Carolina Varela', 'Designer', 'Mid', 2, '["UX Design", "Wireframing"]'::jsonb, true),
('jaime-castillo', 'Jaime Castillo', 'Designer', 'Junior', 1, '["UI Design"]'::jsonb, false),
('john-calderon', 'John Calderón', 'Designer', 'Junior', 1, '["UX Design"]'::jsonb, false),
('jonathan-calderon', 'Jonathan Calderón', 'Designer', 'Mid', 2, '["Service Design", "Workshop"]'::jsonb, true),
('lysset-hernandez', 'Lysset Hernández', 'Designer', 'Mid', 3, '["Product Design", "UX Research"]'::jsonb, false),
('marcela-bozzo', 'Marcela Bozzo', 'Senior Designer', 'Senior', 15, '["UX Design", "Product Design", "Leadership"]'::jsonb, true),
('mauro-zuniga', 'Mauro Zúñiga', 'Designer', 'Mid', 4, '["Design Systems", "UI Design"]'::jsonb, false),
('raimundo-ruffin', 'Raimundo Ruffín', 'Designer', 'Senior', 6, '["Service Design", "Workshop"]'::jsonb, true),
('valentina-herrera', 'Valentina Herrera', 'Designer', 'Junior', 1, '["UI Design", "Prototyping"]'::jsonb, false);

-- Insert sample proyectos
INSERT INTO proyectos (id, nombre, cliente, descripcion, fase, porcentaje_completado, stakeholder, health, equipo) VALUES
('latam-amelia', 'LATAM - Amelia', 'LATAM', 'Redesign booking experience', 'design', 45, 'Juan Pérez (LATAM)', 'on_track',
  '[{"persona_id": "carlos-rojas", "rol": "Lead"}, {"persona_id": "rebecca-tapia", "rol": "Researcher"}]'::jsonb),
('kaizen-gaming', 'Kaizen Gaming', 'Kaizen Gaming', 'Player experience optimization', 'testing', 75, 'Miguel Torres', 'on_track',
  '[{"persona_id": "brigitte-arriojas", "rol": "Service Designer"}]'::jsonb),
('agencia-ux', 'AgencIA UX', 'NTT DATA Internal', 'Internal tool for UX team', 'evolution', 90, 'Crescente Rengifo', 'blocked',
  '[{"persona_id": "isidora-perez", "rol": "Lead"}, {"persona_id": "alejandro-penaloza", "rol": "Designer"}]'::jsonb),
('banco-digital', 'Banco Digital', 'FinTech Startup', 'Digital banking platform', 'discovery', 10, 'CEO Startup', 'on_track',
  '[{"persona_id": "marcela-bozzo", "rol": "Lead"}]'::jsonb),
('retail-platform', 'Retail Platform', 'Retail Chain', 'E-commerce redesign', 'design', 50, 'VP Digital', 'at_risk',
  '[{"persona_id": "carolina-espinoza", "rol": "UI"}, {"persona_id": "valentina-herrera", "rol": "Designer"}]'::jsonb);

-- Insert sample asignaciones
INSERT INTO asignaciones (persona_id, proyecto_id, cliente, dedicacion, fecha_inicio, fecha_liberacion, estado) VALUES
('carlos-rojas', 'latam-amelia', 'LATAM', 100, '2026-04-01', '2026-05-15', 'active'),
('rebecca-tapia', 'latam-amelia', 'LATAM', 100, '2026-04-01', '2026-05-20', 'active'),
('brigitte-arriojas', 'kaizen-gaming', 'Kaizen Gaming', 100, '2026-03-15', '2026-05-30', 'active'),
('isidora-perez', 'agencia-ux', 'NTT DATA', 100, '2026-02-01', '2026-06-30', 'active'),
('alejandro-penaloza', 'agencia-ux', 'NTT DATA', 50, '2026-02-01', '2026-06-15', 'active'),
('marcela-bozzo', 'banco-digital', 'FinTech', 100, '2026-05-01', '2026-06-30', 'active'),
('carolina-espinoza', 'retail-platform', 'Retail', 100, '2026-04-15', '2026-06-15', 'active'),
('valentina-herrera', 'retail-platform', 'Retail', 50, '2026-04-15', '2026-05-31', 'active');

-- Insert sample oportunidades
INSERT INTO oportunidades (nombre, cliente, alcance, vacantes, nivel_requerido, competencias_requeridas, timeline_start, timeline_end, status, owner) VALUES
('Healthcare Platform', 'HealthCorp', 'Complete UX redesign for patient portal', 2, 'Senior', '["UX Research", "Product Design"]'::jsonb, '2026-06-01', '2026-09-30', 'bidding', 'Crescente'),
('SaaS Dashboard', 'TechStartup Inc', 'Design new analytics dashboard', 1, 'Mid', '["UI Design", "Product Design"]'::jsonb, '2026-05-20', '2026-07-31', 'approved', 'Carlos Rojas'),
('Service Design Sprint', 'Municipality', 'Design citizen services workflow', 2, 'Senior', '["Service Design", "Workshop"]'::jsonb, '2026-06-15', '2026-08-31', 'opportunity', 'Brigitte');

-- ============================================================================
-- Commit transaction
-- ============================================================================
COMMIT;

-- ============================================================================
-- Verification queries (test after import)
-- ============================================================================
-- SELECT COUNT(*) as personas_count FROM personas;
-- SELECT COUNT(*) as asignaciones_count FROM asignaciones;
-- SELECT COUNT(*) as proyectos_count FROM proyectos;
-- SELECT COUNT(*) as oportunidades_count FROM oportunidades;
-- SELECT * FROM v_liberaciones_proximas;
-- SELECT * FROM v_personas_disponibles;

