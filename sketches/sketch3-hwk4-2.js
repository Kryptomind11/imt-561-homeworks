// Instance-mode sketch for tab 3
registerSketch('sk3', function(p) {
    const CANVAS_SIZE = 800;

    var W = 800,
        H = 800;
    var PHASE_DUR = 6,
        TOTAL = 24;
    var PHASES = ['INHALE', 'HOLD', 'EXHALE', 'HOLD'];
    var COLORS = ['#4FC3F7', '#FFD54F', '#AED581', '#FFD54F'];

    var isPlaying = false;
    var btnX = W / 2 - 24,
        btnY = 80,
        btnW = 48,
        btnH = 32;

    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    var cycleTime = 0,
        lastMillis = 0;

    p.setup = function() {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
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
        if (isPlaying) cycleTime = (cycleTime + dt) % TOTAL;

        var phase = Math.floor(cycleTime / PHASE_DUR);
        var t = (cycleTime % PHASE_DUR) / PHASE_DUR;

        p.background(12, 14, 20);

        // water level 0–1
        var waterLevel = 0;
        if (phase === 0) waterLevel = easeInOut(t);
        else if (phase === 1) waterLevel = 1;
        else if (phase === 2) waterLevel = 1 - easeInOut(t);
        else waterLevel = 0;

        // ── PHASE LABEL (top center, large) ───────────────────────────────────
        var col = isPlaying ? p.color(COLORS[phase]) : p.color(70);
        p.textFont('monospace');
        p.noStroke();
        p.fill(col);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(28);
        p.textStyle(p.BOLD);
        if (isPlaying) {
            p.text(PHASES[phase], W / 2, 20);
        } else {
            p.fill(70);
            p.text('READY', W / 2, 20);
        }

        // countdown
        p.textSize(16);
        p.textStyle(p.NORMAL);
        p.fill(isPlaying ? 140 : 50);
        if (isPlaying) {
            p.text(Math.ceil(PHASE_DUR * (1 - t)) + 's', W / 2, 55);
        } else {
            p.text('--', W / 2, 55);
        }

        // ── PLAY / STOP BUTTON ────────────────────────────────────────────────
        var hovering = p.mouseX >= btnX && p.mouseX <= btnX + btnW &&
            p.mouseY >= btnY && p.mouseY <= btnY + btnH;

        p.noStroke();
        p.fill(hovering ? 45 : 28);
        p.rect(btnX, btnY, btnW, btnH, 6);
        p.stroke(hovering ? 100 : 50);
        p.strokeWeight(1);
        p.noFill();
        p.rect(btnX, btnY, btnW, btnH, 6);

        if (isPlaying) {
            p.noStroke();
            p.fill(200);
            p.rect(btnX + btnW / 2 - 5, btnY + btnH / 2 - 5, 10, 10, 1);
        } else {
            p.noStroke();
            p.fill(200);
            var bcx = btnX + btnW / 2,
                bcy = btnY + btnH / 2;
            p.triangle(bcx - 5, bcy - 8, bcx - 5, bcy + 8, bcx + 8, bcy);
        }

        if (hovering) p.cursor(p.HAND);
        else p.cursor(p.ARROW);

        // ── TRACHEA ───────────────────────────────────────────────────────────
        var tracheaTop = 170;
        var tracheaBot = 260;
        var splitY = 270;

        // trachea tube with rings
        p.stroke(160, 140, 140);
        p.strokeWeight(2);
        p.noFill();
        // left wall
        p.line(W / 2 - 12, tracheaTop, W / 2 - 12, tracheaBot);
        // right wall
        p.line(W / 2 + 12, tracheaTop, W / 2 + 12, tracheaBot);
        // cartilage rings
        p.stroke(140, 120, 120);
        p.strokeWeight(1.5);
        for (var ring = 0; ring < 6; ring++) {
            var ry = tracheaTop + 8 + ring * 14;
            p.arc(W / 2, ry, 24, 6, 0, 180);
        }

        // bronchi splitting
        p.stroke(160, 140, 140);
        p.strokeWeight(2);
        p.noFill();
        // left bronchus
        p.bezier(W / 2 - 12, tracheaBot, W / 2 - 30, splitY, W / 2 - 80, splitY + 10, W / 2 - 100, splitY + 30);
        p.bezier(W / 2 + 2, tracheaBot + 4, W / 2 - 15, splitY + 5, W / 2 - 60, splitY + 18, W / 2 - 80, splitY + 38);
        // right bronchus
        p.bezier(W / 2 + 12, tracheaBot, W / 2 + 30, splitY, W / 2 + 80, splitY + 10, W / 2 + 100, splitY + 30);
        p.bezier(W / 2 - 2, tracheaBot + 4, W / 2 + 15, splitY + 5, W / 2 + 60, splitY + 18, W / 2 + 80, splitY + 38);

        // ── DRAW LUNGS ────────────────────────────────────────────────────────
        drawRealisticLung(W / 2 - 60, waterLevel, -1, phase, t);
        drawRealisticLung(W / 2 + 60, waterLevel, 1, phase, t);

        // ── CAPACITY READOUT ──────────────────────────────────────────────────
        if (isPlaying) {
            p.fill(80);
            p.noStroke();
            p.textAlign(p.CENTER, p.TOP);
            p.textSize(12);
            p.textStyle(p.NORMAL);
            p.text(Math.round(waterLevel * 100) + '% lung capacity', W / 2, 640);
        }

        // idle message
        if (!isPlaying && cycleTime === 0) {
            p.fill(80);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(15);
            p.textStyle(p.NORMAL);
            p.text('Press play to begin breathing', W / 2, 660);
        }

        // footer
        p.fill(50);
        p.noStroke();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(10);
        p.textStyle(p.NORMAL);
        p.text('BOX BREATHING \u00B7 6s PER PHASE \u00B7 24s CYCLE', W / 2, H - 10);
        p.noFill();
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, p.width - 1, p.height - 1);
    };

    function drawRealisticLung(cx, waterLevel, side, phase, t) {
        var topY = 260;
        var botY = 610;
        var lh = botY - topY;

        // lung dimensions vary slightly with breathing
        var breathScale = 1.0 + waterLevel * 0.08; // lungs expand when full
        var lw = 130 * breathScale;

        // ── LUNG SHAPE POINTS ─────────────────────────────────────────────────
        // Using multiple bezier curves for realistic lung shape
        // Left lung has cardiac notch (indentation for heart)

        var outerTop = cx + side * lw * 0.25;
        var outerMid = cx + side * lw * 0.52;
        var outerBot = cx + side * lw * 0.35;
        var innerTop = cx - side * lw * 0.05;
        var innerMid = cx - side * lw * 0.08;
        var innerBot = cx - side * lw * 0.02;

        // ── WATER FILL ────────────────────────────────────────────────────────
        if (waterLevel > 0.005) {
            var waterTopY = botY - lh * waterLevel;
            var waveTime = p.millis() * 0.003;

            // draw water as layered horizontal slices clipped to lung width
            p.noStroke();
            var slices = 40;
            for (var s = 0; s < slices; s++) {
                var sliceTop = waterTopY + (botY - waterTopY) * (s / slices);
                var sliceBot = waterTopY + (botY - waterTopY) * ((s + 1) / slices);
                var sliceMid = (sliceTop + sliceBot) / 2;

                // figure out lung width at this height
                var frac = (sliceMid - topY) / lh;
                frac = p.constrain(frac, 0, 1);

                var widthAtHeight;
                if (frac < 0.08) {
                    widthAtHeight = p.lerp(0.15, 0.45, frac / 0.08);
                } else if (frac < 0.25) {
                    widthAtHeight = p.lerp(0.45, 0.85, (frac - 0.08) / 0.17);
                } else if (frac < 0.55) {
                    widthAtHeight = p.lerp(0.85, 1.0, (frac - 0.25) / 0.3);
                } else if (frac < 0.8) {
                    widthAtHeight = p.lerp(1.0, 0.9, (frac - 0.55) / 0.25);
                } else {
                    widthAtHeight = p.lerp(0.9, 0.4, (frac - 0.8) / 0.2);
                }

                // cardiac notch on left lung (side === -1)
                if (side === -1 && frac > 0.55 && frac < 0.8) {
                    var notchDepth = Math.sin((frac - 0.55) / 0.25 * Math.PI) * 0.15;
                    // reduce inner edge
                    var innerEdge = cx + lw * 0.08 * widthAtHeight - lw * notchDepth;
                    var outerEdge = cx - lw * 0.52 * widthAtHeight;
                    // water color
                    var depth = s / slices;
                    p.fill(
                        p.lerp(60, 30, depth),
                        p.lerp(150, 100, depth),
                        p.lerp(220, 180, depth),
                        p.lerp(120, 180, depth)
                    );
                    p.rect(outerEdge, sliceTop, innerEdge - outerEdge, sliceBot - sliceTop);
                    continue;
                }

                var halfW = lw * 0.5 * widthAtHeight;
                var left = cx - halfW;
                var right = cx + halfW;

                // shift inner edge slightly
                if (side === -1) {
                    right = cx + halfW * 0.18;
                    left = cx - halfW;
                } else {
                    left = cx - halfW * 0.18;
                    right = cx + halfW;
                }

                var depth2 = s / slices;
                p.fill(
                    p.lerp(60, 30, depth2),
                    p.lerp(150, 100, depth2),
                    p.lerp(220, 180, depth2),
                    p.lerp(120, 180, depth2)
                );
                p.rect(left, sliceTop, right - left, sliceBot - sliceTop);
            }

            // wave line at water surface
            p.stroke(90, 170, 230, 150);
            p.strokeWeight(1.5);
            p.noFill();
            var waveFrac = (waterTopY - topY) / lh;
            waveFrac = p.constrain(waveFrac, 0, 1);
            var ww;
            if (waveFrac < 0.25) ww = p.lerp(0.3, 0.85, waveFrac / 0.25);
            else if (waveFrac < 0.55) ww = p.lerp(0.85, 1.0, (waveFrac - 0.25) / 0.3);
            else ww = p.lerp(1.0, 0.5, (waveFrac - 0.55) / 0.45);

            var waveHalfW = lw * 0.45 * ww;
            p.beginShape();
            for (var wx = -waveHalfW; wx <= waveHalfW; wx += 3) {
                var wy = waterTopY + Math.sin(wx * 0.06 + waveTime + side) * 2.5;
                p.vertex(cx + wx * (side === -1 ? 1 : 1), wy);
            }
            p.endShape();
        }

        // ── LUNG OUTLINE ──────────────────────────────────────────────────────
        p.noFill();
        p.stroke(150, 130, 130, 200);
        p.strokeWeight(2);

        p.beginShape();
        // top (narrow, near trachea)
        p.vertex(innerTop, topY);
        // curve outward to apex
        p.bezierVertex(
            cx + side * lw * 0.1, topY - 15,
            cx + side * lw * 0.35, topY - 8,
            outerTop, topY + lh * 0.08
        );
        // outer edge widens
        p.bezierVertex(
            cx + side * lw * 0.45, topY + lh * 0.2,
            cx + side * lw * 0.52, topY + lh * 0.35,
            outerMid, topY + lh * 0.5
        );
        // outer edge continues down
        p.bezierVertex(
            cx + side * lw * 0.52, topY + lh * 0.65,
            cx + side * lw * 0.48, topY + lh * 0.82,
            outerBot, botY
        );
        // bottom curve
        p.bezierVertex(
            cx + side * lw * 0.15, botY + 12,
            cx - side * lw * 0.02, botY + 8,
            innerBot, botY - lh * 0.08
        );

        // inner edge — cardiac notch on left lung
        if (side === -1) {
            // inner edge goes up with notch
            p.bezierVertex(
                cx + lw * 0.04, topY + lh * 0.75,
                cx + lw * 0.12, topY + lh * 0.65,
                cx + lw * 0.08, topY + lh * 0.55
            );
            // notch curves back in
            p.bezierVertex(
                cx + lw * 0.02, topY + lh * 0.48,
                cx - lw * 0.02, topY + lh * 0.35,
                innerMid, topY + lh * 0.25
            );
        } else {
            // right lung — smooth inner edge
            p.bezierVertex(
                cx - lw * 0.06, topY + lh * 0.7,
                cx - lw * 0.08, topY + lh * 0.45,
                innerMid, topY + lh * 0.25
            );
        }

        // back up to top
        p.bezierVertex(
            cx - side * lw * 0.06, topY + lh * 0.12,
            cx - side * lw * 0.04, topY + 5,
            innerTop, topY
        );
        p.endShape(p.CLOSE);

        // ── BRONCHIOLE BRANCHES (subtle internal lines) ───────────────────────
        p.stroke(130, 115, 115, 60);
        p.strokeWeight(1);
        p.noFill();

        // main bronchus line inside lung
        var branchStartX = cx - side * lw * 0.02;
        var branchStartY = topY + lh * 0.1;
        var branchMidX = cx + side * lw * 0.1;
        var branchMidY = topY + lh * 0.35;

        p.bezier(branchStartX, branchStartY, cx, topY + lh * 0.18, branchMidX - side * 10, branchMidY - 20, branchMidX, branchMidY);

        // smaller branches
        p.bezier(branchMidX, branchMidY, branchMidX + side * 15, branchMidY + 20, cx + side * lw * 0.3, branchMidY + 40, cx + side * lw * 0.32, branchMidY + 60);
        p.bezier(branchMidX, branchMidY, branchMidX + side * 5, branchMidY + 30, cx + side * lw * 0.15, branchMidY + 70, cx + side * lw * 0.18, branchMidY + 100);
        p.bezier(branchMidX, branchMidY, branchMidX - side * 5, branchMidY + 25, cx - side * lw * 0.02, branchMidY + 60, cx, branchMidY + 85);
    }

    p.windowResized = function() { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});