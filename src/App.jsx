import { useState, useMemo } from "react";
import { Plus, Trash2, Edit3, Copy, ChevronDown, ChevronRight, Clock, Target, Shield, ArrowLeft, AlertCircle, CheckCircle2, Calendar, Layers, X, Search, Filter, Zap, BookOpen, Dumbbell, Eye, MessageSquare, Move, Crosshair, Brain, Heart, Flag } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 10);

// ─── Categories & Constants ──────────────────────────────────────
const CATEGORIES = [
  { key: "shot-stopping", label: "Shot Stopping", icon: "\u{1F9E4}", color: "#2563eb", bg: "#dbeafe", desc: "Saves from driven shots, volleys, close-range, and long-range" },
  { key: "diving", label: "Diving", icon: "\u{1F938}", color: "#7c3aed", bg: "#ede9fe", desc: "Collapse dives, extension dives, low dives, recovery dives" },
  { key: "reflexes", label: "Reflexes & Reactions", icon: "\u26A1", color: "#dc2626", bg: "#fee2e2", desc: "Reaction speed, hand-eye coordination, rapid-fire saves" },
  { key: "footwork", label: "Footwork & Agility", icon: "\u{1F45F}", color: "#0891b2", bg: "#cffafe", desc: "Lateral shuffles, agility patterns, explosive movement" },
  { key: "positioning", label: "Positioning & Angles", icon: "\u{1F4D0}", color: "#ea580c", bg: "#ffedd5", desc: "Angle play, set position, narrowing, depth management" },
  { key: "distribution", label: "Distribution", icon: "\u{1F9B6}", color: "#16a34a", bg: "#dcfce7", desc: "Throws, kicks, goal kicks, playing out from back, sweeper" },
  { key: "crosses", label: "Crosses & High Balls", icon: "\u2708\uFE0F", color: "#be185d", bg: "#fce7f3", desc: "Claiming, punching, box command, corner management" },
  { key: "1v1", label: "1v1 Situations", icon: "\u{1F3AF}", color: "#9333ea", bg: "#f3e8ff", desc: "Breakaways, closing down, smothering, staying on feet" },
  { key: "set-pieces", label: "Set Pieces & Penalties", icon: "\u{1F3C1}", color: "#b45309", bg: "#fef3c7", desc: "Corner organization, free kicks, wall setup, penalty routines" },
  { key: "communication", label: "Communication & Leadership", icon: "\u{1F4E2}", color: "#0d9488", bg: "#ccfbf1", desc: "Box command, back-line management, vocal presence" },
  { key: "physical", label: "Physical Conditioning", icon: "\u{1F4AA}", color: "#e11d48", bg: "#ffe4e6", desc: "GK-specific power, plyometrics, endurance under fatigue" },
  { key: "mental", label: "Mental & Decision Making", icon: "\u{1F9E0}", color: "#6366f1", bg: "#e0e7ff", desc: "Visualization, pressure training, decision speed, confidence" },
  { key: "recovery", label: "Warm-Up & Recovery", icon: "\u{1F504}", color: "#65a30d", bg: "#ecfccb", desc: "Dynamic warm-ups, cool downs, mobility, active recovery" },
];

const INTENSITY = ["Low", "Medium", "High", "Max"];
const EQUIPMENT_OPTIONS = [
  "Cones", "Poles", "Hurdles", "Mannequins", "Balls", "GK Gloves",
  "Resistance Bands", "Agility Ladder", "Mini Goals", "Rebounder",
  "Tennis Balls", "Medicine Ball", "Speed Rings", "Reaction Ball", "BlazePod/Lights"
];

// ─── DRILL LIBRARY (150+) ────────────────────────────────────────
const DRILL_LIBRARY = [
  // ══════ SHOT STOPPING ══════
  { id: "ss1", cat: "shot-stopping", name: "Rapid Fire Triangle", dur: 15, int: "High", desc: "Three servers at 10-12 yards at different angles around the box. Each fires in rapid succession \u2014 GK must reset between each shot. Rotate server positions after each set.", reps: "3 sets x 10-12 shots", eq: ["Cones", "Balls", "GK Gloves"], cp: "Proper ready position between saves. Feet shoulder-width, weight on balls of feet. Set position fast \u2014 don't be caught moving. Hands in front of body.", prog: "Add height variations; vary shot types (driven, curled); introduce rebounds after saves", mistakes: "Dropping hands between shots; poor footwork leading to late positioning; losing focus mid-sequence" },
  { id: "ss2", cat: "shot-stopping", name: "Close-Range Volley Drill", dur: 12, int: "High", desc: "Server 6-8 yards out strikes volleys at varying heights and speeds. No settling time \u2014 GK practices handling shots in the air. Rotate every 15 shots.", reps: "3 sets x 15 volleys", eq: ["Balls", "GK Gloves"], cp: "Stay compact and controlled. Proper hand positioning before ball arrives. Secure ball immediately \u2014 no spills. Feet balanced throughout.", prog: "Increase speed; vary height significantly; move server to different angles; add directional changes", mistakes: "Overextending arms; poor footwork; spilling catches; improper body shape for volley height" },
  { id: "ss3", cat: "shot-stopping", name: "Post-Save Rebound Pressure", dur: 15, int: "High", desc: "Server shoots from 8 yards. Immediately after save, attacker rushes in from side to challenge for loose ball or rebound. GK must secure possession, distribute, or make second save.", reps: "3 sets x 10 sequences", eq: ["Balls", "Cones", "GK Gloves"], cp: "Secure ball immediately. Quick decision: distribute vs hold. Position yourself between ball and incoming attacker.", prog: "Increase attacker speed; add second attacker; reduce reaction time between shot and rush", mistakes: "Slow ball security; fumbling; poor communication; weak distribution under pressure" },
  { id: "ss4", cat: "shot-stopping", name: "Long-Range Shot Handling", dur: 15, int: "Medium", desc: "3-4 servers at 18-25 yards from goal at different angles. Powerful, driven shots with flight time. GK reads trajectory and positions early.", reps: "3 sets x 12 shots", eq: ["Balls", "Cones", "GK Gloves"], cp: "Positioning depth matters \u2014 don't be too far off the line. Read flight early. Move efficiently without over-committing. Hands ready at proper height.", prog: "Add curl/bend; vary height; introduce deflections; rapid sequence", mistakes: "Starting too far from goal line; premature dive; poor flight tracking; slow lateral movement" },
  { id: "ss5", cat: "shot-stopping", name: "Set Position & Stance Foundation", dur: 10, int: "Low", desc: "GKs stand on goal line. Coach calls 'set' \u2014 drop into stance. Coach checks: feet shoulder-width, weight on balls of feet, hands up, eyes forward. Reset and repeat.", reps: "3 x 10 reps", eq: ["Cones", "GK Gloves"], cp: "Soft knees, chin over toes, hands ready at hip height. Build the habit \u2014 this is the foundation of every save.", prog: "Add lateral shuffle between sets; increase tempo of calls; add shot immediately after set", mistakes: "Leaning back on heels; hands too low; feet too narrow; weight on heels" },
  { id: "ss6", cat: "shot-stopping", name: "W-Grip Catching Form", dur: 10, int: "Low", desc: "Coach throws balls at varying heights from 8m. Focus only on hand shape \u2014 thumbs together behind ball on high catches, pinkies together on low. No pressure.", reps: "3 x 12 catches each", eq: ["Balls", "GK Gloves"], cp: "Lock the W shape. No chicken wings. Ball into chest on completion. Meet the ball \u2014 don't wait for it.", prog: "Increase throw speed; add angles; progress to driven balls; combine with movement", mistakes: "Fingers not spread properly; catching behind head; not cushioning into chest" },
  { id: "ss7", cat: "shot-stopping", name: "Combination Play + Shot", dur: 15, int: "High", desc: "Two players play a 1-2 combination ending in a shot from 16m. GK must track ball movement through the combination and get set before the shot.", reps: "3 x 8 combos each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Track the ball through the combination \u2014 adjust position as ball moves. Get set as striker prepares to shoot.", prog: "Add more passing combinations; increase speed of play; add deflectors", mistakes: "Not adjusting position during combination; caught moving when shot is taken" },
  { id: "ss8", cat: "shot-stopping", name: "Live Shooting Game", dur: 15, int: "Max", desc: "Three outfield players take turns shooting from edge of box at match speed. No slow deliveries. GK rotates every 6 shots. Full competitive intensity.", reps: "4 rounds x 6 shots each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Compete \u2014 this is a game. Celebrate saves. Review position after each. Match mentality.", prog: "Increase number of shooters; add combination play before shots; add time pressure", mistakes: "Lack of intensity; not resetting between shots; passive body language" },
  { id: "ss9", cat: "shot-stopping", name: "Driven Shots from Edge of Box", dur: 15, int: "High", desc: "Three outfield players shoot from various spots on the edge of the 18 at match speed. No slow deliveries. GK rotates every 8 shots.", reps: "4 x 8 shots per GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Set before shot. Explode to the corner. Read the shooter's body shape.", prog: "Add combination play before shot; increase shot variety; add second-ball pressure", mistakes: "Poor starting position; diving too early; not reading the shooter" },
  { id: "ss10", cat: "shot-stopping", name: "Screened Shot Reactions", dur: 12, int: "High", desc: "Two players stand between shooter and GK (5m out). Shooter fires from 20m \u2014 ball is unsighted until it passes the screen. GK reacts to late sight of ball.", reps: "4 x 8 shots", eq: ["Balls", "Cones", "GK Gloves", "Mannequins"], cp: "Stay in line with shooter's hips, not the screen. Pick ball up at edge of screen. Stay on your toes.", prog: "Add more screens; vary shooting positions; increase shot speed", mistakes: "Lining up with screen instead of shooter; dropping concentration; guessing" },
  { id: "ss11", cat: "shot-stopping", name: "High-Ball + Secondary Low Shot", dur: 15, int: "High", desc: "Cross delivered high \u2014 GK punches or catches. Immediately, second ball driven low to corner. Tests reaction after aerial action.", reps: "4 x 8 sequences each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Land balanced. Scan for second ball before feet hit ground. Quick transition from aerial to shot-stopping.", prog: "Decrease time between balls; add third ball; vary angles", mistakes: "Landing off-balance; slow recovery after aerial; not scanning for second ball" },

  // ══════ DIVING ══════
  { id: "dv1", cat: "diving", name: "Kneeling Dive Progression", dur: 10, int: "Low", desc: "Start on knees. Partner throws ball to side at ground level. GK performs proper diving shape: bottom leg extended, top hand over ball, bottom hand under. Progress to standing.", reps: "3 x 10 (5 each side)", eq: ["Balls", "GK Gloves"], cp: "Lead with the hand \u2014 not the shoulder. Watch ball into hands. Bottom hand first, top hand secures.", prog: "Increase throw distance; add height variations; progress to standing; add footwork before dive", mistakes: "Leading with shoulder; not securing ball against ground; tensing up" },
  { id: "dv2", cat: "diving", name: "Collapse Dive Technique", dur: 12, int: "Medium", desc: "From standing, GK takes one step at 45 degrees, then collapses to save low ball. Coach delivers ball. Focus on controlled descent and proper body shape.", reps: "3 x 8 each side", eq: ["Balls", "GK Gloves", "Cones"], cp: "Head still on dive. Bottom hand first, top hand over ball. Don't fall \u2014 drive into the save. Land on the side, not the front.", prog: "Increase delivery speed; add footwork before dive; combine with recovery requirement", mistakes: "Falling backwards instead of forward and across; shoulder leading instead of hands" },
  { id: "dv3", cat: "diving", name: "Power Step + Extension Dive", dur: 15, int: "High", desc: "GK takes one power step at 45 degrees out, then fully extends to save wide ball. Coach throws 1.5m outside comfortable reach. Both sides.", reps: "4 x 6 each side", eq: ["Balls", "GK Gloves"], cp: "Power step at 45 degrees \u2014 not sideways. Explosive drive off that foot. Full horizontal extension. Reach with top hand.", prog: "Increase distance; faster delivery; add one-handed parry focus; combine with recovery", mistakes: "Step too lateral; jumping instead of driving; poor hand positioning" },
  { id: "dv4", cat: "diving", name: "Recovery Dive Sequence", dur: 15, int: "High", desc: "GK makes first save (low dive), immediately recovers to feet, makes second save in opposite direction. Tests recovery explosiveness.", reps: "3 x 10 double-dives", eq: ["Balls", "GK Gloves"], cp: "Quick recovery \u2014 push off ground with hands. Proper reset before second dive. Maintain technique despite fatigue.", prog: "Reduce recovery time; add third dive; increase shot speed; add attacker pressure", mistakes: "Slow recovery from ground; poor technique on second dive; overcommitting to first" },
  { id: "dv5", cat: "diving", name: "Three-Ball Sequence", dur: 12, int: "High", desc: "3 balls in quick succession: ball 1 central (set), ball 2 far left (collapse), ball 3 far right (extension). No pause between.", reps: "4 x 3-ball sets each GK", eq: ["Balls", "GK Gloves"], cp: "Get up between balls. Hands ready on reset. Each save is a fresh save.", prog: "Increase speed; vary sequence order; add fourth ball; increase shot power", mistakes: "Staying on ground; slow hand reset; anticipating direction" },
  { id: "dv6", cat: "diving", name: "Side-Shuffle to Dive", dur: 12, int: "Medium", desc: "GK shuffles laterally along goal line. Coach calls 'freeze' \u2014 GK stops, coach delivers ball requiring immediate dive.", reps: "3 x 10 dives", eq: ["Balls", "Cones", "GK Gloves"], cp: "Efficient shuffle \u2014 small steps, knees bent. Immediate stop and reset. Quick dive initiation from stationary.", prog: "Increase shuffle speed; vary freeze positions; increase dive difficulty; multiple dives per sequence", mistakes: "Slow shuffle; poor balance at reset; delayed dive initiation" },
  { id: "dv7", cat: "diving", name: "High Extension Saves", dur: 12, int: "High", desc: "Coach throws ball to GK's side just out of comfortable reach at head height. GK fully extends \u2014 bottom leg drives, top hand reaches.", reps: "4 x 6 each side", eq: ["Balls", "GK Gloves"], cp: "Push off inside foot. Reach with top hand. Jump off both feet for maximum height.", prog: "Increase distance; faster delivery; add contested header; one-handed parry focus", mistakes: "Insufficient first step; loss of body control in air; reaching too late" },
  { id: "dv8", cat: "diving", name: "45-Degree Angle Focus Drill", dur: 10, int: "Low", desc: "Dedicated technical drill focusing on the crucial 45-degree angle of first step. Coach monitors and corrects. Slow, repetition-heavy.", reps: "4 x 12 dives (6 per angle)", eq: ["Balls", "Cones", "GK Gloves"], cp: "First step MUST be at 45 degrees. Second step is driving leg. Weight transfer through entire foot.", prog: "Increase speed maintaining angle; add complexity; transition to game speed", mistakes: "Step too lateral; step too forward; poor weight transfer; hip misalignment" },
  { id: "dv9", cat: "diving", name: "Reverse Cross-Step + Collapse", dur: 12, int: "Medium", desc: "GK takes 2 crossover steps one direction, then collapses opposite. Coach delivers ball 0.5s after movement starts. Builds recovery pattern.", reps: "3 x 8 each direction", eq: ["Balls", "Cones", "GK Gloves"], cp: "Head still on dive. Bottom hand first, top hand over. Quick feet to reset direction.", prog: "Increase speed; add random changes; combine with second save", mistakes: "Slow crossover; head movement on dive; reaching instead of diving" },

  // ══════ REFLEXES & REACTIONS ══════
  { id: "rx1", cat: "reflexes", name: "Tennis Ball Drop Reactions", dur: 10, int: "Medium", desc: "GK faces away. Coach holds two tennis balls at shoulder height. On call, GK turns \u2014 coach drops one randomly. Must catch before second bounce.", reps: "4 x 10 drops each GK", eq: ["Tennis Balls"], cp: "Explosive first step. Eyes immediately to ball after turn. Drive explosively.", prog: "Higher drop; sequential drops; no verbal cue; add movement requirement", mistakes: "Slow reaction; delayed visual acquisition; heavy feet" },
  { id: "rx2", cat: "reflexes", name: "Rebounder Rapid Fire", dur: 12, int: "High", desc: "GK 3m from rebounder. Coach fires drives \u2014 ball bounces back at unpredictable angle. 6 balls in sequence, no rest.", reps: "5 x 6-ball sets", eq: ["Rebounder", "Balls", "GK Gloves"], cp: "Stay in the moment. Short memory. Quick hands, don't overthink. Stay on feet where possible.", prog: "Increase fire speed; vary angles; add sprint between sets; combine with recovery saves", mistakes: "Staying on ground; slow recovery; overthinking; loss of concentration" },
  { id: "rx3", cat: "reflexes", name: "Reaction Ball Wall Drill", dur: 10, int: "Medium", desc: "GK faces wall 2-3m away. Throws reaction ball against wall. Ball bounces at random angles. Catch or parry.", reps: "3 x 3-minute sessions", eq: ["Reaction Ball"], cp: "Hand readiness throughout. Anticipate angles. Quick lateral movement.", prog: "Increase force; vary distances; add catch-only requirement; timed challenge", mistakes: "Overcommitting before bounce; slow lateral reaction; poor hand positioning" },
  { id: "rx4", cat: "reflexes", name: "Three-Server Layered Rapid Fire", dur: 15, int: "Max", desc: "Three coaches at different angles each with a ball. GK saves one \u2014 immediately turns to next server. Rotates clockwise. No rest.", reps: "4 x 9-ball sets", eq: ["Balls", "Cones", "GK Gloves"], cp: "Find the ball fast. Communicate direction to yourself. Stay hungry.", prog: "Add fourth server; increase power; decrease time between serves; add screens", mistakes: "Slow visual scanning; not resetting position; fatigue causing breakdown" },
  { id: "rx5", cat: "reflexes", name: "Deflection Save Drill", dur: 12, int: "High", desc: "Player shoots from 25m at a cone/mannequin 12m out. Ball deflects unpredictably. GK reads and saves the deflection.", reps: "4 x 8 deflections", eq: ["Balls", "Cones", "Mannequins", "GK Gloves"], cp: "Watch shooter's body \u2014 not the cone. Be ready to adjust mid-dive. Stay on toes.", prog: "Increase power; vary deflection points; add multiple deflectors", mistakes: "Watching deflector; committing before deflection; flat-footed" },
  { id: "rx6", cat: "reflexes", name: "Sound Cue Reaction Drill", dur: 10, int: "Medium", desc: "GK faces away or eyes closed. Coach makes sound. On signal, GK turns and reacts to already-revealed ball. Audio-to-visual transition.", reps: "3 x 12-15 reactions", eq: ["Balls", "GK Gloves"], cp: "Audio processing speed. Transition to visual focus. Position adjustment speed.", prog: "Vary sounds; vary ball difficulty; reduce reaction window; combine cues", mistakes: "Slow processing; delayed pickup; over-anticipation" },
  { id: "rx7", cat: "reflexes", name: "Close-Range Point-Blank Fire", dur: 10, int: "Max", desc: "Coach fires from point-blank range at rebounder 2m in front of GK. GK saves the rebound. 6 balls with 3-second intervals.", reps: "5 x 6-ball sets", eq: ["Rebounder", "Balls", "GK Gloves"], cp: "Stay on feet. Quick hands. Get up fast \u2014 second ball is always coming.", prog: "Decrease intervals; increase power; add directional constraint", mistakes: "Going to ground unnecessarily; slow hands; loss of concentration" },
  { id: "rx8", cat: "reflexes", name: "Mirror Reaction Drill", dur: 8, int: "Medium", desc: "GK faces partner 2-3m away. Partner performs random movements. GK mirrors instantly. Develops reaction and body control.", reps: "3 x 2-3 min sessions", eq: [], cp: "Reaction speed. Movement quality. Footwork precision. Balance.", prog: "Increase speed; add randomness; incorporate GK movements; add ball at end", mistakes: "Delayed reaction; poor accuracy; loss of balance; anticipating" },
  { id: "rx9", cat: "reflexes", name: "Agility Ladder + Reaction Save", dur: 12, int: "High", desc: "GK runs through agility ladder, exits, coach immediately delivers ball requiring save. Combines footwork with reaction after fatigue.", reps: "3 x 10 sequences", eq: ["Agility Ladder", "Balls", "GK Gloves"], cp: "Ladder footwork speed. Transition speed to save position. Technique despite exertion.", prog: "Increase ladder complexity; vary patterns; increase ball difficulty", mistakes: "Slow in ladder; poor transition; technique breakdown" },

  // ══════ FOOTWORK & AGILITY ══════
  { id: "fw1", cat: "footwork", name: "10-Yard Lateral Shuffle", dur: 8, int: "Medium", desc: "Two cones 10 yards apart. Shuffle to one cone, touch, shuffle back, then opposite. Small, quick steps \u2014 feet never cross.", reps: "3 sets x 8-10 reps", eq: ["Cones"], cp: "Small quick steps. Stay low. Ready position throughout. Head stays still.", prog: "Increase distance; add reactive element; add saves at end; timed", mistakes: "Crossing feet; large strides; standing upright; hands down" },
  { id: "fw2", cat: "footwork", name: "T-Drill Footwork", dur: 10, int: "High", desc: "T-shape cones. Sprint forward, shuffle left, shuffle right through center, sprint backward to base. Multi-directional.", reps: "2 sets x 6-8 reps", eq: ["Cones"], cp: "Explosive forward sprint. Quick shuffles. Controlled backward. Proper deceleration.", prog: "Increase distances; add save at end; timed competition; reactive directions", mistakes: "Poor deceleration; crossing feet; standing upright; losing balance" },
  { id: "fw3", cat: "footwork", name: "Agility Ladder In-and-Out", dur: 8, int: "Medium", desc: "In-and-out patterns through agility ladder. Both feet in each square, one foot out to side, repeat. Light, quick touches.", reps: "3-4 rounds of full ladder", eq: ["Agility Ladder"], cp: "Light contact. Consistent rhythm. Arms efficient. Eyes forward, not down.", prog: "Add lateral movement; increase speed; reactive element; saves post-ladder", mistakes: "Heavy feet; looking down; losing rhythm; inconsistent spacing" },
  { id: "fw4", cat: "footwork", name: "Box Shuffle Drill", dur: 10, int: "Medium", desc: "Four cones in 8x8 yard square. Shuffle to each corner, touch, return to center. Repeat continuously.", reps: "2-3 sets x 3-4 sequences", eq: ["Cones"], cp: "Small shuffle steps. Tight deceleration. Quick adjustment. Hands active.", prog: "Reduce size; increase speed; reactive calls; saves at each corner; timed", mistakes: "Large strides; losing balance; overshooting; hands down" },
  { id: "fw5", cat: "footwork", name: "Basic Footwork Ladder Patterns", dur: 8, int: "Low", desc: "Agility ladder: two-feet-in each rung, lateral shuffle, crossover step. Foundation footwork.", reps: "4 passes each pattern", eq: ["Agility Ladder"], cp: "Light on feet, don't stare down. Head up. Rhythm before speed.", prog: "More complex patterns; increase speed; combine with catching; direction changes", mistakes: "Looking down; heavy feet; inconsistent rhythm; poor posture" },
  { id: "fw6", cat: "footwork", name: "Reactive Multi-Direction Changes", dur: 12, int: "High", desc: "GK in center of 20x20 box. Coach calls direction. Accelerate 8-10 yards, decelerate, plant, return.", reps: "2 sets x 15-20 changes", eq: ["Cones"], cp: "Explosive first step. Controlled deceleration. Plant properly. Ready position on return.", prog: "Increase pace; add fakes; add save at endpoint; verbal repeats; increase distance", mistakes: "Slow first step; overrunning; anticipating; poor ready position" },
  { id: "fw7", cat: "footwork", name: "Lateral Bound Power Drill", dur: 10, int: "High", desc: "Powerful side-to-side bounds between cones 12 yards apart. Land and set ready position. Explosive push-off.", reps: "2 sets x 8-10 bounds", eq: ["Cones"], cp: "Explosive push-off. Land on balls of feet. Immediate stabilization. Ready position maintained.", prog: "Increase distance; add save at boundary; directed bounds; reactive element", mistakes: "Weak push-off; heavy landing; slow ready position; inconsistent stance" },
  { id: "fw8", cat: "footwork", name: "Post-to-Post Movement", dur: 10, int: "Medium", desc: "Start on right post. Coach calls 'go' \u2014 shuffle across to left post and set. Coach shoots immediately.", reps: "4 x 8 reps", eq: ["Balls", "GK Gloves", "Cones"], cp: "Stay on toes. Arrive set, not still moving. Quick feet across face of goal.", prog: "Increase shot speed; random post; add second shot; decrease set time", mistakes: "Crossing feet; arriving off-balance; still moving when shot struck" },
  { id: "fw9", cat: "footwork", name: "Pressure Advance & Recovery", dur: 12, int: "High", desc: "GK 6 yards from line. Coach at 20 yards. On signal, advance explosively. Coach passes or fakes. Recover to goal line.", reps: "2 sets x 10-12 sequences", eq: ["Balls", "Cones"], cp: "Explosive advance. Controlled stop. Recovery = advance speed. Set before reaching line.", prog: "Increase distance; add decision element; increase pace; add save on recovery", mistakes: "Slow advance; uncontrolled recovery; loss of balance; eyes off ball" },
  { id: "fw10", cat: "footwork", name: "Shuffle + Low Drive Save", dur: 12, int: "High", desc: "Cones 3m apart, 10m from goal. Shuffle between cones, coach fires low drive after GK touches cone. Alternating sides.", reps: "4 x 8 shots each", eq: ["Balls", "Cones", "GK Gloves"], cp: "Don't dive until necessary. Block with body. Quick feet between cones.", prog: "Increase distance; speed; add second ball; decrease reaction time", mistakes: "Diving when could use feet; slow shuffle; not setting before shot" },

  // ══════ POSITIONING & ANGLES ══════
  { id: "ps1", cat: "positioning", name: "Angle-Setting with Cones", dur: 12, int: "Medium", desc: "Cones marking optimum GK position for 5 positions around the box. Sprint to correct cone and set before coach shoots.", reps: "3 x 10 positions", eq: ["Cones", "Balls", "GK Gloves"], cp: "Bisect the angle. Arrive set before ball struck. String theory: line from ball through body to goal center.", prog: "Increase shot speed; add movement; randomize; add deception", mistakes: "Too close; too deep; still moving when shot comes" },
  { id: "ps2", cat: "positioning", name: "Near-Post Blocking", dur: 12, int: "Medium", desc: "Coach wide at edge of box. GK gets near post, stays on feet, makes body big. Low driven shot. Save and recover.", reps: "4 x 6 shots each side", eq: ["Balls", "Cones", "GK Gloves"], cp: "Shoulder on post, step out one. Don't go to ground early. Stay big.", prog: "Increase speed; add far-post shots; vary distances; rebound pressure", mistakes: "Going to ground early; on goal line; body too narrow" },
  { id: "ps3", cat: "positioning", name: "Multi-Angle Shooting Pressure", dur: 15, int: "High", desc: "4-6 shooting positions around penalty area. Attackers shoot sequentially. GK rapidly adjusts using string theory.", reps: "2 sets x 10-12 shots", eq: ["Balls", "Cones", "GK Gloves"], cp: "Pre-shot: feet set, knees soft, hands ready. Body between ball and goal. Distance varies with angle.", prog: "Increase pace; decrease recovery; add deflections; distribution after save", mistakes: "Slow lateral; over-committing; hands down; body not square" },
  { id: "ps4", cat: "positioning", name: "Sweeper-Keeper High Line", dur: 15, int: "High", desc: "GK as sweeper behind high line. Coach plays balls over line randomly. Decide: sweep/collect OR retreat.", reps: "4 x 8 decisions", eq: ["Balls", "Cones"], cp: "If ball past halfway between GK and striker \u2014 retreat. Otherwise go. Loud decision. Diagonal sprint.", prog: "Add attackers; vary starting position; multiple threats; consequences", mistakes: "Too deep; too high; hesitation; quiet decisions" },
  { id: "ps5", cat: "positioning", name: "2v1 and 3v1 Overload Coverage", dur: 15, int: "High", desc: "Multiple attackers pass and move creating opportunities. GK covers primary threat while monitoring secondary.", reps: "10 x 2v1 + 8 x 3v1", eq: ["Balls", "Cones"], cp: "Identify primary/secondary threats. Position for primary; eyes monitor secondary. React to ball, not attacker.", prog: "Better attackers; vary positions; time pressure; add defenders", mistakes: "Wrong attacker; over-committing; slow reaction to pass" },
  { id: "ps6", cat: "positioning", name: "Rapid Recovery & Rebound Position", dur: 12, int: "High", desc: "Shot with rebound likely. Make initial save, immediately recover for second phase.", reps: "2 sets x 10-12 sequences", eq: ["Balls", "GK Gloves"], cp: "Solid first save. Immediate recovery. Reset ready position. Cover rebound area. Eyes on loose ball.", prog: "Increase power; realistic rebounds; contesting attackers; tighter space", mistakes: "Slow recovery; poor position after save; not covering rebound area" },

  // ══════ DISTRIBUTION ══════
  { id: "ds1", cat: "distribution", name: "Drop-Kick Target Zones", dur: 12, int: "Medium", desc: "Zones at 30m, 40m, 50m. Drop-kick to each alternating. 5m-wide target. Both sides.", reps: "4 x 10 kicks", eq: ["Cones", "Balls"], cp: "Consistent drop. Don't over-swing. Lock ankle, slight lean back.", prog: "Smaller targets; moving targets; defenders intercepting", mistakes: "Over-swinging; inconsistent drop; power over accuracy" },
  { id: "ds2", cat: "distribution", name: "Javelin/Overarm Throw", dur: 10, int: "Medium", desc: "GK on 6-yard edge. Target at 25m. Side-on, arm back, drive off back foot. Direct throw.", reps: "3 x 8 each arm", eq: ["Balls", "Cones"], cp: "Elbow high, fingers behind. Rotate hips. Lead the runner. Accuracy over distance.", prog: "Increase distance; moving targets; pressing defenders", mistakes: "Arm only; poor footwork; telegraphing" },
  { id: "ds3", cat: "distribution", name: "Goal Kick Accuracy Challenge", dur: 15, int: "Medium", desc: "Short (15-20m), medium (35-40m), long (50-55m) target zones. 6 attempts per zone. Track accuracy.", reps: "18 kicks (6 per zone)", eq: ["Cones", "Balls"], cp: "Plant foot placement. Full follow-through. Both feet equally. Zone-specific technique.", prog: "Add defenders; increase distance; first-touch requirement; time pressure", mistakes: "Inconsistent plant; lunging; poor timing; excessive power" },
  { id: "ds4", cat: "distribution", name: "Playing Through the Press", dur: 15, int: "High", desc: "Three pressers at 15m, 25m, 35m. 3 seconds to play short to outlet. Max 3 touches.", reps: "4 x 8 scenarios", eq: ["Cones", "Balls"], cp: "First touch sets direction. Second touch is the pass. Communicate before ball arrives.", prog: "Less time; more pressers; feet-only; greater distance between options", mistakes: "Panicking; back to goal; not identifying free player" },
  { id: "ds5", cat: "distribution", name: "Underhand Roll Precision", dur: 8, int: "Low", desc: "Receiving players at 5, 8, 12, 15 yards. Underhand rolls to each. Receiver controls first touch.", reps: "24 rolls (6 x 4 distances)", eq: ["Cones", "Balls"], cp: "Low release. Nearly flat. Pace variation. Roll to feet, not space.", prog: "Add pressing; wider targets; moving targets; field play decision", mistakes: "Too much pace; inconsistent release; behind receiver" },
  { id: "ds6", cat: "distribution", name: "Save + Counter-Launch", dur: 15, int: "High", desc: "Striker shoots \u2014 GK saves. Two forwards break wide. Launch counter within 3 seconds.", reps: "4 x 8 save-launches", eq: ["Balls", "Cones", "GK Gloves"], cp: "Save is half \u2014 launch wins the game. Eyes up before ball in hands. Throw beats kick for speed.", prog: "Decrease time; add pressing; vary runners; increase save difficulty", mistakes: "Slow transition; eyes down; wrong target" },
  { id: "ds7", cat: "distribution", name: "4v2 Rondo with GK Reset", dur: 15, int: "High", desc: "20x20 grid. 4v2. GK outside as outlet. Receive and reset. Quick feet, 2 touches max.", reps: "3-4 rounds x 2-3 min", eq: ["Cones", "Balls"], cp: "Just outside grid. When to reset vs recycle. Max 2 touches.", prog: "Reduce grid; third defender; feet only; increase tempo", mistakes: "Caught on ball; overcomplicating; poor positioning" },
  { id: "ds8", cat: "distribution", name: "Both-Feet Kicking Mastery", dur: 12, int: "Medium", desc: "Alternate right/left to targets at 30, 40, 50 yards. 4 kicks per foot per distance. Track accuracy.", reps: "24 kicks (alternate feet)", eq: ["Cones", "Balls"], cp: "Non-kicking foot placement. Contact point. Follow-through. Left = right commitment.", prog: "Add pressure; moving targets; random distances; timed", mistakes: "Weaker non-dominant; poor plant; weak follow-through" },
  { id: "ds9", cat: "distribution", name: "Back-Pass Chain Build-Out", dur: 12, int: "Medium", desc: "GK receives back-pass, connects 4-pass chain before halfway. If press wins within 4, they score.", reps: "4 x 8 build-outs", eq: ["Cones", "Balls"], cp: "Play simple. Start chain cleanly. Communicate before receiving.", prog: "More pressers; less time; specific patterns; greater distances", mistakes: "Holding too long; forcing passes; poor first touch" },
  { id: "ds10", cat: "distribution", name: "Half-Volley Width Switch", dur: 10, int: "Medium", desc: "Switch play with half-volley to opposite wide zone (40m+). Both feet.", reps: "3 x 10 each foot", eq: ["Balls", "Cones"], cp: "Strike low-to-mid. Slight lean back for lift. Drop ball in front.", prog: "Add pressing; smaller target; moving targets; timed", mistakes: "Slicing; inconsistent drop; over-swinging" },

  // ══════ CROSSES & HIGH BALLS ══════
  { id: "cr1", cat: "crosses", name: "Three-Step Footwork to Cross", dur: 12, int: "Medium", desc: "GK on 6-yard line. Crosser from wide. 3-step approach: side step, cross-step, jump and claim.", reps: "5 x 8 crosses", eq: ["Balls", "Cones", "GK Gloves"], cp: "Attack the ball. Take off from inside foot. Call 'KEEPER' early and loud. Highest point.", prog: "Add defenders; increase speed; vary positions; striker challenges", mistakes: "Waiting; poor footwork; catching behind head" },
  { id: "cr2", cat: "crosses", name: "Catch vs Punch Decision", dur: 15, int: "High", desc: "Crosses from varying positions. Call 'keeper' to catch or 'away' to punch based on pressure.", reps: "4 x 10 crosses", eq: ["Balls", "Cones", "Mannequins", "GK Gloves"], cp: "Call early. If in doubt \u2014 punch with power and direction. Decide at jump, not mid-air.", prog: "Active attackers; increase pace; mix height/speed; deflection threat", mistakes: "Indecision; too far out; weak punch; not communicating" },
  { id: "cr3", cat: "crosses", name: "Corner Kick Organization", dur: 15, int: "Medium", desc: "Full corner scenario. GK organizes 4 players. Inswing, outswing, short. Direct play.", reps: "3 x 8 scenarios", eq: ["Balls", "Cones", "GK Gloves"], cp: "Set positions BEFORE kick. Stay off line until ball moves. Use names.", prog: "Game-speed; attacking pressure; mix types; score organization", mistakes: "Organizing late; on goal line; not scanning" },
  { id: "cr4", cat: "crosses", name: "Crosses Under Fatigue", dur: 12, int: "High", desc: "5 lateral shuffles (10m each), then claim cross immediately. Simulate tiredness.", reps: "4 x 8 crosses after shuffle", eq: ["Balls", "Cones", "GK Gloves"], cp: "Breathe. Reset. Don't rush footwork when tired. Trust technique.", prog: "More shuffles; less recovery; contested; faster crosses", mistakes: "Rushing when tired; poor technique; not calling" },
  { id: "cr5", cat: "crosses", name: "Switching Crossing Zones", dur: 12, int: "High", desc: "Cross from right 10m, then left 20m, then right 30m. Micro-adjust for each. Full-width range.", reps: "4 x 8 sequences", eq: ["Balls", "Cones", "GK Gloves"], cp: "Read crosser's body before ball struck. Start moving early. Micro-adjust.", prog: "Faster transitions; add attackers; vary height; punching requirement", mistakes: "Slow adjustment; flat-footed; not reading body shape" },
  { id: "cr6", cat: "crosses", name: "1v1 vs Striker on Cross", dur: 12, int: "High", desc: "Cross from wide. Striker enters box. GK claims or punches with contact inevitable. Safe technique.", reps: "3 x 8 each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Highest point. Knee up for protection. Never hesitate \u2014 commitment is everything.", prog: "Second attacker; faster crosses; vary delivery; scoring element", mistakes: "Hesitation; claiming too low; not protecting; pulling out" },
  { id: "cr7", cat: "crosses", name: "High-Pressure Corner Sequence", dur: 10, int: "Max", desc: "8 corners in 4 minutes \u2014 alternating sides, mixing types. Claim or punch every one. No break.", reps: "3 x 8-corner sequences", eq: ["Balls", "GK Gloves"], cp: "Trust footwork. Call every ball. No unclaimed ball in 6-yard box.", prog: "Active attackers; score system; increase speed; mix with free kicks", mistakes: "Mental fatigue; inconsistent technique; not resetting" },

  // ══════ 1v1 SITUATIONS ══════
  { id: "ov1", cat: "1v1", name: "1v1 Closing Down (Feet Set)", dur: 15, int: "High", desc: "Coach walks ball from 18-yard line. GK advances, narrows angle, stays set. No diving \u2014 force play wide.", reps: "3 x 6 each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Big body, stay on feet. Wait \u2014 don't commit early. Read touch, not body feints.", prog: "Increase speed; add finishing; multiple angles; second striker", mistakes: "Committing early; going to ground; beaten on dribble; turning sideways" },
  { id: "ov2", cat: "1v1", name: "Smother Dive at Feet", dur: 12, int: "High", desc: "Striker runs from 20m. GK advances, waits for commitment. Smother/block at feet. Safe technique.", reps: "4 x 6 each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Don't go early. Get low, stay strong. Hands and body together. Lead with fists, not head.", prog: "Increase speed; angled runs; second striker; live finishing", mistakes: "Too early; head first; diving across; getting lobbed" },
  { id: "ov3", cat: "1v1", name: "Stay-on-Feet 1v1 Game", dur: 12, int: "High", desc: "1v1 from 18m, shooter starting wide. Stay on feet as long as possible. Builds patience.", reps: "4 x 8 each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Don't sell yourself. Stay big. Dive only as ball struck. Force attacker to decide.", prog: "Time pressure; multiple positions; second defender; better attackers", mistakes: "Committing early; ground before shot; making yourself small" },
  { id: "ov4", cat: "1v1", name: "1v1 After Sweeping Recovery", dur: 12, int: "High", desc: "Sweep through-ball, recover to line, face immediate 1v1 from second striker.", reps: "3 x 6 sequences", eq: ["Balls", "Cones", "GK Gloves"], cp: "Reset breathing. Don't rush \u2014 reset stance. Composure after effort.", prog: "Less recovery time; better strikers; third action; vary distances", mistakes: "Rushing recovery; poor stance; carrying fatigue; panic" },
  { id: "ov5", cat: "1v1", name: "1v1 From Different Angles", dur: 15, int: "High", desc: "6 runs: straight on, left 45\u00B0, right 45\u00B0, wide left, wide right, after pass from deep.", reps: "6 runs each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Different angle = different position. Adjust before shot. Narrow from correct start.", prog: "Increase speed; shot variety; random order; live game", mistakes: "Same position for all angles; slow adjustment; not reading angle" },
  { id: "ov6", cat: "1v1", name: "Controlled Advance Decision", dur: 12, int: "Medium", desc: "Striker receives at 25m and runs at goal. Coach calls 'set' at optimal moment \u2014 helps GK learn timing.", reps: "4 x 8 each GK", eq: ["Balls", "Cones", "GK Gloves"], cp: "Advance quickly, set early. BIG obstacle. Read attacker's touch.", prog: "Remove coach call; increase speed; add deception; lob threat", mistakes: "Setting too late; too early; wrong closing speed" },

  // ══════ SET PIECES & PENALTIES ══════
  { id: "sp1", cat: "set-pieces", name: "Penalty Routine Practice", dur: 15, int: "High", desc: "5 penalties from different takers. Pre-kick routine: stance, focus, breath. React, don't anticipate. Record data.", reps: "5 per GK", eq: ["Balls", "GK Gloves"], cp: "Stay on line. Explode to corner. Track hips. Routine removes fear.", prog: "Crowd noise; delayed run-ups; shootout sim; full competition", mistakes: "Moving early; inconsistent routine; guessing" },
  { id: "sp2", cat: "set-pieces", name: "Free Kick Wall + Position", dur: 12, int: "Medium", desc: "Free kicks from 20m, 22m, 25m. Set wall covering near post. Position for far post. Save.", reps: "4 x 8 free kicks", eq: ["Balls", "Cones", "Mannequins", "GK Gloves"], cp: "Check wall before looking at shooter. Cover wall-post gap. Position for over-wall shot.", prog: "Players in wall; vary distances; dummy runs; rebound saves", mistakes: "Not checking wall; too central; guessing" },
  { id: "sp3", cat: "set-pieces", name: "Post-Corner Transition Save", dur: 12, int: "High", desc: "Corner \u2014 claim or punch. Immediately, recycled ball shot from edge of box (2s delay). Reset after aerial.", reps: "3 x 8 sequences", eq: ["Balls", "Cones", "GK Gloves"], cp: "Land with eyes on play. Scan immediately. Quick feet to reset.", prog: "Less delay; multiple recycled shots; increase quality; add defenders", mistakes: "Landing off-balance; not scanning; slow transition" },
  { id: "sp4", cat: "set-pieces", name: "Full Penalty Shootout Sim", dur: 15, int: "Max", desc: "5 penalties vs live shooters. Scoreboard. First to save 2 wins. Real competition.", reps: "5 per GK in shootout", eq: ["Balls", "GK Gloves"], cp: "Embrace pressure. Execute routine identically every time.", prog: "Crowd noise; vary styles; change order; consequences", mistakes: "Abandoning routine; fear-based guessing; losing concentration" },
  { id: "sp5", cat: "set-pieces", name: "Set-Piece Mental Walk-Through", dur: 10, int: "Low", desc: "Coach calls scenarios aloud. GK walks through positioning physically and verbally. No ball.", reps: "3 x 6 scenarios", eq: [], cp: "Visualize clearly. Walk slowly and accurately. Build neural pathway.", prog: "Increase complexity; verbal response; physical speed", mistakes: "Rushing; not committing mentally; treating as unimportant" },

  // ══════ COMMUNICATION & LEADERSHIP ══════
  { id: "cm1", cat: "communication", name: "Verbal Box Communication", dur: 12, int: "Medium", desc: "Crossing situation. Direct defenders before delivery \u2014 call positions, warn of runners. Assessed: early, specific, loud.", reps: "3 x 10 crosses", eq: ["Balls", "Cones"], cp: "Before cross, not during. Use names. Early, specific, loud.", prog: "More defenders; increase tempo; score quality; add attackers", mistakes: "Late calls; generic; no names; insufficient volume" },
  { id: "cm2", cat: "communication", name: "Back Line Direction (No Ball)", dur: 10, int: "Low", desc: "GK + 4 defenders walk through 6 scenarios without ball. GK calls every one.", reps: "3 x 6 scenarios", eq: ["Cones"], cp: "Constant voice. Specific: 'step up,' 'drop,' 'shift left.'", prog: "Increase speed; add ball; add attackers; score quality", mistakes: "Waiting for problem; quiet; generic" },
  { id: "cm3", cat: "communication", name: "Communication Under Fatigue", dur: 10, int: "High", desc: "2-min shuttle run, then organize back 4 for 2 min of game play. Voice assessed under fatigue.", reps: "4 x 2-min sets", eq: ["Cones", "Balls"], cp: "Leaders communicate when it's hard. Maintain volume and clarity.", prog: "Increase fatigue; add scenarios; score metrics", mistakes: "Going quiet; losing clarity; stopping communication" },
  { id: "cm4", cat: "communication", name: "GK-Led Back Line Drill", dur: 15, int: "Medium", desc: "GK leads 4 defenders: step up, drop, shift, set. No coach \u2014 GK gives all commands.", reps: "10 min per GK", eq: ["Cones"], cp: "You own the backline. First and last voice they hear. Confident and decisive.", prog: "Add attackers; game speed; add ball; score leadership", mistakes: "Hesitant; reactive not proactive; losing authority" },
  { id: "cm5", cat: "communication", name: "Switchplay Recovery Calls", dur: 10, int: "Medium", desc: "Ball switched quickly. GK calls switch early, readjusts position.", reps: "4 x 8 scenarios", eq: ["Balls", "Cones"], cp: "See it before it happens. Call before ball arrives.", prog: "Faster; more options; shots after switch; score timing", mistakes: "Late; not repositioning; quiet" },

  // ══════ PHYSICAL CONDITIONING ══════
  { id: "ph1", cat: "physical", name: "GK Plyometric Circuit", dur: 15, int: "High", desc: "Circuit: box jumps x8, lateral bounds x8 each, squat jump+clap x8, explosive push-up x8. 90s rest.", reps: "4 circuits", eq: ["Hurdles", "Cones"], cp: "Maximum effort each rep. Fast-twitch explosiveness. Quality over quantity.", prog: "More exercises; less rest; more reps; saves after each", mistakes: "Poor form; insufficient effort; rushing" },
  { id: "ph2", cat: "physical", name: "Box Jump + Dive Save", dur: 12, int: "High", desc: "Jump onto 40cm box and off. On landing, coach fires low. Dive from landing position.", reps: "4 x 6 each side", eq: ["Hurdles", "Balls", "GK Gloves"], cp: "Land softly, absorb, explode to ball. No freeze. Generate power from landing.", prog: "Higher box; more jumps; harder shots; vary directions", mistakes: "Freezing on landing; poor mechanics; slow transition" },
  { id: "ph3", cat: "physical", name: "Sprint Recovery Sequences", dur: 12, int: "High", desc: "Sprint 20m, walk back, face immediate shot. 8 reps. Simulate sweep then follow-up.", reps: "4 x 8 sprint-saves", eq: ["Balls", "Cones", "GK Gloves"], cp: "Control breathing in last 3 steps. Arrive set. Quality despite fatigue.", prog: "More distance; less recovery; second shot; harder shots", mistakes: "Arriving off-balance; poor breathing; technique breakdown" },
  { id: "ph4", cat: "physical", name: "Lateral Sprint + Collapse Dive", dur: 12, int: "High", desc: "Sprint to 10m marker, touch, sprint back, collapse to save far side. Alternate.", reps: "4 x 8 each direction", eq: ["Balls", "Cones", "GK Gloves"], cp: "Full sprint. Save quality matters in conditioning. Match simulation.", prog: "More distance; second save; faster shots; obstacles", mistakes: "Jogging; poor save quality; not setting" },
  { id: "ph5", cat: "physical", name: "Plyometric Jump + Cross Claim", dur: 10, int: "High", desc: "Two vertical jumps, then cross delivered immediately. Claim at elevated heart rate.", reps: "3 x 8 sequences", eq: ["Balls", "GK Gloves"], cp: "Control breath before jump. Trust technique despite heart rate.", prog: "More jumps; less recovery; attacker pressure; vary cross", mistakes: "Poor timing; rushing; not breathing" },

  // ══════ MENTAL & DECISION MAKING ══════
  { id: "mn1", cat: "mental", name: "Goal Visualization Exercise", dur: 15, int: "Low", desc: "15-min guided visualization: best save, best distribution, commanding a corner. Coach narrates. Full sensory.", reps: "15 minutes", eq: [], cp: "Brain can't distinguish vivid imagination from real. Full sensory engagement.", prog: "More specificity; match scenarios; individual sessions; pre-match routine", mistakes: "Not committing; rushing; losing focus" },
  { id: "mn2", cat: "mental", name: "Noise + Distraction Saves", dur: 12, int: "High", desc: "While preparing for shot, coach/players make noise, wave arms, call name. Stay focused and save. Simulate hostile crowd.", reps: "4 x 10 shots under distraction", eq: ["Balls", "GK Gloves"], cp: "Find focal point. External chaos = nothing. Block out everything except ball.", prog: "More distraction; more people; vary types; score focus", mistakes: "Losing focus; getting angry; technique affected" },
  { id: "mn3", cat: "mental", name: "Game State: Winning by 1", dur: 12, int: "Medium", desc: "Ahead by 1, late in game. Manage time: when to hold ball, delay restarts within rules.", reps: "2 x 10-min game", eq: ["Balls", "Cones"], cp: "Smart, not cynical. Composed, not time-wasting. Project calm leadership.", prog: "More pressure; vary states; referee simulation", mistakes: "Too obvious; rushing; losing composure" },
  { id: "mn4", cat: "mental", name: "Game State: Losing by 1", dur: 12, int: "Medium", desc: "Losing in final 10 min. Risk more crosses, launch faster, communicate urgency.", reps: "2 x 10-min game", eq: ["Balls", "Cones"], cp: "Calculated risks. Right risk at right moment. Urgency without panic.", prog: "Vary states; multiple scenarios; combine with shootout", mistakes: "Reckless; panic; losing composure; abandoning position" },
  { id: "mn5", cat: "mental", name: "Ice-Water Mentality Sim", dur: 8, int: "High", desc: "Before routine save, coach says 'playoff shootout \u2014 game ends if you concede.' Execute normally. Disconnect pressure from performance.", reps: "3 high-pressure penalties weekly", eq: ["Balls", "GK Gloves"], cp: "Pressure is a privilege. Perform routine identically.", prog: "Increase pressure; add team watching; consequences; combine with visualization", mistakes: "Changing technique; overthinking; abandoning routine" },
  { id: "mn6", cat: "mental", name: "Season Stats Personal Review", dur: 15, int: "Low", desc: "Review personal data: saves, distribution accuracy, crossing success, penalty chart. Coach summary.", reps: "15 min each GK", eq: [], cp: "Numbers tell one story \u2014 what's behind them? Build self-awareness.", prog: "Weekly tracking; compare trends; set targets; peer comparison", mistakes: "Ignoring data; defensive about weakness; no actionable goals" },

  // ══════ WARM-UP & RECOVERY ══════
  { id: "rc1", cat: "recovery", name: "Dynamic Mobility + Activation", dur: 10, int: "Low", desc: "Hip circles, thoracic rotation, hamstring sweeps, ankle rolls. GKs lead themselves. Blood flow, not fitness.", reps: "10 minutes", eq: [], cp: "40% effort. Breathe deeply. Build the routine.", prog: "Add GK-specific movements; quality focus; partner work", mistakes: "Too hard; passive only; rushing; skipping areas" },
  { id: "rc2", cat: "recovery", name: "Light Technical Touches", dur: 15, int: "Low", desc: "Pairs 8m apart. Rolling, catching, throwing. Clean hands, good shape, zero pressure.", reps: "15 minutes", eq: ["Balls", "GK Gloves"], cp: "Perfect technique at low speed. Reinforce good habits. Recovery, not training.", prog: "Height variations; gentle movement; slight tempo increase; footwork patterns", mistakes: "Too hard; competing; sloppy technique; rushing" },
  { id: "rc3", cat: "recovery", name: "Match Debrief Discussion", dur: 15, int: "Low", desc: "Coach leads: what worked? What didn't? One proud moment. One to change. Honest self-assessment.", reps: "15 minutes", eq: [], cp: "No blame. Only learning. Build culture of honesty.", prog: "Add video; peer feedback; goal setting; written reflections", mistakes: "Blame culture; only negatives; not specific" },
  { id: "rc4", cat: "recovery", name: "Ball Mastery Free Play", dur: 15, int: "Low", desc: "Juggle, roll, toss freely. No instruction. Reinforce love of the ball.", reps: "15 minutes", eq: ["Balls"], cp: "Enjoy it. No pressure. No metrics.", prog: "Add tricks; friendly partner challenges; different balls", mistakes: "Too serious; not participating; losing engagement" },
  { id: "rc5", cat: "recovery", name: "Pre-Match Warm-Up Routine", dur: 25, int: "Medium", desc: "Full match-day warm-up: jog, mobility, ladder, catching, low shots, high shots, crosses. Same every time.", reps: "25 minutes", eq: ["Balls", "Agility Ladder", "Cones", "GK Gloves"], cp: "Ritual builds readiness. Same every week. Automatic.", prog: "Fine-tune; match-specific elements; individualize", mistakes: "Changing routine; skipping sections; insufficient intensity" },
  { id: "rc6", cat: "recovery", name: "Post-Session Cool Down", dur: 10, int: "Low", desc: "Light jog + static stretch. GKs lead themselves. Build body autonomy.", reps: "10 minutes", eq: [], cp: "Professional players cool down. Period.", prog: "Add foam rolling; breathing; meditation", mistakes: "Skipping; rushing; not self-leading" },
];

// ─── Styles ──────────────────────────────────────────────────────
const colors = {
  bg: "#f8f7f4", card: "#ffffff", border: "#e2e0db", text: "#1a1a1a",
  textMuted: "#6b6966", accent: "#2563eb", accentLight: "#dbeafe",
  danger: "#dc2626", dangerLight: "#fee2e2", success: "#16a34a",
  successLight: "#dcfce7", warmLight: "#fef3c7",
  iLow: "#86efac", iMed: "#fde047", iHigh: "#fb923c", iMax: "#ef4444",
};
const iColor = (i) => ({ Low: colors.iLow, Medium: colors.iMed, High: colors.iHigh, Max: colors.iMax }[i] || "#ccc");

// ─── UI Components ───────────────────────────────────────────────
function Badge({ children, color = colors.accentLight, textColor = colors.accent, style }) {
  return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600, background: color, color: textColor, letterSpacing: 0.3, whiteSpace: "nowrap", ...style }}>{children}</span>;
}
function Button({ children, onClick, variant = "primary", size = "md", style, disabled }) {
  const base = { border: "none", cursor: disabled ? "not-allowed" : "pointer", borderRadius: 6, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s", opacity: disabled ? 0.5 : 1 };
  const sz = { sm: { padding: "5px 10px", fontSize: 12 }, md: { padding: "8px 16px", fontSize: 13 }, lg: { padding: "10px 20px", fontSize: 14 } };
  const vr = {
    primary: { background: colors.accent, color: "#fff" },
    secondary: { background: colors.bg, color: colors.text, border: "1px solid " + colors.border },
    danger: { background: colors.dangerLight, color: colors.danger },
    ghost: { background: "transparent", color: colors.textMuted },
    success: { background: colors.successLight, color: colors.success },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...sz[size], ...vr[variant], ...style }}>{children}</button>;
}
function Input({ label, value, onChange, type = "text", placeholder, style, multiline, rows = 3 }) {
  const is = { width: "100%", padding: "8px 10px", border: "1px solid " + colors.border, borderRadius: 6, fontSize: 13, fontFamily: "inherit", background: "#fff", color: colors.text, resize: "vertical", boxSizing: "border-box", ...style };
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
      {multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={is} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={is} />}
    </div>
  );
}

// ─── Drill Card (Library View) ───────────────────────────────────
function DrillCard({ drill, onAdd, expanded, onToggle }) {
  const cat = CATEGORIES.find(c => c.key === drill.cat);
  return (
    <div style={{ border: "1px solid " + colors.border, borderRadius: 8, background: colors.card, overflow: "hidden", borderLeft: "4px solid " + (cat?.color || colors.accent) }}>
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={onToggle}>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{drill.name}</span>
        <Badge color={iColor(drill.int) + "33"} textColor={iColor(drill.int)} style={{ filter: "saturate(1.5)" }}>{drill.int}</Badge>
        <Badge color={colors.bg} textColor={colors.textMuted}><Clock size={10} style={{ marginRight: 2 }} />{drill.dur}m</Badge>
        {onAdd && <button onClick={e => { e.stopPropagation(); onAdd(drill); }} style={{ background: colors.accent, color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+ Add</button>}
      </div>
      {expanded && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid " + colors.border, fontSize: 13, lineHeight: 1.6 }}>
          <p style={{ margin: "10px 0 8px", color: colors.text }}>{drill.desc}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginBottom: 10 }}>
            {drill.reps && <div><strong>Reps:</strong> {drill.reps}</div>}
            {drill.eq?.length > 0 && <div><strong>Equipment:</strong> {drill.eq.join(", ")}</div>}
          </div>
          {drill.cp && <div style={{ padding: 10, background: colors.successLight, borderRadius: 6, marginBottom: 6 }}><strong style={{ color: colors.success }}>Coaching Points:</strong> {drill.cp}</div>}
          {drill.prog && <div style={{ padding: 10, background: colors.accentLight, borderRadius: 6, marginBottom: 6 }}><strong style={{ color: colors.accent }}>Progressions:</strong> {drill.prog}</div>}
          {drill.mistakes && <div style={{ padding: 10, background: colors.dangerLight, borderRadius: 6 }}><strong style={{ color: colors.danger }}>Common Mistakes:</strong> {drill.mistakes}</div>}
        </div>
      )}
    </div>
  );
}

// ─── Session Builder ─────────────────────────────────────────────
function SessionBuilder({ session, onUpdate, onBack, onAddDrill }) {
  const totalTime = session.drills.reduce((s, d) => s + (d.dur || 0), 0);
  const removeDrill = (i) => onUpdate({ ...session, drills: session.drills.filter((_, idx) => idx !== i) });
  const moveDrill = (i, dir) => {
    const arr = [...session.drills];
    const ni = i + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[i], arr[ni]] = [arr[ni], arr[i]];
    onUpdate({ ...session, drills: arr });
  };

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: colors.textMuted, marginBottom: 14, fontSize: 13, fontWeight: 600 }}><ArrowLeft size={16} /> Back to Sessions</button>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
        <Input label="Session Name" value={session.name} onChange={v => onUpdate({ ...session, name: v })} placeholder="e.g. Tuesday Shot-Stopping" />
        <Input label="Notes" value={session.notes || ""} onChange={v => onUpdate({ ...session, notes: v })} placeholder="Session notes..." />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Badge color={colors.accentLight} textColor={colors.accent} style={{ fontSize: 13, padding: "6px 14px" }}><Clock size={14} style={{ marginRight: 4 }} /> {totalTime} min total</Badge>
        <Badge color={colors.warmLight} textColor="#92400e" style={{ fontSize: 13, padding: "6px 14px" }}>{session.drills.length} drills</Badge>
        <Button onClick={onAddDrill} variant="primary" size="sm"><Plus size={14} /> Add Drills from Library</Button>
      </div>
      {session.drills.length === 0 && <div style={{ textAlign: "center", padding: 40, color: colors.textMuted, border: "2px dashed " + colors.border, borderRadius: 8 }}><BookOpen size={30} style={{ opacity: 0.3, marginBottom: 8 }} /><p>No drills yet. Click "Add Drills from Library" to start building.</p></div>}
      {session.drills.map((d, i) => {
        const cat = CATEGORIES.find(c => c.key === d.cat);
        return (
          <div key={d._uid || i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid " + colors.border, borderRadius: 8, marginBottom: 6, background: colors.card, borderLeft: "4px solid " + (cat?.color || "#ccc") }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <button onClick={() => moveDrill(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.2 : 0.6, padding: 0, fontSize: 10 }}>{"\u25B2"}</button>
              <button onClick={() => moveDrill(i, 1)} disabled={i === session.drills.length - 1} style={{ background: "none", border: "none", cursor: i === session.drills.length - 1 ? "default" : "pointer", opacity: i === session.drills.length - 1 ? 0.2 : 0.6, padding: 0, fontSize: 10 }}>{"\u25BC"}</button>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, minWidth: 24 }}>#{i + 1}</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{d.name}</span>
            <Badge color={iColor(d.int) + "33"} textColor={iColor(d.int)}>{d.int}</Badge>
            <Badge color={cat?.bg} textColor={cat?.color}>{cat?.label}</Badge>
            <span style={{ fontSize: 12, color: colors.textMuted }}>{d.dur}m</span>
            <button onClick={() => removeDrill(i)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.danger, padding: 4 }}><Trash2 size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Session Card ────────────────────────────────────────────────
function SessionCard({ session, onOpen, onDuplicate, onDelete }) {
  const totalTime = session.drills.reduce((s, d) => s + (d.dur || 0), 0);
  const cats = [...new Set(session.drills.map(d => d.cat))];
  return (
    <div style={{ border: "1px solid " + colors.border, borderRadius: 8, padding: 14, background: colors.card, cursor: "pointer", transition: "box-shadow 0.15s" }} onClick={onOpen}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{session.name}</h3>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onDuplicate(); }} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textMuted, padding: 4 }}><Copy size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: "none", border: "none", cursor: "pointer", color: colors.danger, padding: 4 }}><Trash2 size={14} /></button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        <Badge color={colors.bg} textColor={colors.textMuted}><Clock size={10} style={{ marginRight: 2 }} />{totalTime}m</Badge>
        <Badge color={colors.bg} textColor={colors.textMuted}>{session.drills.length} drills</Badge>
        {cats.slice(0, 3).map(c => { const cat = CATEGORIES.find(ct => ct.key === c); return cat ? <Badge key={c} color={cat.bg} textColor={cat.color}>{cat.icon}</Badge> : null; })}
      </div>
      <div style={{ fontSize: 11, color: colors.textMuted }}>
        {session.drills.slice(0, 4).map(d => d.name).join(" \u2192 ")}{session.drills.length > 4 ? " \u2192 ..." : ""}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────
export default function GKCoachPlanner() {
  const [tab, setTab] = useState("library");
  const [sessions, setSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [addingDrills, setAddingDrills] = useState(false);
  const [libSearch, setLibSearch] = useState("");
  const [libCat, setLibCat] = useState(null);
  const [libInt, setLibInt] = useState("All");
  const [expandedDrill, setExpandedDrill] = useState(null);
  const [sessionSearch, setSessionSearch] = useState("");

  const filteredDrills = useMemo(() => {
    return DRILL_LIBRARY.filter(d => {
      const ms = !libSearch || d.name.toLowerCase().includes(libSearch.toLowerCase()) || d.desc.toLowerCase().includes(libSearch.toLowerCase()) || d.cp?.toLowerCase().includes(libSearch.toLowerCase());
      const mc = !libCat || d.cat === libCat;
      const mi = libInt === "All" || d.int === libInt;
      return ms && mc && mi;
    });
  }, [libSearch, libCat, libInt]);

  const catCounts = useMemo(() => {
    const counts = {};
    DRILL_LIBRARY.forEach(d => { counts[d.cat] = (counts[d.cat] || 0) + 1; });
    return counts;
  }, []);

  const addDrillToSession = (drill) => {
    if (!editingSession) return;
    const updated = sessions.map(s => s.id === editingSession ? { ...s, drills: [...s.drills, { ...drill, _uid: uid() }] } : s);
    setSessions(updated);
  };

  const createSession = () => {
    const s = { id: uid(), name: "New Session", drills: [], notes: "" };
    setSessions([...sessions, s]);
    setEditingSession(s.id);
    setTab("sessions");
  };

  const duplicateSession = (s) => {
    const ns = { ...JSON.parse(JSON.stringify(s)), id: uid(), name: s.name + " (Copy)" };
    setSessions([...sessions, ns]);
  };

  const updateSession = (u) => setSessions(sessions.map(s => s.id === u.id ? u : s));
  const deleteSession = (id) => { setSessions(sessions.filter(s => s.id !== id)); if (editingSession === id) setEditingSession(null); };

  const editing = sessions.find(s => s.id === editingSession);
  const totalDrills = DRILL_LIBRARY.length;

  // Drill picker overlay
  const DrillPicker = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, width: "90%", maxWidth: 800, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid " + colors.border, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Add Drills to Session</h3>
          <button onClick={() => setAddingDrills(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ padding: "10px 20px", borderBottom: "1px solid " + colors.border, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={libSearch} onChange={e => setLibSearch(e.target.value)} placeholder="Search drills..." style={{ flex: 1, minWidth: 150, padding: "6px 10px", border: "1px solid " + colors.border, borderRadius: 6, fontSize: 13 }} />
          <select value={libCat || ""} onChange={e => setLibCat(e.target.value || null)} style={{ padding: "6px 10px", border: "1px solid " + colors.border, borderRadius: 6, fontSize: 13 }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label} ({catCounts[c.key] || 0})</option>)}
          </select>
          <select value={libInt} onChange={e => setLibInt(e.target.value)} style={{ padding: "6px 10px", border: "1px solid " + colors.border, borderRadius: 6, fontSize: 13 }}>
            <option value="All">All Intensities</option>
            {INTENSITY.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredDrills.map(d => <DrillCard key={d.id} drill={d} onAdd={addDrillToSession} expanded={expandedDrill === d.id} onToggle={() => setExpandedDrill(expandedDrill === d.id ? null : d.id)} />)}
          </div>
          {filteredDrills.length === 0 && <div style={{ textAlign: "center", padding: 40, color: colors.textMuted }}>No drills match your search.</div>}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: colors.text }}>
      {addingDrills && <DrillPicker />}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid " + colors.border, padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: colors.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={20} color="#fff" /></div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>GK Coach Planner</h1>
              <p style={{ margin: 0, fontSize: 11, color: colors.textMuted }}>{totalDrills} drills across {CATEGORIES.length} categories \u2014 build your own sessions</p>
            </div>
          </div>
          <Button onClick={createSession} size="sm"><Plus size={14} /> New Session</Button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid " + colors.border, marginBottom: 20, gap: 0 }}>
          {[{ key: "library", label: "Drill Library", icon: <BookOpen size={16} /> }, { key: "sessions", label: "My Sessions (" + sessions.length + ")", icon: <Target size={16} /> }].map(t =>
            <button key={t.key} onClick={() => { setTab(t.key); if (t.key === "library") setEditingSession(null); }} style={{ padding: "10px 18px", background: "none", border: "none", borderBottom: tab === t.key ? "2px solid " + colors.accent : "2px solid transparent", color: tab === t.key ? colors.accent : colors.textMuted, fontWeight: tab === t.key ? 700 : 500, cursor: "pointer", fontSize: 14, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>{t.icon}{t.label}</button>
          )}
        </div>

        {/* ─── Drill Library Tab ─────────── */}
        {tab === "library" && (
          <div style={{ display: "flex", gap: 20 }}>
            {/* Category sidebar */}
            <div style={{ width: 220, flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.textMuted, marginBottom: 10, letterSpacing: 0.5 }}>Categories</div>
              <button onClick={() => setLibCat(null)} style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: !libCat ? colors.accentLight : "transparent", color: !libCat ? colors.accent : colors.text, cursor: "pointer", fontSize: 13, fontWeight: !libCat ? 700 : 500, borderRadius: 6, marginBottom: 2 }}>All Drills ({totalDrills})</button>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setLibCat(c.key)} style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: libCat === c.key ? c.bg : "transparent", color: libCat === c.key ? c.color : colors.text, cursor: "pointer", fontSize: 13, fontWeight: libCat === c.key ? 700 : 500, borderRadius: 6, marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{c.icon}</span>
                  <span style={{ flex: 1 }}>{c.label}</span>
                  <span style={{ fontSize: 11, color: libCat === c.key ? c.color : colors.textMuted }}>{catCounts[c.key] || 0}</span>
                </button>
              ))}
            </div>

            {/* Drill list */}
            <div style={{ flex: 1 }}>
              {libCat && <div style={{ marginBottom: 14 }}><h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{CATEGORIES.find(c => c.key === libCat)?.icon} {CATEGORIES.find(c => c.key === libCat)?.label}</h2><p style={{ margin: "4px 0 0", fontSize: 13, color: colors.textMuted }}>{CATEGORIES.find(c => c.key === libCat)?.desc}</p></div>}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <input value={libSearch} onChange={e => setLibSearch(e.target.value)} placeholder="Search drills by name, description, coaching points..." style={{ flex: 1, padding: "7px 12px", border: "1px solid " + colors.border, borderRadius: 6, fontSize: 13 }} />
                <select value={libInt} onChange={e => setLibInt(e.target.value)} style={{ padding: "7px 12px", border: "1px solid " + colors.border, borderRadius: 6, fontSize: 13 }}>
                  <option value="All">All Intensities</option>
                  {INTENSITY.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>{filteredDrills.length} drills found</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredDrills.map(d => <DrillCard key={d.id} drill={d} onAdd={editingSession ? addDrillToSession : null} expanded={expandedDrill === d.id} onToggle={() => setExpandedDrill(expandedDrill === d.id ? null : d.id)} />)}
              </div>
              {filteredDrills.length === 0 && <div style={{ textAlign: "center", padding: 50, color: colors.textMuted }}><Search size={30} style={{ opacity: 0.3, marginBottom: 10 }} /><p>No drills match your search.</p></div>}
            </div>
          </div>
        )}

        {/* ─── My Sessions Tab ────────────── */}
        {tab === "sessions" && !editing && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <input value={sessionSearch} onChange={e => setSessionSearch(e.target.value)} placeholder="Search sessions..." style={{ flex: 1, padding: "7px 12px", border: "1px solid " + colors.border, borderRadius: 6, fontSize: 13 }} />
              <Button onClick={createSession}><Plus size={14} /> New Session</Button>
            </div>
            {sessions.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: colors.textMuted }}>
                <Target size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 15, marginBottom: 16 }}>No sessions yet. Build your first one!</p>
                <p style={{ fontSize: 13, maxWidth: 400, margin: "0 auto" }}>Browse the Drill Library, pick drills across categories and intensities, and assemble custom sessions.</p>
                <Button onClick={createSession} style={{ marginTop: 16 }}><Plus size={14} /> Create Session</Button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {sessions.filter(s => !sessionSearch || s.name.toLowerCase().includes(sessionSearch.toLowerCase())).map(s => <SessionCard key={s.id} session={s} onOpen={() => setEditingSession(s.id)} onDuplicate={() => duplicateSession(s)} onDelete={() => deleteSession(s.id)} />)}
            </div>
          </div>
        )}
        {tab === "sessions" && editing && (
          <SessionBuilder session={editing} onUpdate={updateSession} onBack={() => setEditingSession(null)} onAddDrill={() => setAddingDrills(true)} />
        )}
      </div>
    </div>
  );
}
