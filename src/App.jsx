import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Edit3,
  Layers,
  Plus,
  Shield,
  Target,
  Trash2,
  X,
} from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 10);

const SKILL_CATEGORIES = [
  "Shot Stopping",
  "Diving",
  "Footwork",
  "Positioning",
  "Distribution",
  "Crosses & High Balls",
  "1v1 Situations",
  "Communication",
  "Playing Out From Back",
  "Set Pieces",
  "Recovery",
  "Mental / Decision Making",
  "Physical Conditioning",
];

const INTENSITY = ["Low", "Medium", "High", "Max"];

const EQUIPMENT_OPTIONS = [
  "Cones",
  "Poles",
  "Hurdles",
  "Mannequins",
  "Balls",
  "GK Gloves",
  "Resistance Bands",
  "Agility Ladder",
  "Mini Goals",
  "Rebounder",
  "Tennis Balls",
  "Medicine Ball",
  "Speed Rings",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyDrill = () => ({
  id: uid(),
  name: "",
  duration: 10,
  description: "",
  category: "Shot Stopping",
  sets: "",
  reps: "",
  equipment: [],
  coachingPoints: "",
  intensity: "Medium",
  playerCount: "",
  progressions: "",
  commonMistakes: "",
  notes: "",
});

const emptySession = () => ({
  id: uid(),
  name: "New Session",
  focus: "Shot Stopping",
  totalDuration: 60,
  drills: [emptyDrill()],
  week: "",
  day: "",
  phase: "",
  weekFocus: "",
});

const emptyWeek = () => ({
  id: uid(),
  name: "New Week",
  days: DAYS.reduce((acc, day) => ({ ...acc, [day]: null }), {}),
});

const emptyBlock = () => ({
  id: uid(),
  name: "New Training Block",
  weeks: [emptyWeek()],
  goal: "",
});

// Parsed from GK_Full_Fall_Season_Training_Plan.docx
const RAW = [{"name":"W1 Monday \u2014 Individual Assessment + Stance","focus":"Mental / Decision Making","week":1,"day":"Monday","phase":"Pre-Season","wf":"Assessment & Foundation","drills":[{"n":"Goalkeeper Profile Assessment","dur":10,"desc":"Each GK performs a standardized 10-minute test: set position, lateral shuffle 5m each way, basic low ball catch, dive left/right, kick from hands. Coach records baseline on clipboard.","cat":"Mental / Decision Making","reps":"10 min each GK","eq":["Balls"],"cp":"Observe natural tendencies; note dominant side, catching shape, footwork preference","int":"Medium"},{"n":"Set Position & Stance Drill","dur":6,"desc":"GKs stand on goal line. Coach calls 'set' — GKs drop into stance. Coach checks: feet shoulder-width, weight on balls of feet, hands up, eyes forward. Reset and repeat.","cat":"Positioning","reps":"3 x 10 reps","eq":["Balls"],"cp":"Soft knees, chin over toes, hands ready at hip height","int":"Medium"},{"n":"W-Grip Catching Form","dur":6,"desc":"Coach rolls/throws balls at varying heights from 8m. GKs focus only on hand shape — thumbs together behind ball on high catches, pinkies together on low. Balls 1 at a time, no pressure.","cat":"Shot Stopping","reps":"3 x 12 catches each","eq":["Balls"],"cp":"Lock the W shape — no chicken wings; ball into chest on completion","int":"Medium"},{"n":"Basic Footwork Ladder","dur":10,"desc":"Agility ladder flat on ground in front of goal. GKs work through: two-feet-in each rung, lateral shuffle, crossover step. Done barefoot or in boots.","cat":"Positioning","reps":"4 passes each pattern","eq":["Agility Ladder"],"cp":"Light on feet, don't stare down; head up throughout","int":"Medium"}]},{"name":"W1 Tuesday — Catching & Ground Balls","focus":"Shot Stopping","week":1,"day":"Tuesday","phase":"Pre-Season","wf":"Assessment & Foundation","drills":[{"n":"Roll-Out Ground Ball Circuit","dur":8,"desc":"Coach stands 10m out, rolls balls left, right, and central. GK must move to line of ball and take with proper scoop technique — fingers pointing down, ball into chest. Rotate all 3 GKs.","cat":"Distribution","reps":"4 x 8 balls each","eq":["Balls"],"cp":"Get body behind ball; don't just use hands","int":"Medium"},{"n":"Collapse Dive Introduction (Both Sides)","dur":6,"desc":"Start from knees. GK falls to side, keeping bottom leg extended, top hand over ball, bottom hand under. Coach places ball rather than throws. Progress to standing once technique is clean.","cat":"Shot Stopping","reps":"3 x 6 each side","eq":["Balls"],"cp":"Lead with the hand — not the shoulder; watch ball into hands","int":"Medium"},{"n":"Chest-Height Catching","dur":6,"desc":"Coach throws at chest height from 8m. GK takes ball into chest, wraps arms, steps into the throw. Ball is held secure for 2 seconds before release.","cat":"Shot Stopping","reps":"3 x 10 each GK","eq":["Balls"],"cp":"Meet the ball — don't wait for it; absorb with soft elbows","int":"Medium"},{"n":"Low-to-High Transition Catching","dur":6,"desc":"Coach alternates: first ball is ground-level (scoop), second ball is above waist (W-grip). GK must reset stance between each. Builds pattern recognition.","cat":"Shot Stopping","reps":"3 x 8 pairs each","eq":["Balls"],"cp":"Reset stance between balls — don't stay low","int":"Medium"}]},{"name":"W1 Thursday — Distribution Fundamentals","focus":"Distribution","week":1,"day":"Thursday","phase":"Pre-Season","wf":"Assessment & Foundation","drills":[{"n":"Underarm Roll to Targets","dur":6,"desc":"Place 4 cones at 10m, 15m, and 20m in front and wide. GK rolls ball underarm to each cone in sequence. Focus on accuracy, not pace. Both hands.","cat":"Distribution","reps":"3 x 10 each hand","eq":["Cones","Balls"],"cp":"Low release point; stay side-on to target; follow through to cone","int":"Low"},{"n":"Javelin/Overarm Throw","dur":6,"desc":"GK stands on 6-yard box edge. Target: a cone/player at 25m. Side-on stance, arm back, drive off back foot. No windup — direct throw.","cat":"Distribution","reps":"3 x 8 each arm","eq":["Cones"],"cp":"Elbow high, fingers behind ball; rotate hips through delivery","int":"Low"},{"n":"Goal Kick Technique (Instep)","dur":10,"desc":"Ball on tee at edge of 6-yard box. GK approaches at slight angle, plants non-kicking foot beside ball, strikes with laces, follow-through to target zone in midfield.","cat":"Distribution","reps":"10 kicks each GK","eq":["Balls"],"cp":"Lock ankle, lean slightly back; contact through center of ball","int":"Low"},{"n":"Distribution Decision Game","dur":6,"desc":"Coach stands in two zones: left channel and right channel at halfway. GK must roll, throw, or kick to whichever zone coach points to. Randomized calls.","cat":"Distribution","reps":"3 x 10 decisions each","eq":["Balls","GK Gloves"],"cp":"Choose fastest accurate method; eyes up before ball arrives","int":"Low"}]}];

function expandRaw(raw) {
  return raw.map((session) => ({
    id: uid(),
    name: session.name,
    focus: session.focus,
    totalDuration: session.drills.reduce((acc, drill) => acc + drill.dur, 0),
    week: session.week,
    day: session.day,
    phase: session.phase,
    weekFocus: session.wf,
    drills: session.drills.map((drill) => ({
      id: uid(),
      name: drill.n,
      duration: drill.dur,
      description: drill.desc,
      category: drill.cat,
      sets: "",
      reps: drill.reps,
      equipment: drill.eq,
      coachingPoints: drill.cp,
      intensity: drill.int,
      playerCount: "3",
      progressions: "",
      commonMistakes: "",
      notes: "",
    })),
  }));
}

const PHASES = [
  { num: 1, name: "Pre-Season", weeks: "1-4", color: "#2563eb", bg: "#dbeafe" },
  { num: 2, name: "Early Season", weeks: "5-8", color: "#7c3aed", bg: "#ede9fe" },
  { num: 3, name: "Mid-Season", weeks: "9-12", color: "#0891b2", bg: "#cffafe" },
  { num: 4, name: "Late Season", weeks: "13-16", color: "#ea580c", bg: "#ffedd5" },
  { num: 5, name: "Playoffs", weeks: "17+", color: "#dc2626", bg: "#fee2e2" },
];

const colors = {
  bg: "#f8f7f4",
  card: "#ffffff",
  border: "#e2e0db",
  text: "#1a1a1a",
  textMuted: "#6b6966",
  accent: "#2563eb",
  accentLight: "#dbeafe",
  danger: "#dc2626",
  dangerLight: "#fee2e2",
  success: "#16a34a",
  successLight: "#dcfce7",
  warmLight: "#fef3c7",
  intensityLow: "#86efac",
  intensityMed: "#fde047",
  intensityHigh: "#fb923c",
  intensityMax: "#ef4444",
};

const intensityColor = (value) =>
  (
    {
      Low: colors.intensityLow,
      Medium: colors.intensityMed,
      High: colors.intensityHigh,
      Max: colors.intensityMax,
    }[value] || "#ccc"
  );

function Badge({ children, color = colors.accentLight, textColor = colors.accent, style }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        background: color,
        color: textColor,
        letterSpacing: 0.3,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", style, disabled }) {
  const base = {
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 6,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.15s",
    opacity: disabled ? 0.5 : 1,
  };

  const sizes = {
    sm: { padding: "5px 10px", fontSize: 12 },
    md: { padding: "8px 16px", fontSize: 13 },
    lg: { padding: "10px 20px", fontSize: 14 },
  };

  const variants = {
    primary: { background: colors.accent, color: "#fff" },
    secondary: {
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    },
    danger: { background: colors.dangerLight, color: colors.danger },
    ghost: { background: "transparent", color: colors.textMuted },
  };

  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, style, multiline, rows = 3 }) {
  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "inherit",
    background: "#fff",
    color: colors.text,
    resize: "vertical",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div style={{ marginBottom: 10 }}>
      {label ? (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: colors.textMuted,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </label>
      ) : null}
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} style={inputStyle} />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}

function Select({ label, value, onChange, options, style }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label ? (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: colors.textMuted,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </label>
      ) : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          fontSize: 13,
          background: "#fff",
          color: colors.text,
          ...style,
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiSelect({ label, selected = [], options, onChange }) {
  const toggle = (option) =>
    onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);

  return (
    <div style={{ marginBottom: 10 }}>
      {label ? (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: colors.textMuted,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </label>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            style={{
              padding: "3px 10px",
              borderRadius: 4,
              fontSize: 12,
              border: `1px solid ${selected.includes(option) ? colors.accent : colors.border}`,
              background: selected.includes(option) ? colors.accentLight : "#fff",
              color: selected.includes(option) ? colors.accent : colors.textMuted,
              cursor: "pointer",
              fontWeight: selected.includes(option) ? 600 : 400,
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onSelect }) {
  return (
    <div style={{ display: "flex", borderBottom: `2px solid ${colors.border}`, marginBottom: 20, overflowX: "auto" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onSelect(tab.key)}
          style={{
            padding: "10px 18px",
            background: "none",
            border: "none",
            borderBottom: active === tab.key ? `2px solid ${colors.accent}` : "2px solid transparent",
            color: active === tab.key ? colors.accent : colors.textMuted,
            fontWeight: active === tab.key ? 700 : 500,
            cursor: "pointer",
            fontSize: 14,
            marginBottom: -2,
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function DrillEditor({ drill, onChange, onDelete, index }) {
  const [open, setOpen] = useState(false);
  const update = (field, value) => onChange({ ...drill, [field]: value });

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, marginBottom: 10, background: colors.card, overflow: "hidden" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer", background: open ? colors.bg : colors.card, flexWrap: "wrap" }}
      >
        <span style={{ color: colors.textMuted, fontSize: 13, fontWeight: 700, minWidth: 24 }}>#{index + 1}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span style={{ fontWeight: 600, flex: 1, fontSize: 14, minWidth: 180 }}>{drill.name || "Unnamed Drill"}</span>
        <Badge color={`${intensityColor(drill.intensity)}33`} textColor={intensityColor(drill.intensity)} style={{ filter: "saturate(1.5)" }}>
          {drill.intensity}
        </Badge>
        <Badge>{drill.category}</Badge>
        <span style={{ fontSize: 12, color: colors.textMuted, display: "flex", alignItems: "center", gap: 3 }}>
          <Clock size={12} />
          {drill.duration} min
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          style={{ background: "none", border: "none", cursor: "pointer", color: colors.danger, padding: 4 }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      {open ? (
        <div style={{ padding: 16, borderTop: `1px solid ${colors.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0 16px" }}>
            <Input label="Drill Name" value={drill.name} onChange={(value) => update("name", value)} placeholder="e.g. Rapid Fire Low Saves" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 8px" }}>
              <Input label="Duration (min)" type="number" value={drill.duration} onChange={(value) => update("duration", parseInt(value, 10) || 0)} />
              <Input label="Sets" value={drill.sets} onChange={(value) => update("sets", value)} placeholder="e.g. 3" />
              <Input label="Reps" value={drill.reps} onChange={(value) => update("reps", value)} placeholder="e.g. 8" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0 16px" }}>
            <Select label="Category" value={drill.category} onChange={(value) => update("category", value)} options={SKILL_CATEGORIES} />
            <Select label="Intensity" value={drill.intensity} onChange={(value) => update("intensity", value)} options={INTENSITY} />
            <Input label="Player Count" value={drill.playerCount} onChange={(value) => update("playerCount", value)} placeholder="e.g. 2-4" />
          </div>
          <Input label="Description" value={drill.description} onChange={(value) => update("description", value)} multiline placeholder="Describe the drill setup and execution..." />
          <Input label="Coaching Points" value={drill.coachingPoints} onChange={(value) => update("coachingPoints", value)} multiline rows={2} placeholder="Key things to focus on and correct..." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0 16px" }}>
            <Input label="Progressions / Variations" value={drill.progressions} onChange={(value) => update("progressions", value)} multiline rows={2} placeholder="How to make it harder or easier..." />
            <Input label="Common Mistakes" value={drill.commonMistakes} onChange={(value) => update("commonMistakes", value)} multiline rows={2} placeholder="What to watch out for..." />
          </div>
          <MultiSelect label="Equipment" selected={drill.equipment} options={EQUIPMENT_OPTIONS} onChange={(value) => update("equipment", value)} />
          <Input label="Additional Notes" value={drill.notes} onChange={(value) => update("notes", value)} multiline rows={2} placeholder="Any extra notes..." />
        </div>
      ) : null}
    </div>
  );
}

function SessionEditor({ session, onChange, onBack }) {
  const update = (field, value) => onChange({ ...session, [field]: value });
  const updateDrill = (index, drill) => {
    const next = [...session.drills];
    next[index] = drill;
    update("drills", next);
  };
  const deleteDrill = (index) => update("drills", session.drills.filter((_, currentIndex) => currentIndex !== index));
  const addDrill = () => update("drills", [...session.drills, emptyDrill()]);
  const totalTime = session.drills.reduce((sum, drill) => sum + (drill.duration || 0), 0);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: colors.textMuted, marginBottom: 16, fontSize: 13, fontWeight: 600 }}
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 14 }}>
        <Input label="Session Name" value={session.name} onChange={(value) => update("name", value)} />
        <Select label="Primary Focus" value={session.focus} onChange={(value) => update("focus", value)} options={SKILL_CATEGORIES} />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <Badge color={colors.accentLight} textColor={colors.accent} style={{ fontSize: 13, padding: "6px 14px" }}>
          <Clock size={14} style={{ marginRight: 4, verticalAlign: "middle" }} /> {totalTime} min total
        </Badge>
        <Badge color={colors.warmLight} textColor="#92400e" style={{ fontSize: 13, padding: "6px 14px" }}>
          <Layers size={14} style={{ marginRight: 4, verticalAlign: "middle" }} /> {session.drills.length} drills
        </Badge>
        {session.phase ? (
          <Badge
            color={PHASES.find((phase) => phase.name === session.phase)?.bg || colors.bg}
            textColor={PHASES.find((phase) => phase.name === session.phase)?.color || colors.textMuted}
            style={{ fontSize: 13, padding: "6px 14px" }}
          >
            {session.phase}
          </Badge>
        ) : null}
      </div>
      {session.drills.map((drill, index) => (
        <DrillEditor key={drill.id} drill={drill} index={index} onChange={(nextDrill) => updateDrill(index, nextDrill)} onDelete={() => deleteDrill(index)} />
      ))}
      <Button onClick={addDrill} variant="secondary" style={{ marginTop: 8 }}>
        <Plus size={14} />
        Add Drill
      </Button>
    </div>
  );
}

function SessionCard({ session, onOpen, onDuplicate, onDelete }) {
  const totalTime = session.drills.reduce((sum, drill) => sum + (drill.duration || 0), 0);
  const phase = PHASES.find((item) => item.name === session.phase);

  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: 16,
        background: colors.card,
        cursor: "pointer",
        transition: "box-shadow 0.15s",
        borderLeft: phase ? `4px solid ${phase.color}` : undefined,
      }}
      onClick={onOpen}
      onMouseEnter={(event) => {
        event.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{session.name}</h3>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate"
            style={{ background: "none", border: "none", cursor: "pointer", color: colors.textMuted, padding: 4 }}
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            title="Delete"
            style={{ background: "none", border: "none", cursor: "pointer", color: colors.danger, padding: 4 }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        <Badge>{session.focus}</Badge>
        <Badge color={colors.bg} textColor={colors.textMuted}>
          <Clock size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />
          {totalTime}m
        </Badge>
        <Badge color={colors.bg} textColor={colors.textMuted}>{session.drills.length} drills</Badge>
      </div>
      <div style={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.4 }}>
        {session.drills.slice(0, 3).map((drill) => drill.name || "Unnamed").join(" -> ")}
        {session.drills.length > 3 ? " -> ..." : ""}
      </div>
    </div>
  );
}

function SessionPrintView({ session }) {
  const totalTime = session.drills.reduce((sum, drill) => sum + (drill.duration || 0), 0);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto", fontFamily: "Georgia, serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 8 }}>{session.name}</h1>
      <div style={{ display: "flex", gap: 20, marginBottom: 20, fontSize: 14, color: colors.textMuted, flexWrap: "wrap" }}>
        <span>
          Focus: <strong>{session.focus}</strong>
        </span>
        <span>
          Duration: <strong>{totalTime} min</strong>
        </span>
        <span>
          Drills: <strong>{session.drills.length}</strong>
        </span>
      </div>
      {session.drills.map((drill, index) => (
        <div key={drill.id} style={{ marginBottom: 18, padding: 14, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
            <h3 style={{ margin: 0, fontSize: 15 }}>
              #{index + 1} — {drill.name}
            </h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge color={`${intensityColor(drill.intensity)}44`} textColor="#333">
                {drill.intensity}
              </Badge>
              <Badge>{drill.category}</Badge>
              <Badge color={colors.bg} textColor={colors.textMuted}>
                {drill.duration}m
              </Badge>
            </div>
          </div>
          {drill.description ? <p style={{ margin: "6px 0", fontSize: 13, lineHeight: 1.5 }}>{drill.description}</p> : null}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "6px 20px", fontSize: 13, marginTop: 8 }}>
            {drill.reps ? (
              <div>
                <strong>Reps/Time:</strong> {drill.reps}
              </div>
            ) : null}
            {drill.playerCount ? (
              <div>
                <strong>Players:</strong> {drill.playerCount}
              </div>
            ) : null}
            {drill.equipment.length > 0 ? (
              <div>
                <strong>Equipment:</strong> {drill.equipment.join(", ")}
              </div>
            ) : null}
          </div>
          {drill.coachingPoints ? (
            <div style={{ marginTop: 8, padding: 10, background: colors.successLight, borderRadius: 6, fontSize: 13 }}>
              <strong style={{ color: colors.success }}>Coaching Points:</strong> {drill.coachingPoints}
            </div>
          ) : null}
          {drill.progressions ? (
            <div style={{ marginTop: 6, padding: 10, background: colors.accentLight, borderRadius: 6, fontSize: 13 }}>
              <strong style={{ color: colors.accent }}>Progressions:</strong> {drill.progressions}
            </div>
          ) : null}
          {drill.commonMistakes ? (
            <div style={{ marginTop: 6, padding: 10, background: colors.dangerLight, borderRadius: 6, fontSize: 13 }}>
              <strong style={{ color: colors.danger }}>Watch For:</strong> {drill.commonMistakes}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function WeekPlanner({ week, sessions, onChange }) {
  const update = (day, sessionId) =>
    onChange({
      ...week,
      days: {
        ...week.days,
        [day]: sessionId || null,
      },
    });

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16, background: colors.card, marginBottom: 14 }}>
      <Input label="Week Label" value={week.name} onChange={(value) => onChange({ ...week, name: value })} placeholder="e.g. Week 1 - Pre-Season Base" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 8, marginTop: 8 }}>
        {DAYS.map((day) => {
          const assigned = sessions.find((session) => session.id === week.days[day]);

          return (
            <div key={day} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, marginBottom: 6, textTransform: "uppercase" }}>{day.slice(0, 3)}</div>
              <select
                value={week.days[day] || ""}
                onChange={(event) => update(day, event.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 2px",
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  fontSize: 10,
                  background: week.days[day] ? colors.accentLight : "#fff",
                  color: week.days[day] ? colors.accent : colors.textMuted,
                }}
              >
                <option value="">Rest</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name.length > 30 ? `${session.name.slice(0, 30)}...` : session.name}
                  </option>
                ))}
              </select>
              {assigned ? <div style={{ fontSize: 10, color: colors.accent, marginTop: 4 }}>{assigned.drills.reduce((sum, drill) => sum + drill.duration, 0)}m</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlockEditor({ block, sessions, onChange, onDelete }) {
  const [open, setOpen] = useState(true);
  const update = (field, value) => onChange({ ...block, [field]: value });
  const updateWeek = (index, week) => {
    const next = [...block.weeks];
    next[index] = week;
    update("weeks", next);
  };
  const addWeek = () => update("weeks", [...block.weeks, emptyWeek()]);
  const removeWeek = (index) => update("weeks", block.weeks.filter((_, currentIndex) => currentIndex !== index));

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, marginBottom: 20, overflow: "hidden", background: colors.card }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", cursor: "pointer", background: open ? colors.bg : colors.card, borderBottom: open ? `1px solid ${colors.border}` : "none" }}
      >
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <span style={{ fontWeight: 700, flex: 1, fontSize: 16 }}>{block.name || "Unnamed Block"}</span>
        <Badge color={colors.warmLight} textColor="#92400e">
          {block.weeks.length} week{block.weeks.length !== 1 ? "s" : ""}
        </Badge>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          style={{ background: "none", border: "none", cursor: "pointer", color: colors.danger }}
        >
          <Trash2 size={16} />
        </button>
      </div>
      {open ? (
        <div style={{ padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 16 }}>
            <Input label="Block Name" value={block.name} onChange={(value) => update("name", value)} />
            <Input label="Block Goal" value={block.goal} onChange={(value) => update("goal", value)} placeholder="e.g. Build aerobic base and confidence" />
          </div>
          {block.weeks.map((week, index) => (
            <div key={week.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors.textMuted }}>WEEK {index + 1}</span>
                {block.weeks.length > 1 ? (
                  <button type="button" onClick={() => removeWeek(index)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.danger }}>
                    <X size={14} />
                  </button>
                ) : null}
              </div>
              <WeekPlanner week={week} sessions={sessions} onChange={(nextWeek) => updateWeek(index, nextWeek)} />
            </div>
          ))}
          <Button onClick={addWeek} variant="secondary" size="sm">
            <Plus size={14} />
            Add Week
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function PhaseSidebar({ activePhase, activeWeek, sessions, onSelectPhase, onSelectWeek }) {
  const weeksByPhase = useMemo(() => {
    const map = {};
    sessions.forEach((session) => {
      if (!session.phase) {
        return;
      }
      if (!map[session.phase]) {
        map[session.phase] = new Set();
      }
      map[session.phase].add(String(session.week));
    });
    return map;
  }, [sessions]);

  return (
    <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${colors.border}`, background: "#fff", padding: "12px 0", overflowY: "auto" }}>
      <div style={{ padding: "0 14px 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.textMuted, letterSpacing: 0.5 }}>Season Phases</div>
      <button
        type="button"
        onClick={() => {
          onSelectPhase(null);
          onSelectWeek(null);
        }}
        style={{ width: "100%", textAlign: "left", padding: "8px 14px", border: "none", background: !activePhase ? colors.accentLight : "transparent", color: !activePhase ? colors.accent : colors.text, cursor: "pointer", fontSize: 13, fontWeight: !activePhase ? 700 : 500 }}
      >
        All Sessions
      </button>
      {PHASES.map((phase) => (
        <div key={phase.num}>
          <button
            type="button"
            onClick={() => {
              onSelectPhase(phase.name);
              onSelectWeek(null);
            }}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 14px",
              border: "none",
              background: activePhase === phase.name && !activeWeek ? phase.bg : "transparent",
              color: activePhase === phase.name ? phase.color : colors.text,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activePhase === phase.name ? 700 : 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 4, background: phase.color, flexShrink: 0 }} />
            {phase.name}
          </button>
          {activePhase === phase.name && weeksByPhase[phase.name] ? (
            <div style={{ paddingLeft: 30 }}>
              {[...weeksByPhase[phase.name]]
                .sort((left, right) => {
                  const leftNumber = parseInt(left, 10);
                  const rightNumber = parseInt(right, 10);
                  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
                    return leftNumber - rightNumber;
                  }
                  return left.localeCompare(right);
                })
                .map((week) => (
                  <button
                    key={week}
                    type="button"
                    onClick={() => onSelectWeek(week)}
                    style={{ width: "100%", textAlign: "left", padding: "5px 10px", border: "none", background: activeWeek === week ? phase.bg : "transparent", color: activeWeek === week ? phase.color : colors.textMuted, cursor: "pointer", fontSize: 12, fontWeight: activeWeek === week ? 700 : 400, borderRadius: 4 }}
                  >
                    {Number.isNaN(parseInt(week, 10)) ? week : `Week ${week}`}
                  </button>
                ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("season");
  const [sessions, setSessions] = useState(() => expandRaw(RAW));
  const [blocks, setBlocks] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [viewingSession, setViewingSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activePhase, setActivePhase] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null);

  const filteredSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const normalizedSearch = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          session.name.toLowerCase().includes(normalizedSearch) ||
          session.drills.some((drill) => drill.name.toLowerCase().includes(normalizedSearch));
        const matchesCategory = filterCategory === "All" || session.focus === filterCategory;
        const matchesPhase = !activePhase || session.phase === activePhase;
        const matchesWeek = !activeWeek || String(session.week) === activeWeek;

        return matchesSearch && matchesCategory && matchesPhase && matchesWeek;
      }),
    [sessions, searchTerm, filterCategory, activePhase, activeWeek],
  );

  const addSession = () => {
    const session = emptySession();
    setSessions([...sessions, session]);
    setEditingSession(session.id);
  };

  const duplicateSession = (session) => {
    const nextSession = { ...JSON.parse(JSON.stringify(session)), id: uid(), name: `${session.name} (Copy)` };
    nextSession.drills = nextSession.drills.map((drill) => ({ ...drill, id: uid() }));
    setSessions([...sessions, nextSession]);
  };

  const updateSession = (updatedSession) =>
    setSessions(sessions.map((session) => (session.id === updatedSession.id ? updatedSession : session)));

  const deleteSession = (id) => {
    setSessions(sessions.filter((session) => session.id !== id));
    if (editingSession === id) {
      setEditingSession(null);
    }
  };

  const addBlock = () => setBlocks([...blocks, emptyBlock()]);
  const updateBlock = (index, block) => setBlocks(blocks.map((item, currentIndex) => (currentIndex === index ? block : item)));
  const deleteBlock = (index) => setBlocks(blocks.filter((_, currentIndex) => currentIndex !== index));

  if (viewingSession) {
    const session = sessions.find((item) => item.id === viewingSession);

    return (
      <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ padding: "12px 24px", background: "#fff", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Button onClick={() => setViewingSession(null)} variant="ghost">
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button
            onClick={() => {
              if (!session) {
                return;
              }
              setViewingSession(null);
              setEditingSession(session.id);
              setTab("season");
            }}
            variant="secondary"
          >
            <Edit3 size={14} />
            Edit
          </Button>
        </div>
        {session ? <SessionPrintView session={session} /> : null}
      </div>
    );
  }

  const editing = sessions.find((session) => session.id === editingSession);
  const weekFocus = activeWeek && filteredSessions.length > 0 ? filteredSessions[0].weekFocus : null;
  const totalDrillsCount = sessions.reduce((sum, session) => sum + session.drills.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: colors.text }}>
      <div style={{ background: "#fff", borderBottom: `1px solid ${colors.border}`, padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: colors.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>GK Coach Planner</h1>
              <p style={{ margin: 0, fontSize: 11, color: colors.textMuted }}>College Soccer • Full Fall Season • 3 GKs • Planner Website</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge color={colors.successLight} textColor={colors.success} style={{ fontSize: 12, padding: "5px 12px" }}>
              {sessions.length} Sessions
            </Badge>
            <Badge color={colors.warmLight} textColor="#92400e" style={{ fontSize: 12, padding: "5px 12px" }}>
              {totalDrillsCount} Drills
            </Badge>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
        <Tabs
          active={tab}
          onSelect={(nextTab) => {
            setTab(nextTab);
            setEditingSession(null);
          }}
          tabs={[
            { key: "season", label: "Season Plan", icon: <Calendar size={16} /> },
            { key: "sessions", label: "All Sessions", icon: <Target size={16} /> },
            { key: "periodization", label: "Custom Blocks", icon: <Layers size={16} /> },
          ]}
        />

        {tab === "season" && !editing ? (
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            <div style={{ width: "100%", maxWidth: 220 }}>
              <PhaseSidebar activePhase={activePhase} activeWeek={activeWeek} sessions={sessions} onSelectPhase={setActivePhase} onSelectWeek={setActiveWeek} />
            </div>
            <div style={{ flex: 1, minWidth: 300, paddingLeft: 20 }}>
              {weekFocus ? (
                <div style={{ marginBottom: 14, padding: "10px 14px", background: "#fff", border: `1px solid ${colors.border}`, borderRadius: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>Week Focus:</span>{" "}
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{weekFocus}</span>
                </div>
              ) : null}
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search sessions or drills..." style={{ flex: 1, minWidth: 220, padding: "7px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13 }} />
                <Button onClick={addSession} size="sm">
                  <Plus size={14} />
                  New
                </Button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                {filteredSessions.map((session) => (
                  <SessionCard key={session.id} session={session} onOpen={() => setEditingSession(session.id)} onDuplicate={() => duplicateSession(session)} onDelete={() => deleteSession(session.id)} />
                ))}
              </div>
              {filteredSessions.length === 0 ? (
                <div style={{ textAlign: "center", padding: 50, color: colors.textMuted }}>
                  <Target size={36} style={{ opacity: 0.3, marginBottom: 10 }} />
                  <p>No sessions for this filter.</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {tab === "season" && editing ? (
          <>
            <Button onClick={() => setViewingSession(editing.id)} variant="secondary" size="sm" style={{ marginBottom: 12 }}>
              <CheckCircle2 size={14} />
              View Session
            </Button>
            <SessionEditor session={editing} onChange={updateSession} onBack={() => setEditingSession(null)} />
          </>
        ) : null}

        {tab === "sessions" && !editing ? (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search..." style={{ flex: 1, minWidth: 180, padding: "7px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13 }} />
              <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} style={{ padding: "7px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13 }}>
                <option value="All">All Categories</option>
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Button onClick={addSession}>
                <Plus size={14} />
                New Session
              </Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {sessions
                .filter((session) => {
                  const matchesSearch = !searchTerm || session.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = filterCategory === "All" || session.focus === filterCategory;
                  return matchesSearch && matchesCategory;
                })
                .map((session) => (
                  <SessionCard key={session.id} session={session} onOpen={() => setEditingSession(session.id)} onDuplicate={() => duplicateSession(session)} onDelete={() => deleteSession(session.id)} />
                ))}
            </div>
          </div>
        ) : null}

        {tab === "sessions" && editing ? (
          <>
            <Button onClick={() => setViewingSession(editing.id)} variant="secondary" size="sm" style={{ marginBottom: 12 }}>
              <CheckCircle2 size={14} />
              View
            </Button>
            <SessionEditor session={editing} onChange={updateSession} onBack={() => setEditingSession(null)} />
          </>
        ) : null}

        {tab === "periodization" ? (
          <div>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Custom Training Blocks</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.textMuted }}>Create your own blocks and assign sessions to days.</p>
              </div>
              <Button onClick={addBlock}>
                <Plus size={14} />
                New Block
              </Button>
            </div>
            {blocks.map((block, index) => (
              <BlockEditor key={block.id} block={block} sessions={sessions} onChange={(nextBlock) => updateBlock(index, nextBlock)} onDelete={() => deleteBlock(index)} />
            ))}
            {blocks.length === 0 ? (
              <div style={{ textAlign: "center", padding: 50, color: colors.textMuted }}>
                <Calendar size={36} style={{ opacity: 0.3, marginBottom: 10 }} />
                <p>No custom blocks yet. Your full season is already organized in the Season Plan tab.</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
