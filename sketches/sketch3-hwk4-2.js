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
    var sessionElapsed = 0;

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
                sessionElapsed = 0;
            }
        }
    };

    p.draw = function() {
        var now = p.millis();
        var dt = (now - lastMillis) / 1000;
        lastMillis = now;
        if (isPlaying) {
            cycleTime = (cycleTime + dt) % (PHASE_DUR * 4);
            sessionElapsed += dt;
        }

        var phase = Math.floor(cycleTime / PHASE_DUR);
        var t = (cycleTime % PHASE_DUR) / PHASE_DUR;

        p.background(12, 14, 20);

        var waterLevel = 0;
        if (phase === 0) waterLevel = easeInOut(t);
        else if (phase === 1) waterLevel = 1;
        else if (phase === 2) waterLevel = 1 - easeInOut(t);
        else waterLevel = 0;

        // ── PHASE LABEL ───────────────────────────────────────────────────────
        var col = isPlaying ? p.color(COLORS[phase]) : p.color(70);
        p.textFont('monospace');
        p.noStroke();
        p.fill(col);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(28);
        p.textStyle(p.BOLD);
        if (isPlaying) p.text(PHASES[phase], W / 2, 20);
        else {
            p.fill(70);
            p.text('READY', W / 2, 20);
        }

        p.textSize(16);
        p.textStyle(p.NORMAL);
        p.fill(isPlaying ? 140 : 50);
        if (isPlaying) p.text(Math.ceil(PHASE_DUR * (1 - t)) + 's', W / 2, 55);
        else p.text('--', W / 2, 55);

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
        var tracheaTop = 170,
            tracheaBot = 260,
            splitY = 270;

        p.stroke(160, 140, 140);
        p.strokeWeight(2);
        p.noFill();
        p.line(W / 2 - 12, tracheaTop, W / 2 - 12, tracheaBot);
        p.line(W / 2 + 12, tracheaTop, W / 2 + 12, tracheaBot);
        p.stroke(140, 120, 120);
        p.strokeWeight(1.5);
        for (var ring = 0; ring < 6; ring++) p.arc(W / 2, tracheaTop + 8 + ring * 14, 24, 6, 0, 180);

        p.stroke(160, 140, 140);
        p.strokeWeight(2);
        p.noFill();
        p.bezier(W / 2 - 12, tracheaBot, W / 2 - 30, splitY, W / 2 - 80, splitY + 10, W / 2 - 100, splitY + 30);
        p.bezier(W / 2 + 2, tracheaBot + 4, W / 2 - 15, splitY + 5, W / 2 - 60, splitY + 18, W / 2 - 80, splitY + 38);
        p.bezier(W / 2 + 12, tracheaBot, W / 2 + 30, splitY, W / 2 + 80, splitY + 10, W / 2 + 100, splitY + 30);
        p.bezier(W / 2 - 2, tracheaBot + 4, W / 2 + 15, splitY + 5, W / 2 + 60, splitY + 18, W / 2 + 80, splitY + 38);

        // ── LUNGS (symmetric, no cardiac notch) ───────────────────────────────
        drawLung(W / 2 - 60, waterLevel, -1);
        drawLung(W / 2 + 60, waterLevel, 1);

        // ── SESSION TIMER ─────────────────────────────────────────────────────
        if (isPlaying) {
            var totalSec = Math.floor(sessionElapsed);
            var mins = Math.floor(totalSec / 60);
            var secs = totalSec % 60;
            var timeStr = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
            p.fill(90);
            p.noStroke();
            p.textAlign(p.CENTER, p.TOP);
            p.textSize(13);
            p.textStyle(p.NORMAL);
            p.text('session time', W / 2, 635);
            p.fill(140);
            p.textSize(20);
            p.textStyle(p.BOLD);
            p.text(timeStr, W / 2, 652);
        }

        if (!isPlaying && cycleTime === 0) {
            p.fill(80);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(15);
            p.textStyle(p.NORMAL);
            p.text('Press play to begin breathing', W / 2, 660);
        }

        p.fill(50);
        p.noStroke();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(10);
        p.textStyle(p.NORMAL);
        p.noFill();
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, p.width - 1, p.height - 1);
    };

    function drawLung(cx, waterLevel, side) {
        var topY = 260,
            botY = 610;
        var lh = botY - topY;
        var breathScale = 1.0 + waterLevel * 0.08;
        var lw = 130 * breathScale;

        // ── WATER FILL ────────────────────────────────────────────────────────
        if (waterLevel > 0.005) {
            var waterTopY = botY - lh * waterLevel;
            p.noStroke();
            var slices = 40;
            for (var s = 0; s < slices; s++) {
                var sliceTop = waterTopY + (botY - waterTopY) * (s / slices);
                var sliceBot = waterTopY + (botY - waterTopY) * ((s + 1) / slices);
                var sliceMid = (sliceTop + sliceBot) / 2;

                var frac = p.constrain((sliceMid - topY) / lh, 0, 1);

                var widthAtHeight;
                if (frac < 0.08) widthAtHeight = p.lerp(0.15, 0.45, frac / 0.08);
                else if (frac < 0.25) widthAtHeight = p.lerp(0.45, 0.85, (frac - 0.08) / 0.17);
                else if (frac < 0.55) widthAtHeight = p.lerp(0.85, 1.0, (frac - 0.25) / 0.3);
                else if (frac < 0.8) widthAtHeight = p.lerp(1.0, 0.9, (frac - 0.55) / 0.25);
                else widthAtHeight = p.lerp(0.9, 0.4, (frac - 0.8) / 0.2);

                var halfW = lw * 0.5 * widthAtHeight;
                var left, right;
                if (side === -1) {
                    right = cx + halfW * 0.18;
                    left = cx - halfW;
                } else {
                    left = cx - halfW * 0.18;
                    right = cx + halfW;
                }

                var depth = s / slices;
                p.fill(p.lerp(60, 30, depth), p.lerp(150, 100, depth), p.lerp(220, 180, depth), p.lerp(120, 180, depth));
                p.rect(left, sliceTop, right - left, sliceBot - sliceTop);
            }

            // wave line
            p.stroke(90, 170, 230, 150);
            p.strokeWeight(1.5);
            p.noFill();
            var waveFrac = p.constrain((waterTopY - topY) / lh, 0, 1);
            var ww;
            if (waveFrac < 0.25) ww = p.lerp(0.3, 0.85, waveFrac / 0.25);
            else if (waveFrac < 0.55) ww = p.lerp(0.85, 1.0, (waveFrac - 0.25) / 0.3);
            else ww = p.lerp(1.0, 0.5, (waveFrac - 0.55) / 0.45);
            var waveHalfW = lw * 0.45 * ww;
            var waveTime = p.millis() * 0.003;
            p.beginShape();
            for (var wx = -waveHalfW; wx <= waveHalfW; wx += 3) {
                p.vertex(cx + wx, waterTopY + Math.sin(wx * 0.06 + waveTime + side) * 2.5);
            }
            p.endShape();
        }

        // ── LUNG OUTLINE (symmetric for both sides) ───────────────────────────
        var outerTop = cx + side * lw * 0.25;
        var outerMid = cx + side * lw * 0.52;
        var outerBot = cx + side * lw * 0.35;
        var innerTop = cx - side * lw * 0.05;
        var innerMid = cx - side * lw * 0.08;
        var innerBot = cx - side * lw * 0.02;

        p.noFill();
        p.stroke(150, 130, 130, 200);
        p.strokeWeight(2);
        p.beginShape();
        p.vertex(innerTop, topY);
        p.bezierVertex(cx + side * lw * 0.1, topY - 15, cx + side * lw * 0.35, topY - 8, outerTop, topY + lh * 0.08);
        p.bezierVertex(cx + side * lw * 0.45, topY + lh * 0.2, cx + side * lw * 0.52, topY + lh * 0.35, outerMid, topY + lh * 0.5);
        p.bezierVertex(cx + side * lw * 0.52, topY + lh * 0.65, cx + side * lw * 0.48, topY + lh * 0.82, outerBot, botY);
        p.bezierVertex(cx + side * lw * 0.15, botY + 12, cx - side * lw * 0.02, botY + 8, innerBot, botY - lh * 0.08);
        // smooth inner edge (same for both lungs — no notch)
        p.bezierVertex(cx - side * lw * 0.06, topY + lh * 0.7, cx - side * lw * 0.08, topY + lh * 0.45, innerMid, topY + lh * 0.25);
        p.bezierVertex(cx - side * lw * 0.06, topY + lh * 0.12, cx - side * lw * 0.04, topY + 5, innerTop, topY);
        p.endShape(p.CLOSE);

        // ── BRONCHIOLE BRANCHES ───────────────────────────────────────────────
        p.stroke(130, 115, 115, 60);
        p.strokeWeight(1);
        p.noFill();
        var bsX = cx - side * lw * 0.02,
            bsY = topY + lh * 0.1;
        var bmX = cx + side * lw * 0.1,
            bmY = topY + lh * 0.35;
        p.bezier(bsX, bsY, cx, topY + lh * 0.18, bmX - side * 10, bmY - 20, bmX, bmY);
        p.bezier(bmX, bmY, bmX + side * 15, bmY + 20, cx + side * lw * 0.3, bmY + 40, cx + side * lw * 0.32, bmY + 60);
        p.bezier(bmX, bmY, bmX + side * 5, bmY + 30, cx + side * lw * 0.15, bmY + 70, cx + side * lw * 0.18, bmY + 100);
        p.bezier(bmX, bmY, bmX - side * 5, bmY + 25, cx - side * lw * 0.02, bmY + 60, cx, bmY + 85);
    }

    p.windowResized = function() { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});