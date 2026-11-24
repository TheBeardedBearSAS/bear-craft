# Esquema de Sprint Status (`.bmad/sprint-status.yaml`)

`.bmad/sprint-status.yaml` es la **única fuente de verdad del ESTADO de stories y tareas**. Los archivos markdown (`US-*.md`, `EPIC-*.md`, `TASK-*.md`, `board.md`) contienen **solo contenido**: sin campo de estado, sin emoji de estado. El estado de un epic se **deriva** de los estados de sus stories (nunca se almacena).

- Estados de story: `backlog | ready-for-dev | in-progress | review | done | blocked`
- Estados de tarea: `to-do | in-progress | done | blocked`
- Las transiciones de story siguen la máquina de estados BMAD (ver `/bear-project:backlog move story`).

```yaml
# .bmad/sprint-status.yaml
version: "1.0"
metadata:
  sprint_id: "sprint-2"
  name: "Gestión de usuarios"
  start_date: "2026-11-02"
  end_date: "2026-11-13"
  goal: "Los usuarios pueden registrarse, iniciar sesión y editar su perfil"
  capacity_points: 21
stories:
  US-010:
    title: "Registro de usuario"
    status: "in-progress"
    previous_status: "ready-for-dev"
    tdd_phase: "green"
    story_points: 5
    epic_id: "EPIC-002"
    priority: "must"
    dependencies: ["US-001"]
    tasks:
      total: 2
      completed: 1
      list: ["TASK-001", "TASK-002"]
      status:
        TASK-001: "done"
        TASK-002: "in-progress"
    history:
      - timestamp: "2026-11-02T08:30:00Z"
        from: "none"
        to: "backlog"
        by: "auto"
        reason: "Story creada"
      - timestamp: "2026-11-02T09:00:00Z"
        from: "ready-for-dev"
        to: "in-progress"
        by: "dev"
        reason: "Implementación iniciada"
cross_cutting_tasks:
  TASK-051:
    title: "Revisión de versiones"
    status: "done"
  TASK-052:
    title: "Changelog"
    status: "to-do"
    epic_id: "EPIC-002"
archived_sprints:
  sprint-1:
    stories:
      US-001: { status: "done", points: 5 }
routing:
  auto_transitions:
    enabled: true
    run_on_session_start: false
    run_on_task_complete: true
    rules: []
```

## Reglas

- El contenido (título, descripción, criterios de aceptación, detalle de las tareas) se escribe en los archivos markdown; el estado se escribe únicamente en este archivo.
- `tasks.completed` es el número de tareas cuyo estado es `done`; `tasks.total` es la longitud de `tasks.list`.
- Cada transición de story actualiza `status` y `previous_status` y añade una entrada a `history` (`timestamp`, `from`, `to`, `by`, `reason`).
- Entrada de creación: una story nueva no tiene estado anterior, así que su primera entrada de `history` usa `from: "none"` (nunca `null`) y `to: "backlog"`.
- Las marcas de tiempo (`history[].timestamp`, `initialized_at`, `updated_at`) son la hora UTC real del evento, en ISO 8601: obtenerla con `date -u +%Y-%m-%dT%H:%M:%SZ`. Nunca escribir un marcador de solo fecha como `T00:00:00Z`.
- El estado del epic se calcula a partir de sus stories (todas `backlog` = no iniciado, cualquier otro estado no `done` = en curso, todas `done` = terminado); nunca se escribe en ningún sitio.
- Si el archivo no existe, créalo desde el esqueleto de `/bear-workflow:init` antes de escribir.
- `stories.<id>.sprint_id` (opcional): ausente = comportamiento histórico (la story pertenece al sprint activo); `null` = backlog; en otro caso, el identificador del sprint al que pertenece.
- `metadata.closed_date` (opcional, `AAAA-MM-DD`): se establece al cerrar un sprint; un sprint con `closed_date` ya no es el sprint activo.
- Al cerrar un sprint, sus stories `done` se retiran de `stories` y se registran en `archived_sprints.<sprint_id>` con `name`, `epic` (si lo hay), `closed_date`, `points_committed`, `points_delivered` y `stories` (`<id>: { status: "done", points }`). Las stories no terminadas permanecen en `stories`, con `sprint_id` en `null` (backlog) o igual al sprint de destino. La forma anterior, solo con `stories`, sigue siendo válida.
- Los límites WIP no se almacenan aquí: están en `.bmad/kanban.yaml`.
- Clave raíz opcional `cross_cutting_tasks` (`TASK-<id>: { title, status, epic_id? }`, estados `to-do | in-progress | done | blocked`): tareas de sprint que no pertenecen a ninguna story (revisión de versiones, changelog…). No están bajo ningún `stories.<id>.tasks`; `/bear-workflow:status` y el Kanban (`GET /api/sprints/current` → `cross_cutting_tasks`) las cuentan. No inventes nunca otra clave raíz.
