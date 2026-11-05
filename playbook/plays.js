/* =====================================================================
   PLAYBOOK DATA  —  edit this file to add plays and defenses.

   Court coordinates are in metres on a FIBA court (28 m x 15 m).
     x = distance from the baseline we attack   (0 = baseline, 14 = half-court line)
     y = across the floor                       (0 = offense's LEFT sideline, 15 = RIGHT)
   The rim centre is at [1.575, 7.5].

   A position can be written as [x, y] or as a named spot from `spots`.

   A play is a list of frames (steps). Each frame describes what happens
   to get to that step:
     note     what the kids read on screen for this step
     o        offensive players that move: { 1: 'lwing', 5: [7.8, 8.7] }
              (players not listed stay where they were)
     d        defenders' spots, only used when the play's defense is 'manual'
     ball     who has the ball after this step: 1-5, or 'rim' for a shot
     screens  players whose move ends in a screen: [5]
     dur      seconds to move into this step (default 1.2)
     hold     seconds to pause on this step (default 0.5)
     passAt   0-1, how far through the move the pass/shot leaves (default 0)

   Choices: a play (or an option) can end in a decision point.
     choice   the question shown to the kids, e.g. '3 reads the defense'
     options  up to 4 branches: { label: 'Layup', weight: 1, frames: [...] }
              each option can have its own choice + options (nested reads).
              weight = how often Random picks it (default 1).
   ===================================================================== */
window.PLAYBOOK = {
  spots: {
    top:     [8.6, 7.5],
    lslot:   [8.0, 4.4],  rslot:   [8.0, 10.6],
    lwing:   [5.4, 1.6],  rwing:   [5.4, 13.4],
    lcorner: [0.9, 0.5],  rcorner: [0.9, 14.5],
    lelbow:  [5.8, 5.1],  relbow:  [5.8, 9.9],
    hpost:   [5.6, 7.5],
    lblock:  [2.3, 5.0],  rblock:  [2.3, 10.0],
    ldunker: [1.0, 4.6],  rdunker: [1.0, 10.4],
    rim:     [1.575, 7.5],
    half:    [13.0, 7.5]
  },

  defenses: {
    man: {
      name: 'Man-to-man (help side)',
      type: 'man'
      // X1 guards 1, X2 guards 2, ... Positions are worked out live from
      // where the ball is: on-ball, deny one pass away, help side two away,
      // front the post.
    },
    zone23: {
      name: '2-3 Zone',
      type: 'zone',
      roles: { 1: 'Left guard', 2: 'Right guard', 3: 'Left forward', 4: 'Right forward', 5: 'Center' },
      // Anchors: where each defender stands when the ball is at `ball`.
      // Between anchors the app blends positions, and the nearest defender
      // always steps up to guard the ball. Left-side anchors are mirrored
      // to the right automatically (1<->2, 3<->4).
      mirror: true,
      swap: { 1: 2, 2: 1, 3: 4, 4: 3, 5: 5 },
      anchors: [
        { name: 'Top',        ball: [8.6, 7.5], pos: { 1: [7.2, 6.2], 2: [7.2, 8.8], 3: [2.8, 4.6], 4: [2.8, 10.4], 5: [2.5, 7.5] } },
        { name: 'Left slot',  ball: [8.0, 4.4], pos: { 1: [7.0, 4.9], 2: [6.2, 7.8], 3: [3.0, 4.2], 4: [2.6, 9.6], 5: [2.5, 6.6] } },
        { name: 'Left wing',  ball: [5.4, 1.6], pos: { 1: [5.2, 2.6], 2: [5.6, 6.6], 3: [2.8, 2.6], 4: [2.3, 8.9], 5: [2.3, 5.6] } },
        { name: 'Left corner',ball: [0.9, 0.5], pos: { 1: [4.8, 2.6], 2: [5.3, 6.4], 3: [1.5, 1.4], 4: [2.0, 7.6], 5: [1.8, 4.4] } },
        { name: 'High post',  ball: [5.6, 7.5], pos: { 1: [6.3, 5.9], 2: [6.3, 9.1], 3: [2.6, 5.0], 4: [2.6, 10.0], 5: [4.6, 7.5] } },
        { name: 'Left block', ball: [2.3, 5.0], pos: { 1: [4.4, 4.4], 2: [5.6, 7.2], 3: [2.6, 3.6], 4: [2.2, 8.4], 5: [1.8, 5.7] } }
      ]
    }
  },

  plays: [
    {
      id: 'suns',
      name: 'Suns',
      category: 'Offense',
      defense: 'man',
      description: 'Strong-side handoff to 3, then a screen from 4. 3 drives and reads the defense: finish or kick out.',
      frames: [
        { note: '1 brings the ball up the right side. 2 on the right wing, 3 in the right corner, 4 on the left block, 5 on the left wing.',
          o: { 1: [12.6, 9.4], 2: 'rwing', 3: 'rcorner', 4: 'lblock', 5: 'lwing' }, ball: 1, hold: 1.4 },
        { note: '1 dribbles to the strong side (right).', o: { 1: 'rslot' }, dur: 1.5 },
        { note: '1 dribbles toward 2. 2 cuts toward the basket.', o: { 1: [6.7, 11.3], 2: [2.0, 8.8] }, dur: 1.1 },
        { note: '2 keeps running to the left corner. 3 comes up from the corner toward 1.', o: { 2: 'lcorner', 3: [5.0, 12.7] }, dur: 1.2 },
        { note: 'Handoff: 1 hands the ball to 3.', o: { 3: [5.9, 12.2] }, ball: 3, passAt: 0.6, dur: 0.7, hold: 0.6 },
        { note: '1 runs to the right corner. 4 comes across and sets a screen for 3.', o: { 1: 'rcorner', 4: [5.9, 10.5] }, screens: [4], dur: 1.3, hold: 0.7 },
        { note: '3 drives off the screen hard to the basket.', o: { 3: [2.9, 8.8] }, dur: 1.1, hold: 0.4 }
      ],
      choice: '3 reads the defense: finish or kick out?',
      options: [
        { label: 'Layup', frames: [
          { note: 'Nobody helps. 3 finishes with the layup.', o: { 3: [1.9, 8.2] }, ball: 'rim', passAt: 0.5, dur: 0.8 } ] },
        { label: 'Find 2 · left corner', frames: [
          { note: '3 looks for 2 in the left corner.', hold: 0.3 } ],
          choice: "2 reads the defender: stay for the three or cut back door?",
          options: [
            { label: 'Stay · corner three', frames: [
              { note: "2's defender helps on the drive. 2 stays in the corner and 3 kicks it out.", ball: 2, dur: 1.0, hold: 0.4 },
              { note: '2 shoots the open corner three.', ball: 'rim', dur: 1.0 } ] },
            { label: 'Back door cut', frames: [
              { note: "2's defender turns to watch the ball. 2 cuts back door along the baseline.", o: { 2: [1.3, 5.6] }, dur: 0.9, hold: 0.2 },
              { note: '3 hits 2 on the cut.', ball: 2, dur: 0.6 },
              { note: '2 finishes at the rim.', o: { 2: [1.7, 6.8] }, ball: 'rim', passAt: 0.5, dur: 0.7 } ] }
          ] },
        { label: 'Kick to 1 · right corner', frames: [
          { note: "1's defender helps on the drive. 3 kicks it out to 1 in the right corner.", ball: 1, dur: 0.8, hold: 0.4 },
          { note: '1 shoots the open corner three.', ball: 'rim', dur: 1.0 } ] },
        { label: 'Kick to 5 · left wing', frames: [
          { note: "5's defender helps on the drive. 3 kicks it out to 5 on the left wing.", ball: 5, dur: 1.0, hold: 0.4 },
          { note: '5 shoots the open three.', ball: 'rim', dur: 1.0 } ] }
      ]
    },
    {
      id: 'sample-give-and-go',
      name: 'Give & Go',
      category: 'Offense',
      sample: true,
      defense: 'man',
      description: 'Pass to the wing, fake away, then cut hard to the rim for the return pass.',
      frames: [
        { note: '5-out spacing. 1 has the ball at the top.', o: { 1: 'top', 2: 'lwing', 3: 'rwing', 4: 'lcorner', 5: 'rcorner' }, ball: 1, hold: 1.2 },
        { note: '1 passes to 2 on the left wing.', ball: 2, dur: 0.8 },
        { note: '1 jab-steps away to set up the defender.', o: { 1: [8.2, 9.2] }, dur: 0.7 },
        { note: '1 cuts hard to the rim. 3 fills the top, 5 lifts to the wing.', o: { 1: [2.8, 6.2], 3: [8.4, 8.6], 5: 'rwing' }, dur: 1.1 },
        { note: '2 hits 1 in stride.', ball: 1, dur: 0.6 },
        { note: 'Layup.', o: { 1: [1.9, 6.7] }, ball: 'rim', passAt: 0.5, dur: 0.8 }
      ]
    },
    {
      id: 'sample-pick-and-roll',
      name: 'Pick & Roll',
      category: 'Offense',
      sample: true,
      defense: 'man',
      description: 'Big sets a ball screen at the top, guard drives off it, big rolls to the rim.',
      frames: [
        { note: '4 out, 1 in. 1 has the ball up top, 5 starts on the right block.', o: { 1: 'top', 2: 'lwing', 3: 'rwing', 4: 'lcorner', 5: 'rblock' }, ball: 1, hold: 1.2 },
        { note: "5 sprints up and sets a ball screen on 1's defender.", o: { 5: [7.8, 8.7] }, screens: [5], dur: 1.2, hold: 0.7 },
        { note: '1 dribbles off the screen, shoulder to shoulder with 5.', o: { 1: [6.4, 10.8] }, dur: 1.0, hold: 0.3 },
        { note: '5 rolls hard to the rim, hands up. 3 lifts to make room.', o: { 5: [3.0, 8.6], 3: [7.0, 13.6] }, dur: 1.0 },
        { note: '1 hits 5 on the roll.', ball: 5, dur: 0.6 },
        { note: '5 finishes at the rim.', o: { 5: [2.0, 8.2] }, ball: 'rim', passAt: 0.5, dur: 0.8 }
      ]
    },
    {
      id: 'demo-23-zone',
      name: '2-3 Zone Shifts',
      category: 'Defense',
      sample: true,
      defense: 'zone23',
      description: 'Watch the 2-3 zone slide together as the ball moves around the perimeter.',
      frames: [
        { note: 'Ball at the top. One guard steps up to pressure. The forwards and center protect the paint.', o: { 1: 'top', 2: 'lwing', 3: 'rwing', 4: 'lcorner', 5: 'rcorner' }, ball: 1, hold: 2.2 },
        { note: 'Ball to the left wing. The left guard closes out, the center slides to the ballside block, the right forward guards the rim.', ball: 2, dur: 0.9, hold: 2.4 },
        { note: 'Ball to the corner. The left forward takes the ball, the center fronts the low post, the left guard drops to stop the pass back.', ball: 4, dur: 0.9, hold: 2.4 },
        { note: 'Ball back to the wing. Everyone slides back up together.', ball: 2, dur: 0.9, hold: 1.6 },
        { note: 'Reversal to the top.', ball: 1, dur: 0.9, hold: 1.6 },
        { note: 'Ball to the right wing. Same rules, mirrored.', ball: 3, dur: 0.9, hold: 2.0 },
        { note: 'Skip pass to the far corner. The zone has to sprint across while the ball is in the air.', ball: 4, dur: 1.2, hold: 2.4 }
      ]
    },
    {
      id: 'demo-man-help',
      name: 'Man-to-Man Help Side',
      category: 'Defense',
      sample: true,
      defense: 'man',
      description: 'Where each defender stands depending on how many passes away their player is.',
      frames: [
        { note: "On the ball: arm's length away, between your player and the basket.", o: { 1: 'top', 2: 'lwing', 3: 'rwing', 4: 'lcorner', 5: 'rcorner' }, ball: 1, hold: 2.2 },
        { note: 'Ball to the wing. One pass away: deny, hand in the passing lane. Two passes away: sag to the middle, see man and ball.', ball: 2, dur: 0.9, hold: 2.6 },
        { note: 'Ball to the corner. Weak-side defenders sink to the rim to help.', ball: 4, dur: 0.9, hold: 2.4 },
        { note: 'Ball back out. Everyone jumps toward the ball while it is in the air.', ball: 2, dur: 0.9, hold: 1.6 },
        { note: 'Reversal to the top. The help side becomes the deny side.', ball: 1, dur: 0.9, hold: 1.8 },
        { note: 'Ball to the right wing. Now the left side is the help side.', ball: 3, dur: 0.9, hold: 2.2 }
      ]
    }
  ]
};
