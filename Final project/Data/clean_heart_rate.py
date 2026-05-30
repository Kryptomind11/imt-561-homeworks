"""
PhysioNet Heart Rate Oscillations during Meditation — Cleaning Pipeline
Converts raw beat-to-beat files into a single P5.js-ready CSV.

Input: Raw text files with 2 columns (elapsed_time, instantaneous_heart_rate_bpm)
Output: heart_rate_meditation_clean.csv

Groups:
  - chi: 8 Chi meditators (C1-C8), each has .med (meditation) and .pre (pre-meditation)
  - yoga: 4 Kundalini Yoga meditators (Y1-Y4), each has .med and .pre
  - normal: 11 spontaneous breathing subjects (N1-N11), single recording
  - metron: 14 metronomic breathing subjects (M1-M14), single recording
  - ironman: 9 elite athletes (I1-I9), single recording
"""

import csv
import os
import glob
import re

DATA = "/home/claude/physionet/heart-rate-oscillations-during-meditation-1.0.0/data"
OUT = "/home/claude/heart_rate_meditation_clean.csv"

rows = []

def parse_file(filepath):
    """Parse a PhysioNet heart rate file. Returns list of (elapsed_sec, bpm) tuples."""
    data = []
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) >= 2:
                try:
                    elapsed = float(parts[0])
                    bpm = float(parts[1])
                    if bpm > 0 and bpm < 250:  # sanity check
                        data.append((elapsed, bpm))
                except ValueError:
                    continue
    return data

def add_rows(data, group, subject_id, condition, rows):
    """Convert parsed data to CSV rows with normalized elapsed time."""
    if not data:
        return
    start_time = data[0][0]
    for i, (elapsed, bpm) in enumerate(data):
        relative_sec = round(elapsed - start_time, 3)
        relative_min = round(relative_sec / 60, 3)
        normalized = round(relative_sec / (data[-1][0] - start_time), 4) if len(data) > 1 else 0
        rows.append({
            'group': group,
            'subject_id': subject_id,
            'condition': condition,
            'beat_number': i + 1,
            'elapsed_sec': elapsed,
            'relative_sec': relative_sec,
            'relative_min': relative_min,
            'normalized_position': normalized,
            'heart_rate_bpm': round(bpm, 2),
            'recording_duration_sec': round(data[-1][0] - start_time, 1)
        })

# 1. Chi meditators (C1-C8, med + pre)
for i in range(1, 9):
    med_file = os.path.join(DATA, "chi", f"C{i}.med")
    pre_file = os.path.join(DATA, "chi", f"C{i}.pre")
    if os.path.exists(med_file):
        data = parse_file(med_file)
        add_rows(data, "chi_meditation", f"C{i}", "meditation", rows)
    if os.path.exists(pre_file):
        data = parse_file(pre_file)
        add_rows(data, "chi_meditation", f"C{i}", "pre_meditation", rows)

# 2. Yoga meditators (Y1-Y4, med + pre)
for i in range(1, 5):
    med_file = os.path.join(DATA, "yoga", f"Y{i}.med")
    pre_file = os.path.join(DATA, "yoga", f"Y{i}.pre")
    if os.path.exists(med_file):
        data = parse_file(med_file)
        add_rows(data, "kundalini_yoga", f"Y{i}", "meditation", rows)
    if os.path.exists(pre_file):
        data = parse_file(pre_file)
        add_rows(data, "kundalini_yoga", f"Y{i}", "pre_meditation", rows)

# 3. Normal / spontaneous breathing (N1-N11)
for i in range(1, 12):
    filepath = os.path.join(DATA, "normal", f"N{i}")
    if os.path.exists(filepath):
        data = parse_file(filepath)
        add_rows(data, "spontaneous_breathing", f"N{i}", "baseline", rows)

# 4. Metronomic breathing (M1-M14)
for i in range(1, 15):
    filepath = os.path.join(DATA, "metron", f"M{i}")
    if os.path.exists(filepath):
        data = parse_file(filepath)
        add_rows(data, "metronomic_breathing", f"M{i}", "baseline", rows)

# 5. Ironman / elite athletes (I1-I9)
for i in range(1, 10):
    filepath = os.path.join(DATA, "ironman", f"I{i}")
    if os.path.exists(filepath):
        data = parse_file(filepath)
        add_rows(data, "elite_athlete", f"I{i}", "baseline", rows)

# Write CSV
fields = ['group', 'subject_id', 'condition', 'beat_number', 'elapsed_sec',
          'relative_sec', 'relative_min', 'normalized_position',
          'heart_rate_bpm', 'recording_duration_sec']

with open(OUT, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)

print(f"Total rows: {len(rows)}")
print(f"Written to: {OUT}")

# Summary stats
from collections import Counter
groups = Counter(r['group'] for r in rows)
subjects = Counter(r['subject_id'] for r in rows)
conditions = Counter(r['condition'] for r in rows)
bpms = [r['heart_rate_bpm'] for r in rows]

print(f"\n=== SUMMARY ===")
print(f"Groups: {dict(groups)}")
print(f"Unique subjects: {len(subjects)}")
print(f"Conditions: {dict(conditions)}")
print(f"BPM range: {min(bpms):.1f} – {max(bpms):.1f}")
print(f"BPM mean: {sum(bpms)/len(bpms):.1f}")
