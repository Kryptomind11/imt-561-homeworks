registerSketch('sk2', function(p) {
    const CANVAS_SIZE = 800;

    // VERSION 2: Smooth transitions
    // CHANGE: Replaced second()-based timing with delta-time accumulation.
    // Added cubic easeInOut/easeIn/easeOut. Character poses are keyframe objects
    // interpolated with lerpPose(). Ball arc upgraded to cubic bezier.
    // Bounce uses parabolic arcs with decreasing amplitude.

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

    var POSES = {
        inhaleStart: { headOff: 90, crouchDip: 30, kneeSpread: 18, armRightX: 16, armRightY: 40, armLeftX: -10, armLeftY: 45 },
        holdStart: { headOff: 130, crouchDip: 0, kneeSpread: 6, armRightX: 14, armRightY: 18, armLeftX: -10, armLeftY: 18 },
        exhaleStart: { headOff: 126, crouchDip: 0, kneeSpread: 8, armRightX: 14, armRightY: 14, armLeftX: -10, armLeftY: 14 },
        exhaleEnd: { headOff: 134, crouchDip: 0, kneeSpread: 2, armRightX: 24, armRightY: -30, armLeftX: -8, armLeftY: 8 },
        returnStart: { headOff: 130, crouchDip: 0, kneeSpread: 4, armRightX: 14, armRightY: 22, armLeftX: -10, armLeftY: 22 },
        returnEnd: { headOff: 130, crouchDip: 0, kneeSpread: 4, armRightX: 10, armRightY: 28, armLeftX: -10, armLeftY: 28 }
    };

    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function easeIn(t) { return t * t * t; }

    function lerpPose(a, b, t) { var r = {}; for (var k in a) r[k] = a[k] + (b[k] - a[k]) * t; return r; }

    var cycleTime = 0,
        lastMillis = 0;

    p.setup = function() {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.angleMode(p.DEGREES);
        p.textFont('monospace');
        lastMillis = p.millis();
    };

    p.draw = function() {
        var now = p.millis(),
            dt = (now - lastMillis) / 1000;
        lastMillis = now;
        cycleTime = (cycleTime + dt) % TOTAL;
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
        if (phase === 0) pose = lerpPose(POSES.inhaleStart, POSES.holdStart, easeInOut(t));
        else if (phase === 1) pose = lerpPose(POSES.holdStart, POSES.exhaleStart, easeInOut(t));
        else if (phase === 2) pose = lerpPose(POSES.exhaleStart, POSES.exhaleEnd, easeInOut(t));
        else pose = lerpPose(POSES.returnStart, POSES.returnEnd, easeInOut(t));

        var bx, by;
        if (phase === 0) {
            var et = easeInOut(t);
            bx = CHAR_X + p.lerp(10, 14, et);
            by = p.lerp(FLOOR_Y - 8, FLOOR_Y - 80, et);
        } else if (phase === 1) {
            bx = CHAR_X + 14;
            by = FLOOR_Y - 80 + Math.sin(t * Math.PI * 2) * 3;
        } else if (phase === 2) {
            var shootT = Math.min(t / 0.85, 1),
                st = easeInOut(shootT);
            var sx = CHAR_X + 14,
                sy = FLOOR_Y - 80,
                ex = HOOP_X,
                ey = HOOP_Y + 5;
            var c1x = sx + 80,
                c1y = sy - 180,
                c2x = ex - 60,
                c2y = ey - 100,
                u = 1 - st;
            bx = u * u * u * sx + 3 * u * u * st * c1x + 3 * u * st * st * c2x + st * st * st * ex;
            by = u * u * u * sy + 3 * u * u * st * c1y + 3 * u * st * st * c2y + st * st * st * ey;
        } else {
            if (t < 0.08) { bx = HOOP_X;
                by = p.lerp(HOOP_Y + 5, HOOP_Y + 50, easeIn(t / 0.08)); } else if (t < 0.22) { var bt = (t - 0.08) / 0.14;
                bx = p.lerp(HOOP_X, HOOP_X + 40, bt);
                by = FLOOR_Y - 8 - Math.sin(bt * Math.PI) * 70 * (1 - bt * 0.3); } else if (t < 0.34) { var bt2 = (t - 0.22) / 0.12;
                bx = p.lerp(HOOP_X + 40, HOOP_X + 58, bt2);
                by = FLOOR_Y - 8 - Math.sin(bt2 * Math.PI) * 22; } else { var rollT = easeOut((t - 0.34) / 0.66);
                bx = p.lerp(HOOP_X + 58, CHAR_X + 10, rollT);
                by = FLOOR_Y - 8; }
        }

        drawCharacter(pose);
        p.noStroke();
        p.fill(210, 120, 40);
        p.ellipse(bx, by, 28, 28);

        p.fill(80);
        p.noStroke();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(11);
        p.textStyle(p.NORMAL);
        p.text('BOX BREATHING \u00B7 6s PER PHASE \u00B7 24s CYCLE', W / 2, H - 12);
        p.noFill();
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, p.width - 1, p.height - 1);
    };

    function drawUI(phase, t) {
        var col = p.color(COLORS[phase]);
        p.noStroke();
        p.fill(col);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(22);
        p.textStyle(p.BOLD);
        p.text(PHASES[phase], W / 2, 18);
        p.textSize(14);
        p.textStyle(p.NORMAL);
        p.fill(160);
        p.text(Math.ceil(PHASE_DUR * (1 - t)) + 's', W / 2, 46);
        p.noStroke();
        p.fill(35);
        p.rect(W / 2 - 120, 66, 240, 8, 4);
        p.fill(col);
        p.rect(W / 2 - 120, 66, 240 * t, 8, 4);
        for (var i = 0; i < 4; i++) {
            var isActive = i === phase;
            p.fill(isActive ? col : p.color(55));
            p.noStroke();
            p.ellipse(W / 2 - 45 + i * 30, 90, isActive ? 11 : 8, isActive ? 11 : 8);
            if (isActive) { p.fill(120);
                p.textSize(8);
                p.textAlign(p.CENTER, p.TOP);
                p.text(PHASES[i], W / 2 - 45 + i * 30, 99); }
        }
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
        p.stroke(190, 190, 190, 140);
        p.strokeWeight(1);
        for (var i = 0; i <= 4; i++) { var nx = p.lerp(hx - rw / 2, hx + rw / 2, i / 4);
            p.line(nx, hy, p.lerp(hx - rw / 4, hx + rw / 4, i / 4), hy + 40); }
        for (var j = 1; j <= 3; j++) { var ny = hy + j * 10,
                sh = j * 3;
            p.line(hx - rw / 2 + sh, ny, hx + rw / 2 - sh, ny); }
    }

    function drawCharacter(pose) {
        var cx = CHAR_X,
            groundY = FLOOR_Y;
        var headY = groundY - pose.headOff + pose.crouchDip;
        var bodyTopY = headY + 14,
            bodyBotY = groundY - 10;
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

    p.windowResized = function() { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});