// Instance-mode sketch for tab 2
registerSketch('sk2', function(p) {
    const CANVAS_SIZE = 800;

    var W = 800,
        H = 800;
    var PHASE_DUR = 6,
        TOTAL = 24;
    var PHASES = ['INHALE', 'HOLD', 'EXHALE', 'HOLD'];
    var COLORS = ['#4FC3F7', '#FFD54F', '#AED581', '#FFD54F'];

    var CHAR_X = 200,
        FLOOR_Y = 600,
        HOOP_X = 650,
        HOOP_Y = 320,
        RIM_W = 52;

    var isPlaying = false;
    // button positioned to the left of the phase label
    var btnX = W / 2 - 120 - 50,
        btnY = 16,
        btnW = 36,
        btnH = 28;

    var POSES = {
        inhaleStart: { headOff: 90, crouchDip: 30, kneeSpread: 18, armRightX: 16, armRightY: 40, armLeftX: -10, armLeftY: 45 },
        holdStart: { headOff: 130, crouchDip: 0, kneeSpread: 6, armRightX: 14, armRightY: 18, armLeftX: -10, armLeftY: 18 },
        exhaleStart: { headOff: 126, crouchDip: 0, kneeSpread: 8, armRightX: 14, armRightY: 14, armLeftX: -10, armLeftY: 14 },
        exhaleRelease: { headOff: 128, crouchDip: 0, kneeSpread: 6, armRightX: 16, armRightY: 8, armLeftX: -10, armLeftY: 10 },
        exhaleFollow: { headOff: 134, crouchDip: 0, kneeSpread: 2, armRightX: 24, armRightY: -30, armLeftX: -8, armLeftY: 8 },
        returnStand: { headOff: 130, crouchDip: 0, kneeSpread: 4, armRightX: 14, armRightY: 22, armLeftX: -10, armLeftY: 22 },
        returnMid: { headOff: 115, crouchDip: 12, kneeSpread: 10, armRightX: 15, armRightY: 30, armLeftX: -10, armLeftY: 32 },
        returnCrouch: { headOff: 90, crouchDip: 30, kneeSpread: 18, armRightX: 16, armRightY: 40, armLeftX: -10, armLeftY: 45 }
    };

    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function easeIn(t) { return t * t * t; }

    function easeGravity(t) { return t * t; }

    function lerpPose(a, b, t) { var r = {}; for (var k in a) r[k] = a[k] + (b[k] - a[k]) * t; return r; }

    var cycleTime = 0,
        lastMillis = 0;

    p.setup = function() {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.angleMode(p.DEGREES);
        p.textFont('monospace');
        lastMillis = p.millis();
    };

    p.mousePressed = function() {
        if (p.mouseX >= btnX && p.mouseX <= btnX + btnW &&
            p.mouseY >= btnY && p.mouseY <= btnY + btnH) {
            isPlaying = !isPlaying;
            if (isPlaying) {
                lastMillis = p.millis();
                cycleTime = 0;
            }
        }
    };

    p.draw = function() {
        var now = p.millis();
        var dt = (now - lastMillis) / 1000;
        lastMillis = now;

        if (isPlaying) {
            cycleTime = (cycleTime + dt) % TOTAL;
        }

        var phase = Math.floor(cycleTime / PHASE_DUR);
        var t = (cycleTime % PHASE_DUR) / PHASE_DUR;

        p.background(18, 18, 28);
        p.noStroke();
        p.fill(40, 30, 20);
        p.rect(0, FLOOR_Y, W, H - FLOOR_Y);
        p.stroke(50, 38, 25);
        p.strokeWeight(0.5);
        for (var i = 0; i < 6; i++) p.line(0, FLOOR_Y + 8 + i * 15, W, FLOOR_Y + 8 + i * 15);
        p.stroke(80, 60, 30);
        p.strokeWeight(1.5);
        p.line(0, FLOOR_Y, W, FLOOR_Y);

        drawHoop();
        drawUI(phase, t);

        var pose;
        if (phase === 0) {
            pose = lerpPose(POSES.inhaleStart, POSES.holdStart, easeInOut(t));
        } else if (phase === 1) {
            pose = lerpPose(POSES.holdStart, POSES.exhaleStart, easeInOut(t));
        } else if (phase === 2) {
            if (t < 0.25) {
                pose = lerpPose(POSES.exhaleStart, POSES.exhaleRelease, easeInOut(t / 0.25));
            } else {
                var armT = Math.min(easeOut((t - 0.25) / 0.25), 1.0);
                pose = lerpPose(POSES.exhaleRelease, POSES.exhaleFollow, armT);
            }
        } else {
            if (t < 0.25) {
                pose = lerpPose(POSES.exhaleFollow, POSES.returnStand, easeOut(t / 0.25));
            } else if (t < 0.45) {
                pose = POSES.returnStand;
            } else if (t < 0.70) {
                var anticipateT = (t - 0.45) / 0.25;
                pose = lerpPose(POSES.returnStand, POSES.returnMid, anticipateT);
            } else {
                var receiveT = (t - 0.70) / 0.30;
                pose = lerpPose(POSES.returnMid, POSES.returnCrouch, receiveT);
            }
        }

        var bx, by, ballSpin = 0;
        var rimY = HOOP_Y + 5;
        var netBottomY = HOOP_Y + 50;
        var floorBallY = FLOOR_Y - 8;

        if (phase === 0) {
            var et = easeInOut(t);
            bx = CHAR_X + p.lerp(10, 14, et);
            by = p.lerp(FLOOR_Y - 8, FLOOR_Y - 80, et);
        } else if (phase === 1) {
            bx = CHAR_X + 14;
            by = FLOOR_Y - 80 + Math.sin(t * Math.PI * 2) * 3;
        } else if (phase === 2) {
            var st = easeInOut(t);
            var sx = CHAR_X + 14,
                sy = FLOOR_Y - 80;
            var ex = HOOP_X,
                ey = rimY;
            var c1x = sx + 80,
                c1y = sy - 180;
            var c2x = ex - 60,
                c2y = ey - 100;
            var u = 1 - st;
            bx = u * u * u * sx + 3 * u * u * st * c1x + 3 * u * st * st * c2x + st * st * st * ex;
            by = u * u * u * sy + 3 * u * u * st * c1y + 3 * u * st * st * c2y + st * st * st * ey;
            ballSpin = st * 720;
        } else {
            if (t < 0.25) {
                var dropT = easeGravity(t / 0.25);
                bx = HOOP_X;
                by = p.lerp(rimY, netBottomY, dropT);
            } else if (t < 0.32) {
                var fallT = easeGravity((t - 0.25) / 0.07);
                bx = p.lerp(HOOP_X, HOOP_X + 12, fallT);
                by = p.lerp(netBottomY, floorBallY, fallT);
            } else if (t < 0.48) {
                var bt = (t - 0.32) / 0.16;
                bx = p.lerp(HOOP_X + 12, HOOP_X + 55, bt);
                by = floorBallY - Math.sin(bt * Math.PI) * 55;
            } else if (t < 0.58) {
                var bt2 = (t - 0.48) / 0.10;
                bx = p.lerp(HOOP_X + 55, HOOP_X + 70, bt2);
                by = floorBallY - Math.sin(bt2 * Math.PI) * 18;
            } else {
                var rollT = easeOut((t - 0.58) / 0.42);
                bx = p.lerp(HOOP_X + 70, CHAR_X + 10, rollT);
                by = floorBallY;
                ballSpin = -rollT * 480;
            }
        }

        drawCharacter(pose);
        drawBall(bx, by, 14, ballSpin);

        // SWISH text
        if (phase === 2 && t > 0.82) {
            var fadeIn = easeOut(p.constrain(p.map(t, 0.82, 0.90, 0, 1), 0, 1));
            var fadeOut = t > 0.94 ? easeIn(p.constrain(p.map(t, 0.94, 1.0, 1, 0), 0, 1)) : 1;
            var alpha = fadeIn * fadeOut * 220;
            var drift = p.map(t, 0.82, 1.0, 0, -14);
            p.fill(255, 220, 80, alpha);
            p.noStroke();
            p.textSize(18);
            p.textStyle(p.BOLD);
            p.textAlign(p.CENTER);
            p.text('SWISH', HOOP_X - 10, HOOP_Y - 40 + drift);
        }

        // Net ripple
        if ((phase === 2 && t > 0.92) || (phase === 3 && t < 0.28)) {
            var rippleT = phase === 2 ?
                p.map(t, 0.92, 1.0, 0, 0.1) :
                p.map(t, 0, 0.28, 0.1, 1.0);
            drawNetRipple(rippleT);
        }

        // idle message
        if (!isPlaying && cycleTime === 0) {
            p.fill(120);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(16);
            p.textStyle(p.NORMAL);
            p.text('Press play to begin breathing', W / 2, FLOOR_Y / 2);
        }

        p.fill(80);
        p.noStroke();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(11);
        p.textStyle(p.NORMAL);
        p.noFill();
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, p.width - 1, p.height - 1);
    };

    function drawUI(phase, t) {
        var col = isPlaying ? p.color(COLORS[phase]) : p.color(80);

        // ── PLAY / STOP BUTTON (left of phase label) ──────────────────────────
        var hovering = p.mouseX >= btnX && p.mouseX <= btnX + btnW &&
            p.mouseY >= btnY && p.mouseY <= btnY + btnH;

        p.noStroke();
        p.fill(hovering ? 55 : 35);
        p.rect(btnX, btnY, btnW, btnH, 4);

        p.stroke(hovering ? 120 : 70);
        p.strokeWeight(1);
        p.noFill();
        p.rect(btnX, btnY, btnW, btnH, 4);

        if (isPlaying) {
            // stop icon: square
            p.noStroke();
            p.fill(220);
            var sq = 10;
            p.rect(btnX + btnW / 2 - sq / 2, btnY + btnH / 2 - sq / 2, sq, sq, 1);
        } else {
            // play icon: triangle
            p.noStroke();
            p.fill(220);
            var cx = btnX + btnW / 2;
            var cy = btnY + btnH / 2;
            p.triangle(cx - 4, cy - 7, cx - 4, cy + 7, cx + 7, cy);
        }

        // ── PHASE LABEL (centered, same position as before) ───────────────────
        p.noStroke();
        p.fill(col);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(22);
        p.textStyle(p.BOLD);
        if (isPlaying) {
            p.text(PHASES[phase], W / 2, 18);
        } else {
            p.fill(80);
            p.text('READY', W / 2, 18);
        }

        // countdown
        p.textSize(14);
        p.textStyle(p.NORMAL);
        p.fill(160);
        if (isPlaying) {
            p.text(Math.ceil(PHASE_DUR * (1 - t)) + 's', W / 2, 46);
        } else {
            p.text('--', W / 2, 46);
        }

        // ── PROGRESS BAR (same position and width as original) ────────────────
        p.noStroke();
        p.fill(35);
        p.rect(W / 2 - 120, 66, 240, 8, 4);
        if (isPlaying) {
            p.fill(col);
            p.rect(W / 2 - 120, 66, 240 * t, 8, 4);
        }

        // ── PHASE DOTS (same position as original) ────────────────────────────
        for (var i = 0; i < 4; i++) {
            var a = i === phase && isPlaying;
            p.fill(a ? col : p.color(55));
            p.noStroke();
            p.ellipse(W / 2 - 45 + i * 30, 90, a ? 11 : 8, a ? 11 : 8);
            if (a) {
                p.fill(120);
                p.textSize(8);
                p.textAlign(p.CENTER, p.TOP);
                p.text(PHASES[i], W / 2 - 45 + i * 30, 99);
            }
        }

        if (hovering) p.cursor(p.HAND);
        else p.cursor(p.ARROW);
    }

    function drawHoop() {
        var hx = HOOP_X,
            hy = HOOP_Y,
            rw = RIM_W;
        p.stroke(110);
        p.strokeWeight(5);
        p.line(hx + rw / 2 + 14, hy + 28, hx + rw / 2 + 14, FLOOR_Y);
        p.fill(25, 25, 45);
        p.stroke(160);
        p.strokeWeight(3);
        p.rect(hx + rw / 2 + 8, hy - 48, 12, 80, 2);
        p.noFill();
        p.stroke(200, 50, 50);
        p.strokeWeight(1.5);
        p.rect(hx + rw / 2 + 9, hy - 28, 10, 20);
        p.stroke(210, 70, 30);
        p.strokeWeight(4);
        p.line(hx - rw / 2, hy, hx + rw / 2, hy);
        drawNet();
    }

    function drawNet() {
        var hx = HOOP_X,
            hy = HOOP_Y,
            rw = RIM_W;
        var netDepth = 42,
            bottomW = rw * 0.4;
        p.stroke(190, 190, 190, 130);
        p.strokeWeight(1);
        for (var i = 0; i <= 5; i++) {
            var topX = p.lerp(hx - rw / 2, hx + rw / 2, i / 5);
            var botX = p.lerp(hx - bottomW / 2, hx + bottomW / 2, i / 5);
            var midX = (topX + botX) / 2;
            p.noFill();
            p.beginShape();
            p.vertex(topX, hy + 2);
            p.quadraticVertex(midX, hy + netDepth * 0.5, botX, hy + netDepth);
            p.endShape();
        }
        for (var j = 1; j <= 3; j++) {
            var frac = j / 4,
                ny = hy + 2 + netDepth * frac,
                shrink = (rw - bottomW) / 2 * frac;
            p.line(hx - rw / 2 + shrink, ny, hx + rw / 2 - shrink, ny);
        }
    }

    function drawNetRipple(rippleT) {
        var hx = HOOP_X,
            hy = HOOP_Y,
            rw = RIM_W;
        var netDepth = 42,
            bottomW = rw * 0.4;
        var rippleAmt = Math.sin(rippleT * Math.PI) * 6;
        p.stroke(210, 210, 210, 160);
        p.strokeWeight(1);
        for (var i = 0; i <= 5; i++) {
            var topX = p.lerp(hx - rw / 2, hx + rw / 2, i / 5);
            var botX = p.lerp(hx - bottomW / 2, hx + bottomW / 2, i / 5);
            var wave = Math.sin(i * 1.5 + rippleT * 10) * rippleAmt;
            var midX = (topX + botX) / 2 + wave;
            var midY = hy + netDepth * 0.5 + Math.abs(wave) * 0.4;
            p.noFill();
            p.beginShape();
            p.vertex(topX, hy + 2);
            p.quadraticVertex(midX, midY, botX, hy + netDepth + rippleAmt * 0.25);
            p.endShape();
        }
    }

    function drawCharacter(pose) {
        var cx = CHAR_X,
            groundY = FLOOR_Y;
        var headY = groundY - pose.headOff + pose.crouchDip;
        var bodyTopY = headY + 14,
            bodyBotY = groundY - 10;
        var shadowW = 30 + pose.crouchDip * 0.5;
        p.noStroke();
        p.fill(10, 10, 15, 60);
        p.ellipse(cx, groundY + 2, shadowW, 6);
        p.stroke(220);
        p.strokeWeight(3);
        p.noFill();
        p.line(cx, bodyTopY, cx, bodyBotY);
        var kneeY = bodyBotY + (groundY - bodyBotY) * 0.5,
            ks = pose.kneeSpread;
        p.line(cx, bodyBotY, cx - ks, kneeY);
        p.line(cx - ks, kneeY, cx - 8, groundY);
        p.line(cx, bodyBotY, cx + ks, kneeY);
        p.line(cx + ks, kneeY, cx + 8, groundY);
        var shY = bodyTopY + 10;
        p.line(cx, shY, cx + pose.armRightX, shY + pose.armRightY);
        p.line(cx, shY, cx + pose.armLeftX, shY + pose.armLeftY);
        p.fill(220);
        p.noStroke();
        p.ellipse(cx, headY, 20, 20);
    }

    function drawBall(x, y, r, spin) {
        p.push();
        p.translate(x, y);
        if (spin) p.rotate(spin);
        p.noStroke();
        p.fill(210, 120, 40);
        p.ellipse(0, 0, r * 2, r * 2);
        p.stroke(170, 90, 25);
        p.strokeWeight(1.2);
        p.noFill();
        p.line(-r, 0, r, 0);
        p.arc(0, 0, r * 1.2, r * 2, -90, 90);
        p.arc(0, 0, r * 1.2, r * 2, 90, 270);
        p.noStroke();
        p.fill(240, 160, 70, 80);
        p.ellipse(-r * 0.3, -r * 0.3, r * 0.7, r * 0.5);
        p.pop();
    }

    p.windowResized = function() { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});