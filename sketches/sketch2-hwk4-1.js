// Instance-mode sketch for tab 2
registerSketch('sk2', function(p) {
    const CANVAS_SIZE = 800;

    var W = 800, H = 800;
    var PHASE_DUR = 4;
    var TOTAL = 16;
    var PHASES = ['INHALE', 'HOLD', 'EXHALE', 'HOLD'];
    var COLORS = ['#4FC3F7', '#FFD54F', '#AED581', '#FFD54F'];

    var CHAR_X = 200, FLOOR_Y = 560, HOOP_X = 650, HOOP_Y = 300, RIM_W = 52;

    // 'setup' | 'playing' | 'done'
    var appState = 'setup';
    var isPlaying = false;
    var showPauseMenu = false;

    var phaseDurSecs = 4;
    var sessionDurSecs = 300;

    var inputs = [
        { label: 'SECONDS PER PHASE',   placeholder: '4', value: '', focused: false },
        { label: 'SESSION LENGTH (MIN)', placeholder: '5', value: '', focused: false }
    ];

    var pauseInputs = [
        { label: 'SESSION LENGTH (MIN)', placeholder: '5', value: '', focused: false },
        { label: 'SECONDS PER PHASE',    placeholder: '4', value: '', focused: false }
    ];

    var sessionElapsed = 0;
    var cycleCount = 0;
    var confetti = [];

    // Stop button (during play — top left)
    var btnX = 20, btnY = 16, btnW = 36, btnH = 28;

    var POSES = {
        inhaleStart:   { headOff: 90,  crouchDip: 30, kneeSpread: 18, armRightX: 16,  armRightY: 40,  armLeftX: -10, armLeftY: 45 },
        holdStart:     { headOff: 130, crouchDip: 0,  kneeSpread: 6,  armRightX: 14,  armRightY: 18,  armLeftX: -10, armLeftY: 18 },
        exhaleStart:   { headOff: 126, crouchDip: 0,  kneeSpread: 8,  armRightX: 14,  armRightY: 14,  armLeftX: -10, armLeftY: 14 },
        exhaleRelease: { headOff: 128, crouchDip: 0,  kneeSpread: 6,  armRightX: 16,  armRightY: 8,   armLeftX: -10, armLeftY: 10 },
        exhaleFollow:  { headOff: 134, crouchDip: 0,  kneeSpread: 2,  armRightX: 24,  armRightY: -30, armLeftX: -8,  armLeftY: 8  },
        returnStand:   { headOff: 130, crouchDip: 0,  kneeSpread: 4,  armRightX: 14,  armRightY: 22,  armLeftX: -10, armLeftY: 22 },
        returnMid:     { headOff: 115, crouchDip: 12, kneeSpread: 10, armRightX: 15,  armRightY: 30,  armLeftX: -10, armLeftY: 32 },
        returnCrouch:  { headOff: 90,  crouchDip: 30, kneeSpread: 18, armRightX: 16,  armRightY: 40,  armLeftX: -10, armLeftY: 45 }
    };

    function easeInOut(t) { return t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
    function easeOut(t)   { return 1-Math.pow(1-t,3); }
    function easeIn(t)    { return t*t*t; }
    function easeGravity(t) { return t*t; }
    function lerpPose(a, b, t) { var r={}; for(var k in a) r[k]=a[k]+(b[k]-a[k])*t; return r; }

    var cycleTime = 0, lastMillis = 0;

    p.setup = function() {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.angleMode(p.DEGREES);
        p.textFont('monospace');
        lastMillis = p.millis();
    };

    function startSession() {
        var pd = parseFloat(inputs[0].value !== '' ? inputs[0].value : inputs[0].placeholder);
        var sd = parseFloat(inputs[1].value !== '' ? inputs[1].value : inputs[1].placeholder);
        if (isNaN(pd) || pd < 1) pd = 4;
        if (isNaN(sd) || sd < 0.1) sd = 5;
        phaseDurSecs  = pd;
        PHASE_DUR     = pd;
        TOTAL         = pd * 4;
        sessionDurSecs = sd * 60;
        sessionElapsed = 0;
        cycleCount     = 0;
        cycleTime      = 0;
        lastMillis     = p.millis();
        isPlaying      = true;
        appState       = 'playing';
    }

    function openPauseMenu() {
        isPlaying = false;
        showPauseMenu = true;
        var sdMin = sessionDurSecs / 60;
        pauseInputs[0].value = (sdMin % 1 === 0) ? String(sdMin) : sdMin.toFixed(1);
        pauseInputs[1].value = String(phaseDurSecs);
        pauseInputs.forEach(function(f) { f.focused = false; });
    }

    function applyAndContinue() {
        var sd = parseFloat(pauseInputs[0].value);
        var pd = parseFloat(pauseInputs[1].value);
        if (!isNaN(sd) && sd >= 0.1) sessionDurSecs = sd * 60;
        if (!isNaN(pd) && pd >= 1) { phaseDurSecs = pd; PHASE_DUR = pd; TOTAL = pd * 4; }
        showPauseMenu = false;
        isPlaying = true;
        lastMillis = p.millis();
    }

    function applyAndReset() {
        var sd = parseFloat(pauseInputs[0].value);
        var pd = parseFloat(pauseInputs[1].value);
        if (!isNaN(sd) && sd >= 0.1) sessionDurSecs = sd * 60;
        if (!isNaN(pd) && pd >= 1) { phaseDurSecs = pd; PHASE_DUR = pd; TOTAL = pd * 4; }
        sessionElapsed = 0; cycleCount = 0; cycleTime = 0;
        showPauseMenu = false;
        isPlaying = true;
        lastMillis = p.millis();
    }

    function initConfetti() {
        confetti = [];
        for (var i = 0; i < 90; i++) {
            confetti.push({
                x: p.random(W),
                y: p.random(-200, H),
                vy: p.random(0.8, 2.8),
                vx: p.random(-0.9, 0.9),
                size: p.random(7, 17),
                r: Math.floor(p.random(256)),
                g: Math.floor(p.random(256)),
                b: Math.floor(p.random(256)),
                rot: p.random(360),
                rotV: p.random(-2.5, 2.5)
            });
        }
    }

    function getInputRect(i) {
        return { x: W/2-140, y: 318+i*128, w: 280, h: 54 };
    }
    function getSetupBtnRect()  { return { x: W/2-115, y: 596, w: 230, h: 60 }; }
    function getAgainBtnRect()  { return { x: W/2-120, y: 636, w: 240, h: 60 }; }

    function getPauseInputRect(i) { return { x: W/2-160, y: 230+i*110, w: 320, h: 52 }; }
    function getPauseContinueBtnRect() { return { x: W/2-165, y: 470, w: 155, h: 54 }; }
    function getPauseResetBtnRect()    { return { x: W/2+10,  y: 470, w: 155, h: 54 }; }

    p.mousePressed = function() {
        if (appState === 'setup') {
            var hit = false;
            for (var i = 0; i < inputs.length; i++) {
                var r = getInputRect(i);
                if (p.mouseX>=r.x && p.mouseX<=r.x+r.w && p.mouseY>=r.y && p.mouseY<=r.y+r.h) {
                    inputs.forEach(function(f) { f.focused = false; });
                    inputs[i].focused = true;
                    hit = true;
                    return;
                }
            }
            if (!hit) inputs.forEach(function(f) { f.focused = false; });
            var sb = getSetupBtnRect();
            if (p.mouseX>=sb.x && p.mouseX<=sb.x+sb.w && p.mouseY>=sb.y && p.mouseY<=sb.y+sb.h) startSession();

        } else if (appState === 'playing') {
            if (showPauseMenu) {
                var hit = false;
                for (var i = 0; i < pauseInputs.length; i++) {
                    var r = getPauseInputRect(i);
                    if (p.mouseX>=r.x && p.mouseX<=r.x+r.w && p.mouseY>=r.y && p.mouseY<=r.y+r.h) {
                        pauseInputs.forEach(function(f) { f.focused = false; });
                        pauseInputs[i].focused = true;
                        hit = true;
                        return;
                    }
                }
                if (!hit) pauseInputs.forEach(function(f) { f.focused = false; });
                var cb = getPauseContinueBtnRect();
                if (p.mouseX>=cb.x && p.mouseX<=cb.x+cb.w && p.mouseY>=cb.y && p.mouseY<=cb.y+cb.h) { applyAndContinue(); return; }
                var rb = getPauseResetBtnRect();
                if (p.mouseX>=rb.x && p.mouseX<=rb.x+rb.w && p.mouseY>=rb.y && p.mouseY<=rb.y+rb.h) { applyAndReset(); return; }
            } else {
                if (p.mouseX>=btnX && p.mouseX<=btnX+btnW && p.mouseY>=btnY && p.mouseY<=btnY+btnH) {
                    openPauseMenu();
                }
            }

        } else if (appState === 'done') {
            var ab = getAgainBtnRect();
            if (p.mouseX>=ab.x && p.mouseX<=ab.x+ab.w && p.mouseY>=ab.y && p.mouseY<=ab.y+ab.h) {
                appState = 'setup';
                isPlaying = false;
                showPauseMenu = false;
                cycleTime = 0;
                sessionElapsed = 0;
                cycleCount = 0;
                inputs.forEach(function(f) { f.value = ''; f.focused = false; });
            }
        }
    };

    p.keyPressed = function() {
        if (showPauseMenu) {
            var focused = null;
            for (var i = 0; i < pauseInputs.length; i++) if (pauseInputs[i].focused) { focused = pauseInputs[i]; break; }
            if (focused) {
                if (p.keyCode === p.BACKSPACE) { focused.value = focused.value.slice(0, -1); return false; }
                if (p.key >= '0' && p.key <= '9' && focused.value.length < 5) { focused.value += p.key; }
                else if (p.key === '.' && focused.value.indexOf('.') === -1 && focused.value.length < 4) { focused.value += '.'; }
            }
            return false;
        }
        var focused = null;
        for (var i = 0; i < inputs.length; i++) if (inputs[i].focused) { focused = inputs[i]; break; }
        if (!focused) return;
        if (p.keyCode === p.BACKSPACE) { focused.value = focused.value.slice(0, -1); return false; }
        if (p.key >= '0' && p.key <= '9' && focused.value.length < 5) { focused.value += p.key; }
        else if (p.key === '.' && focused.value.indexOf('.') === -1 && focused.value.length < 4) { focused.value += '.'; }
        return false;
    };

    p.draw = function() {
        if (appState === 'setup') { drawSetupScreen(); return; }
        if (appState === 'done')  { drawDoneScreen();  return; }

        var now = p.millis();
        var dt  = (now - lastMillis) / 1000;
        lastMillis = now;

        if (isPlaying) {
            var prev = cycleTime;
            cycleTime = (cycleTime + dt) % TOTAL;
            sessionElapsed += dt;
            if (cycleTime < prev) cycleCount++;
            if (sessionElapsed >= sessionDurSecs) {
                isPlaying = false;
                appState  = 'done';
                initConfetti();
                return;
            }
        }

        var phase = Math.floor(cycleTime / PHASE_DUR);
        var t     = (cycleTime % PHASE_DUR) / PHASE_DUR;
        var phaseCol = p.color(COLORS[phase]);

        // Background + floor
        p.background(18, 18, 28);
        p.noStroke();
        p.fill(40, 30, 20);
        p.rect(0, FLOOR_Y, W, H-FLOOR_Y);
        p.stroke(50, 38, 25); p.strokeWeight(0.5);
        for (var i = 0; i < 6; i++) p.line(0, FLOOR_Y+8+i*15, W, FLOOR_Y+8+i*15);
        p.stroke(80, 60, 30); p.strokeWeight(1.5);
        p.line(0, FLOOR_Y, W, FLOOR_Y);

        drawHoop(phaseCol);
        drawUI(phase, t);

        // Pose
        var pose;
        if (phase === 0) {
            pose = lerpPose(POSES.inhaleStart, POSES.holdStart, easeInOut(t));
        } else if (phase === 1) {
            pose = lerpPose(POSES.holdStart, POSES.exhaleStart, easeInOut(t));
        } else if (phase === 2) {
            if (t < 0.25) pose = lerpPose(POSES.exhaleStart, POSES.exhaleRelease, easeInOut(t/0.25));
            else { var armT = Math.min(easeOut((t-0.25)/0.25), 1.0); pose = lerpPose(POSES.exhaleRelease, POSES.exhaleFollow, armT); }
        } else {
            if (t < 0.25) pose = lerpPose(POSES.exhaleFollow, POSES.returnStand, easeOut(t/0.25));
            else if (t < 0.45) pose = POSES.returnStand;
            else if (t < 0.70) { var aT = (t-0.45)/0.25; pose = lerpPose(POSES.returnStand, POSES.returnMid, aT); }
            else { var rT = (t-0.70)/0.30; pose = lerpPose(POSES.returnMid, POSES.returnCrouch, rT); }
        }

        // Ball
        var bx, by, ballSpin = 0;
        var rimY = HOOP_Y+5, netBottomY = HOOP_Y+50, floorBallY = FLOOR_Y-8;

        if (phase === 0) {
            var et = easeInOut(t);
            bx = CHAR_X + p.lerp(10, 14, et);
            by = p.lerp(FLOOR_Y-8, FLOOR_Y-80, et);
        } else if (phase === 1) {
            bx = CHAR_X+14;
            by = FLOOR_Y-80 + Math.sin(t*Math.PI*2)*3;
        } else if (phase === 2) {
            var st = easeInOut(t);
            var sx = CHAR_X+14, sy = FLOOR_Y-80, ex = HOOP_X, ey = rimY;
            var c1x = sx+80, c1y = sy-180, c2x = ex-60, c2y = ey-100, u = 1-st;
            bx = u*u*u*sx + 3*u*u*st*c1x + 3*u*st*st*c2x + st*st*st*ex;
            by = u*u*u*sy + 3*u*u*st*c1y + 3*u*st*st*c2y + st*st*st*ey;
            ballSpin = st*720;
        } else {
            if (t < 0.25) {
                var dT = easeGravity(t/0.25);
                bx = HOOP_X;
                by = p.lerp(rimY, netBottomY, dT);
            } else if (t < 0.32) {
                var fT = easeGravity((t-0.25)/0.07);
                bx = p.lerp(HOOP_X, HOOP_X+12, fT);
                by = p.lerp(netBottomY, floorBallY, fT);
            } else if (t < 0.48) {
                var bt = (t-0.32)/0.16;
                bx = p.lerp(HOOP_X+12, HOOP_X+55, bt);
                by = floorBallY - Math.sin(bt*Math.PI)*55;
            } else if (t < 0.58) {
                var bt2 = (t-0.48)/0.10;
                bx = p.lerp(HOOP_X+55, HOOP_X+70, bt2);
                by = floorBallY - Math.sin(bt2*Math.PI)*18;
            } else {
                var roT = easeOut((t-0.58)/0.42);
                bx = p.lerp(HOOP_X+70, CHAR_X+10, roT);
                by = floorBallY;
                ballSpin = -roT*480;
            }
        }

        drawCharacter(pose, phaseCol);
        drawBall(bx, by, 14, ballSpin);

        if (phase === 2 && t > 0.82) {
            var fadeIn  = easeOut(p.constrain(p.map(t, 0.82, 0.90, 0, 1), 0, 1));
            var fadeOut = t > 0.94 ? easeIn(p.constrain(p.map(t, 0.94, 1.0, 1, 0), 0, 1)) : 1;
            p.fill(255, 220, 80, fadeIn*fadeOut*220);
            p.noStroke(); p.textSize(18); p.textStyle(p.BOLD); p.textAlign(p.CENTER);
            p.text('SWISH', HOOP_X-10, HOOP_Y-40+p.map(t, 0.82, 1.0, 0, -14));
        }

        if ((phase === 2 && t > 0.92) || (phase === 3 && t < 0.28)) {
            var rpT = phase === 2 ? p.map(t, 0.92, 1.0, 0, 0.1) : p.map(t, 0, 0.28, 0.1, 1.0);
            drawNetRipple(rpT);
        }

        p.noFill(); p.stroke(0); p.strokeWeight(1);
        p.rect(0, 0, p.width-1, p.height-1);

        if (showPauseMenu) drawPauseMenu();
    };

    // ── SETUP SCREEN ──────────────────────────────────────────────────────────
    function drawSetupScreen() {
        p.background(18, 18, 28);

        p.noStroke();
        p.fill(79, 195, 247, 50);
        p.rect(0, 0, W, 5);

        drawBall(W/2, 104, 42, p.millis()/28);

        p.noStroke();
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(46);
        p.textStyle(p.BOLD);
        p.text('BOX BREATHING', W/2, 186);

        p.fill(160);
        p.textSize(16);
        p.textStyle(p.NORMAL);
        p.text('inhale  ·  hold  ·  exhale  ·  hold', W/2, 222);

        p.stroke(38);
        p.strokeWeight(1);
        p.line(W/2-170, 248, W/2+170, 248);

        for (var i = 0; i < inputs.length; i++) {
            var r   = getInputRect(i);
            var inp = inputs[i];
            var foc = inp.focused;

            p.noStroke();
            p.fill(foc ? 200 : 155);
            p.textSize(12);
            p.textStyle(p.NORMAL);
            p.textAlign(p.LEFT, p.BOTTOM);
            p.text(inp.label, r.x, r.y-8);

            p.noStroke();
            p.fill(foc ? 28 : 20);
            p.rect(r.x, r.y, r.w, r.h, 10);

            p.stroke(foc ? '#4FC3F7' : 48);
            p.strokeWeight(foc ? 2 : 1);
            p.noFill();
            p.rect(r.x, r.y, r.w, r.h, 10);

            var display = inp.value !== '' ? inp.value : inp.placeholder;
            p.noStroke();
            p.fill(inp.value !== '' ? 240 : 100);
            p.textSize(28);
            p.textStyle(p.BOLD);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(display, r.x+16, r.y+r.h/2);

            p.fill(100);
            p.textSize(14);
            p.textStyle(p.NORMAL);
            p.textAlign(p.RIGHT, p.CENTER);
            p.text(i===0 ? 'sec' : 'min', r.x+r.w-14, r.y+r.h/2);

            if (foc && Math.floor(p.millis()/520)%2===0) {
                p.textSize(28);
                p.textStyle(p.BOLD);
                p.textAlign(p.LEFT, p.CENTER);
                var tw = p.textWidth(inp.value !== '' ? inp.value : '');
                p.stroke(190);
                p.strokeWeight(2);
                p.line(r.x+18+tw, r.y+10, r.x+18+tw, r.y+r.h-10);
            }
        }

        var sb  = getSetupBtnRect();
        var hov = p.mouseX>=sb.x && p.mouseX<=sb.x+sb.w && p.mouseY>=sb.y && p.mouseY<=sb.y+sb.h;
        p.noStroke();
        p.fill(hov ? 55 : 38, hov ? 175 : 145, hov ? 55 : 38);
        p.rect(sb.x, sb.y, sb.w, sb.h, 14);
        if (hov) { p.stroke(80, 210, 80); p.strokeWeight(2); p.noFill(); p.rect(sb.x, sb.y, sb.w, sb.h, 14); }
        p.noStroke();
        p.fill(255);
        p.textSize(22);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('▶  START SESSION', W/2, sb.y+sb.h/2);

        if (hov) p.cursor(p.HAND); else p.cursor(p.ARROW);

        p.noFill(); p.stroke(0); p.strokeWeight(1);
        p.rect(0, 0, p.width-1, p.height-1);
    }

    // ── DONE SCREEN ───────────────────────────────────────────────────────────
    function drawDoneScreen() {
        p.background(18, 18, 28);

        for (var i = 0; i < confetti.length; i++) {
            var c = confetti[i];
            c.x  += c.vx;
            c.y  += c.vy;
            c.rot += c.rotV;
            if (c.y > H+20) { c.y = -20; c.x = p.random(W); }
            p.push();
            p.translate(c.x, c.y);
            p.rotate(c.rot);
            p.noStroke();
            p.fill(c.r, c.g, c.b, 210);
            p.rect(-c.size/2, -c.size/4, c.size, c.size/2, 3);
            p.pop();
        }

        var pulse = (Math.sin(p.millis()/480)+1)/2;
        for (var rad = 220; rad > 0; rad -= 28) {
            p.noStroke();
            p.fill(50+pulse*15, 170, 50+pulse*15, 7);
            p.ellipse(W/2, H/2-40, rad*2, rad*2);
        }

        drawStar(W/2, 194, 30, 64, 10);

        p.noStroke();
        var glow = p.map(pulse, 0, 1, 210, 255);
        p.fill(255, glow, 45);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(74);
        p.textStyle(p.BOLD);
        p.text('GREAT JOB!', W/2, 336);

        p.fill(200);
        p.textSize(20);
        p.textStyle(p.NORMAL);
        p.text('You crushed your meditation session!', W/2, 394);

        p.noStroke();
        p.fill(23, 23, 34);
        p.rect(W/2-185, 420, 370, 120, 16);
        p.stroke(48);
        p.strokeWeight(1);
        p.noFill();
        p.rect(W/2-185, 420, 370, 120, 16);

        p.noStroke();
        p.fill(255, 200, 48);
        p.textSize(54);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(cycleCount + (cycleCount === 1 ? ' shot made!' : ' shots made!'), W/2, 472);

        p.fill(160);
        p.textSize(15);
        p.textStyle(p.NORMAL);
        p.text(cycleCount + ' full breathing cycle' + (cycleCount!==1?'s':'') + ' completed', W/2, 516);

        var mD = Math.floor(sessionDurSecs/60);
        var sD = Math.round(sessionDurSecs % 60);
        p.fill(120);
        p.textSize(13);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(mD + 'm' + (sD>0?' '+sD+'s':'') + ' session  ·  ' + phaseDurSecs + 's per phase', W/2, 558);

        var ab  = getAgainBtnRect();
        var hov = p.mouseX>=ab.x && p.mouseX<=ab.x+ab.w && p.mouseY>=ab.y && p.mouseY<=ab.y+ab.h;
        p.noStroke();
        p.fill(hov ? 72 : 50, hov ? 72 : 50, hov ? 185 : 155);
        p.rect(ab.x, ab.y, ab.w, ab.h, 14);
        if (hov) { p.stroke(110, 110, 230); p.strokeWeight(2); p.noFill(); p.rect(ab.x, ab.y, ab.w, ab.h, 14); }
        p.noStroke();
        p.fill(255);
        p.textSize(21);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('MEDITATE AGAIN', W/2, ab.y+ab.h/2);

        if (hov) p.cursor(p.HAND); else p.cursor(p.ARROW);

        p.noFill(); p.stroke(0); p.strokeWeight(1);
        p.rect(0, 0, p.width-1, p.height-1);
    }

    function drawStar(x, y, r1, r2, npoints) {
        var pulse = (Math.sin(p.millis()/380)+1)/2;
        p.noStroke();
        p.fill(255, 195+pulse*60, 35);
        p.beginShape();
        for (var i = 0; i < npoints*2; i++) {
            var r = i%2===0 ? r2 : r1;
            var a = (i * 360/(npoints*2)) - 90;
            p.vertex(x + Math.cos(p.radians(a))*r, y + Math.sin(p.radians(a))*r);
        }
        p.endShape(p.CLOSE);
    }

    // ── PAUSE MENU OVERLAY ────────────────────────────────────────────────────
    function drawPauseMenu() {
        // Dim overlay
        p.noStroke();
        p.fill(0, 0, 0, 175);
        p.rect(0, 0, W, H);

        // Card
        var cardX = W/2-190, cardY = 140, cardW = 380, cardH = 390;
        p.noStroke();
        p.fill(22, 22, 35);
        p.rect(cardX, cardY, cardW, cardH, 18);
        p.stroke(70);
        p.strokeWeight(1.5);
        p.noFill();
        p.rect(cardX, cardY, cardW, cardH, 18);

        // Title
        p.noStroke();
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(28);
        p.textStyle(p.BOLD);
        p.text('PAUSED', W/2, cardY+40);

        p.stroke(50);
        p.strokeWeight(1);
        p.line(cardX+24, cardY+64, cardX+cardW-24, cardY+64);

        // Inputs
        for (var i = 0; i < pauseInputs.length; i++) {
            var r   = getPauseInputRect(i);
            var inp = pauseInputs[i];
            var foc = inp.focused;

            p.noStroke();
            p.fill(foc ? 220 : 170);
            p.textSize(11);
            p.textStyle(p.NORMAL);
            p.textAlign(p.LEFT, p.BOTTOM);
            p.text(inp.label, r.x, r.y-7);

            p.noStroke();
            p.fill(foc ? 30 : 22);
            p.rect(r.x, r.y, r.w, r.h, 8);

            p.stroke(foc ? '#4FC3F7' : 60);
            p.strokeWeight(foc ? 2 : 1);
            p.noFill();
            p.rect(r.x, r.y, r.w, r.h, 8);

            var display = inp.value !== '' ? inp.value : inp.placeholder;
            p.noStroke();
            p.fill(inp.value !== '' ? 240 : 90);
            p.textSize(24);
            p.textStyle(p.BOLD);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(display, r.x+14, r.y+r.h/2);

            p.fill(90);
            p.textSize(13);
            p.textStyle(p.NORMAL);
            p.textAlign(p.RIGHT, p.CENTER);
            p.text(i===0 ? 'min' : 'sec', r.x+r.w-12, r.y+r.h/2);

            if (foc && Math.floor(p.millis()/520)%2===0) {
                p.textSize(24);
                p.textStyle(p.BOLD);
                p.textAlign(p.LEFT, p.CENTER);
                var tw = p.textWidth(inp.value !== '' ? inp.value : '');
                p.stroke(190);
                p.strokeWeight(2);
                p.line(r.x+16+tw, r.y+9, r.x+16+tw, r.y+r.h-9);
            }
        }

        // Continue button
        var cb  = getPauseContinueBtnRect();
        var hc  = p.mouseX>=cb.x && p.mouseX<=cb.x+cb.w && p.mouseY>=cb.y && p.mouseY<=cb.y+cb.h;
        p.noStroke();
        p.fill(hc ? 55 : 38, hc ? 175 : 145, hc ? 55 : 38);
        p.rect(cb.x, cb.y, cb.w, cb.h, 12);
        if (hc) { p.stroke(80, 210, 80); p.strokeWeight(1.5); p.noFill(); p.rect(cb.x, cb.y, cb.w, cb.h, 12); }
        p.noStroke();
        p.fill(255);
        p.textSize(16);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('▶  CONTINUE', cb.x+cb.w/2, cb.y+cb.h/2);

        // Reset button
        var rb  = getPauseResetBtnRect();
        var hr  = p.mouseX>=rb.x && p.mouseX<=rb.x+rb.w && p.mouseY>=rb.y && p.mouseY<=rb.y+rb.h;
        p.noStroke();
        p.fill(hr ? 185 : 145, hr ? 50 : 36, hr ? 50 : 36);
        p.rect(rb.x, rb.y, rb.w, rb.h, 12);
        if (hr) { p.stroke(210, 80, 80); p.strokeWeight(1.5); p.noFill(); p.rect(rb.x, rb.y, rb.w, rb.h, 12); }
        p.noStroke();
        p.fill(255);
        p.textSize(16);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('↺  RESET', rb.x+rb.w/2, rb.y+rb.h/2);

        // Hint text
        p.noStroke();
        p.fill(100);
        p.textSize(11);
        p.textStyle(p.NORMAL);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('Edit values above to adjust your session before continuing', W/2, cardY+cardH-22);

        if (hc || hr) p.cursor(p.HAND); else p.cursor(p.ARROW);
    }

    // ── PLAYING UI ────────────────────────────────────────────────────────────
    function drawUI(phase, t) {
        var col = p.color(COLORS[phase]);

        // Stop button (top left)
        var hovering = p.mouseX>=btnX && p.mouseX<=btnX+btnW && p.mouseY>=btnY && p.mouseY<=btnY+btnH;
        p.noStroke();
        p.fill(hovering ? 55 : 35);
        p.rect(btnX, btnY, btnW, btnH, 4);
        p.stroke(hovering ? 120 : 70);
        p.strokeWeight(1);
        p.noFill();
        p.rect(btnX, btnY, btnW, btnH, 4);
        // Stop icon (square)
        p.noStroke();
        p.fill(220);
        p.rect(btnX+btnW/2-5, btnY+btnH/2-5, 10, 10, 2);

        // Time remaining (top right)
        var remaining = Math.max(0, sessionDurSecs - sessionElapsed);
        var remM = Math.floor(remaining/60);
        var remS = Math.ceil(remaining%60);
        if (remS===60) { remM++; remS=0; }
        p.noStroke();
        p.fill(160);
        p.textSize(13);
        p.textStyle(p.NORMAL);
        p.textAlign(p.RIGHT, p.TOP);
        p.text((remM<10?'0':'')+remM+':'+(remS<10?'0':'')+remS+' left', W-14, 20);

        // Big phase name
        p.noStroke();
        p.fill(col);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(62);
        p.textStyle(p.BOLD);
        p.text(PHASES[phase], W/2, 8);

        // Countdown seconds
        p.noStroke();
        p.fill(210);
        p.textSize(22);
        p.textStyle(p.NORMAL);
        p.textAlign(p.CENTER, p.TOP);
        p.text(Math.ceil(PHASE_DUR*(1-t)) + 's', W/2, 80);

        // Large progress bar
        p.noStroke();
        p.fill(30);
        p.rect(W/2-230, 108, 460, 22, 11);
        p.fill(col);
        var barW = Math.max(0, 460 * t);
        p.rect(W/2-230, 108, barW, 22, 11);

        // Phase dots + labels
        var spacing = 52;
        var startX  = W/2 - spacing*1.5;
        for (var i = 0; i < 4; i++) {
            var active = i===phase;
            p.noStroke();
            p.fill(active ? col : p.color(70));
            var dx = startX + i*spacing;
            var dy = 148;
            p.ellipse(dx, dy, active ? 16 : 11, active ? 16 : 11);
            p.fill(active ? 240 : 150);
            p.textSize(active ? 13 : 11);
            p.textStyle(active ? p.BOLD : p.NORMAL);
            p.textAlign(p.CENTER, p.TOP);
            p.text(PHASES[i], dx, dy+11);
        }

        if (hovering) p.cursor(p.HAND); else p.cursor(p.ARROW);
    }

    // ── HOOP / NET ────────────────────────────────────────────────────────────
    function drawHoop(phaseCol) {
        var hx=HOOP_X, hy=HOOP_Y, rw=RIM_W;
        p.stroke(110); p.strokeWeight(5);
        p.line(hx+rw/2+14, hy+28, hx+rw/2+14, FLOOR_Y);

        // Backboard colored to match phase
        var r = p.red(phaseCol), g = p.green(phaseCol), b = p.blue(phaseCol);
        p.fill(r*0.18, g*0.18, b*0.18);
        p.stroke(r*0.7, g*0.7, b*0.7);
        p.strokeWeight(3);
        p.rect(hx+rw/2+8, hy-48, 12, 80, 2);

        // Targeting square on backboard
        p.noFill();
        p.stroke(r, g, b);
        p.strokeWeight(1.5);
        p.rect(hx+rw/2+9, hy-28, 10, 20);

        p.stroke(210, 70, 30); p.strokeWeight(4);
        p.line(hx-rw/2, hy, hx+rw/2, hy);
        drawNet();
    }

    function drawNet() {
        var hx=HOOP_X, hy=HOOP_Y, rw=RIM_W, nd=42, bw=rw*0.4;
        p.stroke(190, 190, 190, 130); p.strokeWeight(1);
        for (var i=0; i<=5; i++) {
            var tX=p.lerp(hx-rw/2, hx+rw/2, i/5), bX=p.lerp(hx-bw/2, hx+bw/2, i/5);
            p.noFill(); p.beginShape();
            p.vertex(tX, hy+2);
            p.quadraticVertex((tX+bX)/2, hy+nd*0.5, bX, hy+nd);
            p.endShape();
        }
        for (var j=1; j<=3; j++) {
            var f=j/4, ny=hy+2+nd*f, sh=(rw-bw)/2*f;
            p.line(hx-rw/2+sh, ny, hx+rw/2-sh, ny);
        }
    }

    function drawNetRipple(rpT) {
        var hx=HOOP_X, hy=HOOP_Y, rw=RIM_W, nd=42, bw=rw*0.4, ra=Math.sin(rpT*Math.PI)*6;
        p.stroke(210, 210, 210, 160); p.strokeWeight(1);
        for (var i=0; i<=5; i++) {
            var tX=p.lerp(hx-rw/2, hx+rw/2, i/5), bX=p.lerp(hx-bw/2, hx+bw/2, i/5);
            var w=Math.sin(i*1.5+rpT*10)*ra;
            p.noFill(); p.beginShape();
            p.vertex(tX, hy+2);
            p.quadraticVertex((tX+bX)/2+w, hy+nd*0.5+Math.abs(w)*0.4, bX, hy+nd+ra*0.25);
            p.endShape();
        }
    }

    // ── CHARACTER / BALL ──────────────────────────────────────────────────────
    function drawCharacter(pose, phaseCol) {
        var cx=CHAR_X, gY=FLOOR_Y, hY=gY-pose.headOff+pose.crouchDip;
        var btY=hY+14, bbY=gY-10;
        var r = p.red(phaseCol), g = p.green(phaseCol), b = p.blue(phaseCol);
        p.noStroke(); p.fill(r*0.1, g*0.1, b*0.1, 60);
        p.ellipse(cx, gY+2, 30+pose.crouchDip*0.5, 6);
        p.stroke(r, g, b); p.strokeWeight(3); p.noFill();
        p.line(cx, btY, cx, bbY);
        var kY=bbY+(gY-bbY)*0.5, ks=pose.kneeSpread;
        p.line(cx, bbY, cx-ks, kY);
        p.line(cx-ks, kY, cx-8, gY);
        p.line(cx, bbY, cx+ks, kY);
        p.line(cx+ks, kY, cx+8, gY);
        var sY=btY+10;
        p.line(cx, sY, cx+pose.armRightX, sY+pose.armRightY);
        p.line(cx, sY, cx+pose.armLeftX,  sY+pose.armLeftY);
        p.fill(r, g, b); p.noStroke();
        p.ellipse(cx, hY, 20, 20);
    }

    function drawBall(x, y, r, spin) {
        p.push();
        p.translate(x, y);
        if (spin) p.rotate(spin);
        p.noStroke(); p.fill(210, 120, 40);
        p.ellipse(0, 0, r*2, r*2);
        p.stroke(170, 90, 25); p.strokeWeight(1.2); p.noFill();
        p.line(-r, 0, r, 0);
        p.arc(0, 0, r*1.2, r*2, -90, 90);
        p.arc(0, 0, r*1.2, r*2, 90, 270);
        p.noStroke(); p.fill(240, 160, 70, 80);
        p.ellipse(-r*0.3, -r*0.3, r*0.7, r*0.5);
        p.pop();
    }

    p.windowResized = function() { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});
