# Guía de Deployment para Vercel + Render

## Resumen de Cambios

Se han realizado cambios en **backend** y **frontend** para reestructurar las categorías de skills:

**Backend:**
- `backend/routes/skill_matrix.py` - Nuevas categorías
- `backend/main.py` - Heurísticas actualizadas
- `backend/migrate_skills_categories.py` - Script de migración
- `backend/migrate_skills_categories.sql` - SQL para migración

**Frontend:**
- `frontend/src/pages/Skills.jsx` - 9 nuevas categorías + colores
- `frontend/src/pages/SkillMatrix.jsx` - Nuevos colores
- `frontend/src/components/SkillCheckboxes.jsx` - Nuevos colores

---

## Paso 1: Hacer Push a GitHub

Si tu repo está en GitHub:

```bash
# Desde el directorio del proyecto
git add .
git commit -m "refactor: restructure skills into 9 specialized categories

- Update backend routes and models with new category names
- Add migration scripts (Python and SQL)
- Update frontend colors and category ordering
- Improve auto-categorization heuristics"
git push origin main
```

Si no tienes Git configurado localmente:

```bash
git init
git add .
git commit -m "refactor: restructure skills into 9 specialized categories"
git remote add origin https://github.com/tu-usuario/exd-dashboard.git
git push -u origin main
```

---

## Paso 2: Migrar Datos en Render (Producción)

### Opción A: Usar Render Dashboard + SQL

1. **Abre el Dashboard de Render:**
   - Ve a https://dashboard.render.com
   - Abre tu instancia PostgreSQL (Postgres resource)

2. **Ejecuta la migración SQL:**
   - Abre PostgreSQL browser o psql
   - Copia y ejecuta `backend/migrate_skills_categories.sql`

### Opción B: Usar CLI en Render

Si tienes acceso SSH a Render:

```bash
# SSH a tu instancia de Render
ssh -i your-key user@your-render-domain

# Navega al directorio del proyecto
cd /app

# Ejecuta la migración
python backend/migrate_skills_categories.py
```

### Opción C: Trigger Automático (Recomendado)

1. Crea un endpoint temporal en `main.py` para ejecutar la migración:

```python
@app.post("/api/admin/migrate-skills")
def migrate_skills_endpoint(token: str = Query(...)):
    if token != os.environ.get("ADMIN_TOKEN"):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    from backend.migrate_skills_categories import SKILL_CATEGORY_MAP
    db = SessionLocal()
    updated = 0
    for skill in db.query(models.Skill).all():
        if skill.nombre in SKILL_CATEGORY_MAP:
            skill.categoria = SKILL_CATEGORY_MAP[skill.nombre]
            updated += 1
    db.commit()
    return {"updated": updated, "message": "Migration complete"}
```

2. En Render Dashboard, establece una variable de entorno:
   ```
   ADMIN_TOKEN=your-secret-token-here
   ```

3. Llama al endpoint después del deploy:
   ```bash
   curl https://your-render-backend.onrender.com/api/admin/migrate-skills?token=your-secret-token
   ```

---

## Paso 3: Deploy en Render (Backend)

### Automático (Recomendado)

1. **Abre Render Dashboard:** https://dashboard.render.com
2. **Selecciona tu servicio ExD Backend**
3. **Ir a "Settings" → "Deploy" → "Manual Deploy"** o **"Deploy latest commit"**
4. Render detectará cambios en `main.py` y `backend/routes/skill_matrix.py` automáticamente

### Manual

```bash
# En tu máquina local
git push origin main

# En Render, el webhook automático disparará el build
# Puedes monitorear en Render Dashboard > Deploys
```

**Tiempo esperado:** 3-5 minutos

**Verifica en Render Dashboard:**
- El servicio debe mostrar "Live" en verde
- Revisa los logs para confirmar que no hay errores

---

## Paso 4: Deploy en Vercel (Frontend)

### Automático

1. **Abre Vercel Dashboard:** https://vercel.com/dashboard
2. **Selecciona tu proyecto ExD**
3. El deploy se disparará automáticamente cuando hagas push a GitHub

### Manual

```bash
# Instala Vercel CLI si no lo tienes
npm install -g vercel

# Desde el directorio frontend
cd frontend
vercel --prod
```

**Tiempo esperado:** 2-3 minutos

**Verifica en Vercel Dashboard:**
- Busca el nuevo deployment en "Deployments"
- Debe mostrar "Ready" con un check verde
- Haz clic para ver la URL en vivo

---

## Paso 5: Verificar Cambios en Producción

Una vez que ambos deploys estén completados:

### Backend
```bash
# Verifica que la API está up
curl https://your-render-backend.onrender.com/api/health

# Verifica las nuevas categorías
curl https://your-render-backend.onrender.com/api/skills/categorias
```

### Frontend
1. Abre https://your-vercel-domain.vercel.app
2. Ve a "Catálogo de Skills"
3. Verifica que ves las 9 categorías nuevas con colores correctos
4. Ve a "Skill Matrix"
5. Verifica que las categorías se muestran en el nuevo orden

---

## Checklist de Deployment

- [ ] Cambios pusheados a GitHub
- [ ] Migración de datos ejecutada en BD de producción
- [ ] Render backend deployd (muestra "Live")
- [ ] Vercel frontend deployd (muestra "Ready")
- [ ] API de salud responde correctamente
- [ ] Página de Skills muestra 9 categorías
- [ ] Skill Matrix muestra nuevo orden y colores
- [ ] Formulario de Personas permite seleccionar nuevas categorías

---

## Rollback (Si algo sale mal)

### Backend en Render

1. En Render Dashboard, ve a tu servicio
2. Abre "Deployments"
3. Haz clic en el deployment anterior (el que funcionaba)
4. Haz clic en "Redeploy"

### Frontend en Vercel

1. En Vercel Dashboard, ve a tu proyecto
2. Abre "Deployments"
3. Haz clic en el deployment anterior
4. Haz clic en los tres puntos → "Promote to Production"

### Datos (Si necesitas revertir cambios de BD)

```sql
-- Si necesitas revertir la migración
UPDATE skills SET categoria = NULL WHERE nombre IN (
  'UX Design', 'UI Design', 'Product Design', 
  'Service Design', 'Design Systems', 'UX Research'
);
```

---

## Soporte

Si encuentras problemas:

1. **Render Logs:**
   - Dashboard → Tu servicio → "Logs"
   - Busca errores relacionados con `skill_matrix` o `main.py`

2. **Vercel Logs:**
   - Dashboard → Tu proyecto → "Deployments" → Selecciona el deployment
   - Abre "Function Logs" o "Runtime Logs"

3. **BD (Render PostgreSQL):**
   - Verifica que los datos se migaron:
   ```sql
   SELECT COUNT(*) FROM skills WHERE categoria LIKE '%Design%';
   ```
