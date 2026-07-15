// Cursor mascot: a pixel-art dachshund that trots after the pointer.
//
// Runs only on devices with a real mouse/trackpad (hover + fine pointer) and
// only when the user hasn't asked for reduced motion — see the capability
// check right below the constants. Everything else (position, facing, which
// sprite frame is showing) lives in one state object driven by a single
// requestAnimationFrame loop; pointer/click listeners only ever write into
// that state, they never touch the DOM or start their own timers.
(function () {
  'use strict';

  var root = document.getElementById('cursorDachshund');
  if (!root || !window.matchMedia || !window.requestAnimationFrame) return;

  var canFollow = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Touch-only and reduced-motion visitors never see the mascot, and never
  // pay for the sprite downloads below or the pointermove listener.
  if (!canFollow.matches || reduceMotion.matches) return;

  // ---- Tunable constants -------------------------------------------------
  var SPRING_STIFFNESS = 72;    // deliberately soft: the dog follows one beat behind
  var SPRING_DAMPING_RATIO = 0.78; // gentle catch-up without a distracting long wobble
  var OFFSET_BEHIND = 50;       // px trailing distance behind the cursor
  var OFFSET_DOWN = 18;         // px, small supplementary drop so a purely
                                 // vertical cursor move can't park the dog on the hotspot
  var DIRECTION_ENTER = 14;     // px the cursor must lead by to flip facing
  var DIRECTION_EXIT = 6;       // px hysteresis floor before facing can flip again
  var DEAD_ZONE_ENTER = 24;     // px from target to start walking (spec: ~18-25)
  var DEAD_ZONE_EXIT = 18;      // px from target to settle back to idle (hysteresis floor)
  var WALK_FRAME_MS = 115;      // ~8.7fps, within the requested 8-10fps
  var POINTER_ACTIVE_MS = 140;  // keep trotting between ordinary pointermove events
  var CLICK_FRAME_MS = 55;      // within the requested 45-65ms/frame
  var EDGE_MARGIN = 6;          // px kept clear of the viewport edge

  // States, and the sprite-frame priority they imply: CLICKING beats
  // WALKING beats IDLE. Position updates happen every tick regardless of
  // state; only sprite-frame selection (and facing) is state-gated.
  var STATE = { IDLE: 'idle', WALKING: 'walking', CLICKING: 'clicking' };

  // Logical walk-cycle: walk-00 -> walk-01 -> walk-02 -> walk-03 -> walk-00.
  // Only two frames have the ear at rest, so 00/02 and 01/03 share art —
  // the *sequence* still has four steps, it just alternates two images.
  var WALK_SEQUENCE = ['neutral', 'walk-b', 'neutral', 'walk-b'];

  // Ear-flap click reaction: 0,1,2,3,4,5,4,3,2,1,0 over six drawn positions
  // (0 = ear at rest, 5 = peak flap), ping-ponging back down to a neutral
  // frame so it hands off cleanly to walking/idle when it's done.
  var FLAP_IMAGES = ['neutral', 'flap-1', 'flap-2', 'flap-3', 'flap-4', 'flap-5'];
  var FLAP_SEQUENCE = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];
  var CLICK_TOTAL_MS = FLAP_SEQUENCE.length * CLICK_FRAME_MS;

  // ---- Frame elements (queried once, never inside the loop) -------------
  var frameEls = {};
  var frameNodes = root.querySelectorAll('[data-frame]');
  for (var i = 0; i < frameNodes.length; i++) {
    frameEls[frameNodes[i].getAttribute('data-frame')] = frameNodes[i];
  }
  var requiredFrames = ['neutral', 'walk-b', 'flap-1', 'flap-2', 'flap-3', 'flap-4', 'flap-5'];
  for (var f = 0; f < requiredFrames.length; f++) {
    if (!frameEls[requiredFrames[f]]) return; // markup doesn't match — bail out safely
  }

  var activeFrameKey = 'neutral';
  function showFrame(key) {
    if (key === activeFrameKey) return;
    frameEls[activeFrameKey].classList.remove('is-active');
    frameEls[key].classList.add('is-active');
    activeFrameKey = key;
  }

  // ---- Preload every frame before the mascot is allowed to appear -------
  var assetsReady = false;
  var loadPromises = requiredFrames.map(function (key) {
    var img = frameEls[key];
    return new Promise(function (resolve) {
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.complete && img.naturalWidth) { resolve(); return; }
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true }); // don't block forever on one bad file
    });
  });
  Promise.all(loadPromises).then(function () {
    assetsReady = true;
    revealIfReady();
  });

  // ---- Motion state -------------------------------------------------
  var boxW = 0, boxH = 0;
  function measure() {
    var rect = root.getBoundingClientRect();
    if (rect.width) { boxW = rect.width; boxH = rect.height; }
  }
  measure();
  window.addEventListener('resize', measure, { passive: true });

  var pointerX = window.innerWidth / 2;
  var pointerY = window.innerHeight / 2;
  var posX = pointerX, posY = pointerY;   // current rendered center
  var velX = 0, velY = 0;                 // spring velocity
  var facing = 1;                          // 1 = art's native right-facing, -1 = flipped
  var isMoving = false;                    // hysteresis-smoothed walk/idle flag
  var walkStepIndex = 0;
  var walkAccumMs = 0;
  var clickElapsedMs = 0;
  var state = STATE.IDLE;
  var lastPointerMotionTime = -Infinity;

  var hasMouseMoved = false;
  function revealIfReady() {
    if (hasMouseMoved && assetsReady) root.classList.add('is-visible');
  }

  function clamp(value, min, max) {
    return value < min ? min : (value > max ? max : value);
  }

  var onPointerMove = function (event) {
    var moved = Math.hypot(event.clientX - pointerX, event.clientY - pointerY);
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!hasMouseMoved) {
      // First sighting of the pointer: snap straight there instead of
      // sliding in from an arbitrary placeholder position.
      posX = pointerX;
      posY = pointerY;
      hasMouseMoved = true;
      revealIfReady();
    } else if (moved > 0.5) {
      // Distance alone is not enough to describe walking: while the dog is
      // already near its target, small/slow mouse movements used to leave it
      // on the neutral frame. Remember real pointer activity so its feet keep
      // trotting for the whole chase.
      lastPointerMotionTime = event.timeStamp;
    }
  };
  document.addEventListener('pointermove', onPointerMove, { passive: true });

  var onClickReaction = function () {
    // A new click always restarts the reaction from frame 0 — there's no
    // timer to cancel, just a counter to zero, so repeats can't overlap.
    state = STATE.CLICKING;
    clickElapsedMs = 0;
  };
  document.addEventListener('pointerdown', onClickReaction, { passive: true });

  var lastTime = 0;
  var pausedForVisibility = false;
  var onVisibilityChange = function () {
    // Reset the clock instead of applying one giant catch-up step when the
    // tab regains visibility.
    if (!document.hidden) lastTime = 0;
    pausedForVisibility = document.hidden;
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  function tick(now) {
    raf = window.requestAnimationFrame(tick);
    if (pausedForVisibility || !hasMouseMoved) { lastTime = now; return; }

    var dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
    lastTime = now;

    var halfW = boxW / 2 || 42;
    var halfH = boxH / 2 || 26;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    // Direction: hysteresis against the dog's own position, and frozen
    // entirely while the click reaction owns the sprite (spec: don't
    // change direction mid-flap unless necessary — it never is here,
    // the reaction is under a second).
    if (state !== STATE.CLICKING) {
      var dx = pointerX - posX;
      if (dx > DIRECTION_ENTER) facing = 1;
      else if (dx < -DIRECTION_ENTER) facing = -1;
      else if (Math.abs(dx) < DIRECTION_EXIT) { /* inside the dead band: keep current facing */ }
    }

    // Target sits a fixed distance behind the cursor (opposite the facing
    // direction) so the sprite never covers the pointer, clamped to the
    // viewport so the mascot can't wander off-screen.
    var targetX = clamp(pointerX - facing * OFFSET_BEHIND, halfW + EDGE_MARGIN, vw - halfW - EDGE_MARGIN);
    var targetY = clamp(pointerY + OFFSET_DOWN, halfH + EDGE_MARGIN, vh - halfH - EDGE_MARGIN);

    // Damped spring (semi-implicit Euler) toward the target — responsive,
    // with a light underdamped settle rather than a flat exponential glide.
    var omega = Math.sqrt(SPRING_STIFFNESS);
    var dampingCoef = 2 * SPRING_DAMPING_RATIO * omega;
    var accX = (targetX - posX) * SPRING_STIFFNESS - velX * dampingCoef;
    var accY = (targetY - posY) * SPRING_STIFFNESS - velY * dampingCoef;
    velX += accX * dt;
    velY += accY * dt;
    posX += velX * dt;
    posY += velY * dt;

    var distToTarget = Math.hypot(targetX - posX, targetY - posY);
    var pointerIsMoving = (now - lastPointerMotionTime) < POINTER_ACTIVE_MS;
    var stillCatchingUp = isMoving ? distToTarget > DEAD_ZONE_EXIT : distToTarget > DEAD_ZONE_ENTER;
    isMoving = pointerIsMoving || stillCatchingUp;

    // ---- State machine: clicking > walking > idle ----------------------
    if (state === STATE.CLICKING) {
      clickElapsedMs += dt * 1000;
      if (clickElapsedMs >= CLICK_TOTAL_MS) {
        state = isMoving ? STATE.WALKING : STATE.IDLE;
      } else {
        var step = Math.min(FLAP_SEQUENCE.length - 1, Math.floor(clickElapsedMs / CLICK_FRAME_MS));
        showFrame(FLAP_IMAGES[FLAP_SEQUENCE[step]]);
      }
    }
    if (state !== STATE.CLICKING) {
      state = isMoving ? STATE.WALKING : STATE.IDLE;
      if (state === STATE.WALKING) {
        walkAccumMs += dt * 1000;
        if (walkAccumMs >= WALK_FRAME_MS) {
          walkAccumMs = 0;
          walkStepIndex = (walkStepIndex + 1) % WALK_SEQUENCE.length;
        }
        showFrame(WALK_SEQUENCE[walkStepIndex]);
      } else {
        walkAccumMs = 0;
        walkStepIndex = 0;
        showFrame('neutral');
      }
    }

    root.style.setProperty('--dash-x', (posX - halfW) + 'px');
    root.style.setProperty('--dash-y', (posY - halfH) + 'px');
    root.style.setProperty('--dash-flip', facing);
  }

  var raf = window.requestAnimationFrame(tick);

  // Exposed only for completeness (this is a static multi-page site, so the
  // mascot's lifetime is naturally the page's lifetime — nothing calls this
  // today, but it leaves a clean teardown path if the include is ever
  // mounted/unmounted dynamically).
  window.__dachshundCursor = {
    destroy: function () {
      window.cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerdown', onClickReaction);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', measure);
    }
  };
})();
