// Instance-mode sketch for tab 2
// Instance-mode sketch for tab 2
registerSketch('sk2', function(p) {
    const CANVAS_SIZE = 800;

    // VERSION 1: Basic functional version
    // Basic animation with second()-based timing, simple easing, no visual polish

    const W = 800,
        H = 800;
    const PHASE_DUR = 6;
    const TOTAL = 24;

    const PHASES = ['INHALE', 'HOLD', 'EXHALE', 'HOLD'];
    const COLORS = ['#4FC3F7', '#FFD54F', '#AED581', '#FFD54F'];

    const CHAR_X = 200;
    const FLOOR_Y = 600;
    const HOOP_X = 650;
    const HOOP_Y = 320;
    const RIM_W = 52;

    var ease = function(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; };

    p.setup = function() {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        p.angleMode(p.DEGREES);
        p.textFont('monospace');
    };

    p.draw = function() {
        var s = p.second();
        var ms = p.millis() % 1000;
        var elapsed = (s % TOTAL) + ms / 1000;
        var phase = Math.floor(elapsed / PHASE_DUR);
        var t = (elapsed % PHASE_DUR) / PHASE_DUR;
        var et = ease(t);

        p.background(18, 18, 28);

        // floor
        p.noStroke();
        p.fill(40, 30, 20);
        p.rect(0, FLOOR_Y, W, H - FLOOR_Y);
        p.stroke(80, 60, 30);
        p.strokeWeight(1.5);
        p.line(0, FLOOR_Y, W, FLOOR_Y);

        drawHoop(p);

        // UI
        var phaseColor = COLORS[phase];
        p.noStroke();
        p.fill(phaseColor);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(22);
        p.textStyle(p.BOLD);
        p.text(PHASES[phase], W / 2, 18);

        var secLeft = Math.ceil(PHASE_DUR - t * PHASE_DUR);
        p.textSize(14);
        p.textStyle(p.NORMAL);
        p.fill(180);
        p.text(secLeft + 's', W / 2, 46);

        p.noStroke();
        p.fill(40);
        p.rect(W / 2 - 120, 66, 240, 8, 4);
        p.fill(phaseColor);
        p.rect(W / 2 - 120, 66, 240 * t, 8, 4);

        for (var i = 0; i < 4; i++) {
            p.fill(i === phase ? phaseColor : 60);
            p.noStroke();
            p.ellipse(W / 2 - 45 + i * 30, 90, 10, 10);
        }

        // ball position
        var bx, by;
        if (phase === 0) {
            bx = CHAR_X + 10;
            by = p.lerp(FLOOR_Y, FLOOR_Y - 80, et);
        } else if (phase === 1) {
            bx = CHAR_X + 14;
            by = FLOOR_Y - 80;
        } else if (phase === 2) {
            var startX = CHAR_X + 14,
                startY = FLOOR_Y - 80;
            var endX = HOOP_X,
                endY = HOOP_Y + 5;
            var peakY = Math.min(startY, endY) - 120;
            bx = p.lerp(p.lerp(startX, (startX + endX) / 2, et),
                p.lerp((startX + endX) / 2, endX, et), et);
            by = p.lerp(p.lerp(startY, peakY, et),
                p.lerp(peakY, endY, et), et);
        } else {
            if (et < 0.15) {
                bx = HOOP_X + p.lerp(0, 30, et / 0.15);
                by = HOOP_Y + p.lerp(5, 40, et / 0.15);
            } else if (et < 0.3) {
                var sub = (et - 0.15) / 0.15;
                bx = p.lerp(HOOP_X + 30, HOOP_X + 50, sub);
                by = p.lerp(HOOP_Y + 40, FLOOR_Y - 8, sub);
            } else {
                var rollT = ease((et - 0.3) / 0.7);
                bx = p.lerp(HOOP_X + 50, CHAR_X + 10, rollT);
                by = FLOOR_Y - 8;
            }
        }

        drawCharacter(p, phase, t, et);

        // ball — flat circle
        p.noStroke();
        p.fill(210, 120, 40);
        p.ellipse(bx, by, 28, 28);

        // footer
        p.fill(80);
        p.noStroke();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(11);
        p.textStyle(p.NORMAL);
        p.text('BOX BREATHING \u00B7 6s PER PHASE \u00B7 24s CYCLE', W / 2, H - 12);

        // frame
        p.noFill();
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, p.width - 1, p.height - 1);
    };

    function drawHoop(pp) {
        var hx = HOOP_X,
            hy = HOOP_Y,
            rw = RIM_W;
        pp.stroke(130);
        pp.strokeWeight(5);
        pp.line(hx + rw / 2 + 14, hy + 28, hx + rw / 2 + 14, FLOOR_Y);
        pp.fill(25, 25, 45);
        pp.stroke(180);
        pp.strokeWeight(3);
        pp.rect(hx + rw / 2 + 8, hy - 48, 12, 80, 2);
        pp.noFill();
        pp.stroke(220, 60, 60);
        pp.strokeWeight(1.5);
        pp.rect(hx + rw / 2 + 9, hy - 28, 10, 20);
        pp.stroke(210, 70, 30);
        pp.strokeWeight(4);
        pp.line(hx - rw / 2, hy, hx + rw / 2, hy);
        pp.stroke(190, 190, 190, 140);
        pp.strokeWeight(1);
        for (var i = 0; i <= 4; i++) {
            var nx = p.lerp(hx - rw / 2, hx + rw / 2, i / 4);
            pp.line(nx, hy, p.lerp(hx - rw / 4, hx + rw / 4, i / 4), hy + 40);
        }
        for (var j = 1; j <= 3; j++) {
            var ny = hy + j * 10,
                shrink = j * 3;
            pp.line(hx - rw / 2 + shrink, ny, hx + rw / 2 - shrink, ny);
        }
    }

    function drawCharacter(pp, phase, t, et) {
        var cx = CHAR_X,
            groundY = FLOOR_Y;
        pp.stroke(220);
        pp.strokeWeight(3);
        pp.noFill();
        var headY, bodyTopY, bodyBotY, kneeAngle;

        if (phase === 0) {
            var crouch = p.lerp(40, 0, et);
            headY = groundY - 100 - crouch * 0.6 + (1 - et) * 30;
            bodyTopY = headY + 14;
            bodyBotY = groundY - 10;
            kneeAngle = p.lerp(40, 0, et);
        } else if (phase === 1) {
            headY = groundY - 130;
            bodyTopY = headY + 14;
            bodyBotY = groundY - 10;
            kneeAngle = p.lerp(10, 5, et);
        } else if (phase === 2) {
            headY = groundY - 130;
            bodyTopY = headY + 14;
            bodyBotY = groundY - 10;
            kneeAngle = 0;
        } else {
            headY = groundY - 130;
            bodyTopY = headY + 14;
            bodyBotY = groundY - 10;
            kneeAngle = 0;
        }

        pp.fill(220);
        pp.noStroke();
        pp.ellipse(cx, headY, 20, 20);
        pp.stroke(220);
        pp.strokeWeight(3);
        pp.noFill();
        pp.line(cx, bodyTopY, cx, bodyBotY);

        var midLegY = bodyBotY + (groundY - bodyBotY) * 0.5;
        pp.line(cx, bodyBotY, cx - 12 - kneeAngle * 0.2, midLegY);
        pp.line(cx - 12 - kneeAngle * 0.2, midLegY, cx - 8, groundY);
        pp.line(cx, bodyBotY, cx + 12 + kneeAngle * 0.2, midLegY);
        pp.line(cx + 12 + kneeAngle * 0.2, midLegY, cx + 8, groundY);

        var shoulderY = bodyTopY + 10;
        if (phase === 0) {
            var armEndY = p.lerp(bodyBotY + 20, shoulderY + 10, et);
            pp.line(cx, shoulderY, cx + 16, armEndY);
            pp.line(cx, shoulderY, cx - 10, armEndY + 5);
        } else if (phase === 1) {
            pp.line(cx, shoulderY, cx + 14, shoulderY + 18);
            pp.line(cx, shoulderY, cx - 10, shoulderY + 18);
        } else if (phase === 2) {
            var armAngle = p.lerp(0, -60, et);
            pp.line(cx, shoulderY, cx + p.lerp(14, 24, et), shoulderY + armAngle * 0.5);
            pp.line(cx, shoulderY, cx - 10, shoulderY + p.lerp(18, 5, et));
        } else {
            pp.line(cx, shoulderY, cx + 14, shoulderY + 22);
            pp.line(cx, shoulderY, cx - 10, shoulderY + 22);
        }
    }

    p.windowResized = function() { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});